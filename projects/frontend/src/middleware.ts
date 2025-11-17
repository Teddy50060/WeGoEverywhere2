import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // LOG EVERYTHING
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Path:', pathname);
  console.log('All cookies:', req.cookies.getAll());
  console.log('JWT cookie:', req.cookies.get("jwt"));
  console.log('Cookie header:', req.headers.get('cookie'));
  console.log('=======================');
  
  // Temporarily allow everything through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};