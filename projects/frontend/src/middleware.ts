import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("jwt")?.value;
  let valid = false;
  if (accessToken) {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
      headers: { cookie: `jwt=${accessToken}` },
    });
    const data = await res.json();
    valid = data.valid;
  }

  const { pathname } = req.nextUrl;
  

  // ยกเว้นไฟล์ระบบและ public assets
  const isPublicAsset = pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico");

  // ยกเว้น public pages
  const isPublicPath = ["/login", "/register", "/profile-setup"].includes(pathname);

  // ตรวจว่าเป็น refresh API
  const isRefreshApi = pathname === "/api/auth/refresh";

  // check for frontend image
  const isImage = pathname.startsWith("/images");

  // ถ้าไม่ใช่ public asset, public path, api, frontend image และไม่ใช่ refresh API → redirect
  if (!isPublicAsset && !isPublicPath && !isRefreshApi && !valid && !isImage) {
    return NextResponse.redirect(
      new URL(`/api/auth/refresh?next=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  return NextResponse.next();
}

// matcher เฉพาะ route ที่ไม่ใช่ _next, favicon.ico, api
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
