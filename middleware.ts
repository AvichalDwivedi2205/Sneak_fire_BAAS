// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from './config/firebase-admin';

// Define protected routes that require authentication
const protectedRoutes = ['/profile'];
// Define authentication routes that should not be accessed when authenticated
const authRoutes = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  // Check if user is authenticated
  let isAuthenticated = false;
  
  if (session) {
    try {
      // Verify session cookie with Firebase Admin
      await adminAuth.verifySessionCookie(session, true);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Redirect logic
  if (isAuthenticated) {
    // If user is authenticated and tries to access auth routes, redirect to home
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    // If user is not authenticated and tries to access protected routes, redirect to signin
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [...protectedRoutes, ...authRoutes]
};