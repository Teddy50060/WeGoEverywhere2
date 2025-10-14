// src/lib/getCookieHeader.ts

import { cookies } from "next/headers";
import { OpenAPI } from "../api";

export async function setOpenApiCookieHeader() {
  const cookieStore = await cookies(); // sync call (Server Component / Server Action)
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  OpenAPI.HEADERS = { Cookie: cookieHeader };
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
  return cookieHeader; // ถ้าอยาก log / return
}
