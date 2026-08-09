import { NextResponse } from 'next/server';
import { adminDb, admin } from '@/firebase/admin';

export async function POST(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'CREDENTIALS_MISSING', message: 'Firebase Admin SDK is not configured on the server. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId, interests, matchType } = body;
    const sanitizedMatchType = ['text', 'audio', 'video'].includes(matchType) ? matchType : 'text';

    // 1. Basic validation
    if (!userId || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PAYLOAD', message: 'Missing userId or interests array' },
        { status: 400 }
      );
    }

    // Sanitize interests (max 5 interests, max 25 chars each)
    const sanitizedInterests = interests
      .slice(0, 5)
      .map(i => String(i).trim().toLowerCase().slice(0, 25))
      .filter(i => i.length > 0);

    if (sanitizedInterests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PAYLOAD', message: 'Interests are empty after sanitization' },
        { status: 400 }
      );
    }

    // 2. Clear any stale match node for this user first
    await adminDb.ref(`matches/${userId}`).remove();

    // 3. Perform matching inside a transaction on `/queue`
    const queueRef = adminDb.ref('queue');
    let matchResult = null;

    const transactionResult = await queueRef.transaction((currentQueue) => {
      // If queue doesn't exist, create it and put the user in pending state
      if (!currentQueue) {
        currentQueue = {};
        currentQueue[userId] = {
          interests: sanitizedInterests,
          matchType: sanitizedMatchType,
          joinedAt: Date.now()
        };
        matchResult = { status: 'pending' };
        return currentQueue;
      }

      // Search for a match in the queue with compatible connection mode
      let bestCandidateId = null;
      let bestSharedInterests = [];
      let maxSharedCount = 0;

      for (const [candidateId, candidate] of Object.entries(currentQueue)) {
        if (candidateId === userId) continue;

        // Strict mode match constraint (Text matches Text, Audio matches Audio, Video matches Video)
        const candidateMode = candidate.matchType || 'text';
        if (candidateMode !== sanitizedMatchType) continue;

        // Calculate overlap of interests
        const shared = candidate.interests.filter(i => sanitizedInterests.includes(i));
        if (shared.length > maxSharedCount) {
          maxSharedCount = shared.length;
          bestCandidateId = candidateId;
          bestSharedInterests = shared;
        }
      }

      // If no interest match, see if we can match randomly (FIFO) with same mode
      if (!bestCandidateId) {
        const hasRandomInterest = sanitizedInterests.includes('random');
        
        for (const [candidateId, candidate] of Object.entries(currentQueue)) {
          if (candidateId === userId) continue;

          const candidateMode = candidate.matchType || 'text';
          if (candidateMode !== sanitizedMatchType) continue;

          const candidateHasRandom = candidate.interests.includes('random');
          if (hasRandomInterest || candidateHasRandom) {
            bestCandidateId = candidateId;
            bestSharedInterests = ['random'];
            break;
          }
        }
      }

      // Action based on search result
      if (bestCandidateId) {
        // Match found! Delete candidate from queue
        delete currentQueue[bestCandidateId];
        delete currentQueue[userId]; // In case user was already there

        matchResult = {
          status: 'matched',
          matchedUserId: bestCandidateId,
          sharedInterests: bestSharedInterests
        };
      } else {
        // No match found, add user to queue
        currentQueue[userId] = {
          interests: sanitizedInterests,
          matchType: sanitizedMatchType,
          joinedAt: Date.now()
        };
        matchResult = { status: 'pending' };
      }

      return currentQueue;
    });

    // 4. If transaction succeeded and we matched, create the chatRoom
    if (transactionResult.committed && matchResult && matchResult.status === 'matched') {
      const cleanUser1 = userId.replace('user_', '');
      const cleanUser2 = matchResult.matchedUserId.replace('user_', '');
      const sorted = [cleanUser1, cleanUser2].sort();
      const chatRoomId = `${sorted[0]}RM${sorted[1]}`;

      // Write chatRoom node
      await adminDb.ref(`chatRooms/${chatRoomId}`).set({
        participants: {
          [userId]: true,
          [matchResult.matchedUserId]: true
        },
        matchedInterests: matchResult.sharedInterests,
        matchType: sanitizedMatchType,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        lastActive: admin.database.ServerValue.TIMESTAMP
      });

      // Write matches paths to notify both clients
      const matchDataA = { chatRoomId, matchedUserId: matchResult.matchedUserId, matchType: sanitizedMatchType };
      const matchDataB = { chatRoomId, matchedUserId: userId, matchType: sanitizedMatchType };

      await Promise.all([
        adminDb.ref(`matches/${userId}`).set(matchDataA),
        adminDb.ref(`matches/${matchResult.matchedUserId}`).set(matchDataB)
      ]);

      return NextResponse.json({ success: true, status: 'matched', chatRoomId, matchedUserId: matchResult.matchedUserId, matchType: sanitizedMatchType });
    }

    // If transaction succeeded and we are pending, return status
    if (transactionResult.committed && matchResult && matchResult.status === 'pending') {
      return NextResponse.json({ success: true, status: 'pending' });
    }

    // Fallback if transaction was not committed
    return NextResponse.json(
      { success: false, error: 'TRANSACTION_ABORTED', message: 'Could not complete matchmaking request' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Match join error:', error);
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
