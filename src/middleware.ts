import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes and admin API routes
  if (pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];

      // Decode base64
      const decodedValue = atob(authValue);
      const [user, pwd] = decodedValue.split(':');

      // Default credentials if not set in environment variables
      const validUser = process.env.ADMIN_USERNAME || 'admin';
      const validPassword = process.env.ADMIN_PASSWORD || 'pineapple123';

      if (user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    }

    // Request basic auth if no valid credentials provided
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Dashboard"',
      },
    });
  }

  // Allow all other routes without authentication
  return NextResponse.next();
}
