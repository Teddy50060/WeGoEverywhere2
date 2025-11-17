export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

console.log(' Socket URL:', SOCKET_URL);
console.log(' Env var:', process.env.NEXT_PUBLIC_SOCKET_URL);
console.log(' Next URL',process.env.NEXT_PUBLIC_API_URL);