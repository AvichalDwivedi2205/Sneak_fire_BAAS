import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // or cert() if you're using a service account key
});

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Retrieve token from Authorization header
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (token) {
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const user = decodedToken;

      // If authenticated user tries to access login/signup page, redirect to home
      if (user && (path === '/login' || path === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  // If no token and user is trying to access profile, redirect to login
  if (!token && path === '/profile') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
