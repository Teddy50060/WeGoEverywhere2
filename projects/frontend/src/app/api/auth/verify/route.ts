import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt"; // Node.js runtime safe

export async function GET(req: NextRequest) {
  try {
    // TODO: fix this soon
    const token = req.cookies.get("jwt")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ valid: false, payload: null });

    const payload = verifyToken(token); // คืน null ถ้าไม่ถูกต้อง
    if (!payload) return NextResponse.json({ valid: false, payload: null });

    return NextResponse.json({ valid: true, payload });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false, payload: null });
  }
}