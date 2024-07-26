// server/websocket-server.js
const WebSocket = require('ws');
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-firebase-adminsdk.json'); // Adjust the path to your Firebase service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com' // Replace with your Firebase database URL
});

const db = admin.database();
const usersRef = db.ref('users');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.isAlive = true;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const userId = data.userId;

    // Save user as active in the database
    usersRef.child(userId).update({
      isActive: true,
      lastActive: Date.now()
    });

    // Handle incoming messages
    ws.on('message', () => {
      ws.isAlive = true;
      usersRef.child(userId).update({
        lastActive: Date.now()
      });
    });

    ws.on('close', () => {
      usersRef.child(userId).update({
        isActive: false
      });
    });

    ws.on('error', () => {
      usersRef.child(userId).update({
        isActive: false
      });
    });
  });
});

// Heartbeat check to detect disconnected clients
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(null, false, true);
  });
}, 10000);

wss.on('close', () => {
  clearInterval(interval);
});
