import { auth } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Protect admin routes - only allow users with admin role
  if (pathname.startsWith('/admin')) {
    if (!session?.user || session.user.role !== 'admin') {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // Add more protected routes if needed
  
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    // Add more protected paths as needed
  ],
};
