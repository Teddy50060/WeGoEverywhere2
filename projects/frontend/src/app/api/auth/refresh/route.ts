// /app/api/auth/refresh/route.ts
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { AuthService } from "@/lib/api/services/AuthService";
import { setOpenApiCookieHeader } from "@/lib/auth/CookieHeader";
import { verifyToken } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = await setOpenApiCookieHeader(); // set OpenAPI.HEADERS
    // เรียก NestJS refresh token
    const data = await AuthService.authControllerRefreshJwtToken();

    // อ่าน query param next
    const url = new URL(req.url);
    const nextPath = url.searchParams.get("next") || "/";
    const res = NextResponse.redirect(new URL(nextPath, req.url));
    // set cookie ให้ browser
    res.cookies.set("jwt", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60, // 15 นาที
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
