import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export async function POST(request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'CREDENTIALS_MISSING', message: 'Firebase Admin SDK is not configured on the server. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PAYLOAD', message: 'Missing userId' },
        { status: 400 }
      );
    }

    // Remove user from the matchmaking queue
    await adminDb.ref(`queue/${userId}`).remove();

    return NextResponse.json({ success: true, message: 'Successfully left the queue' });
  } catch (error) {
    console.error('Match leave error:', error);
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
