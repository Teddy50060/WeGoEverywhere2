// นำเข้า module fs (file system) สำหรับอ่าน/เขียนไฟล์
const fs = require('fs');
// นำเข้า module path สำหรับจัดการ path ของไฟล์
const path = require('path');

// สร้าง path เต็มไปยังไฟล์ OpenAPI.ts
// __dirname = ตำแหน่งของไฟล์ patch-openapi.js นี้ (อยู่ใน scripts/)
// '../src/lib/api/core/OpenAPI.ts' = ขึ้นไป 1 ระดับ แล้วเข้าไปที่ src/lib/api/core/OpenAPI.ts
const openApiPath = path.join(__dirname, '../src/lib/api/core/OpenAPI.ts');

// อ่านเนื้อหาทั้งหมดของไฟล์ OpenAPI.ts
// 'utf8' = กำหนดให้อ่านเป็น text ภาษาอังกฤษ/ไทย (ไม่ใช่ binary)
let content = fs.readFileSync(openApiPath, 'utf8');

// แทนที่ config
content = content.replace(
  // Regular Expression (regex) หาส่วนที่เป็น: export const OpenAPI: OpenAPIConfig = { ... };
  // [\s\S]*? = จับทุกอักษร (รวม newline) แบบ non-greedy (หยุดเมื่อเจอ }; แรก)
  /export const OpenAPI: OpenAPIConfig = \{[\s\S]*?\};/,

  // ข้อความใหม่ที่จะแทนที่เข้าไป
  // ใช้ template string (backtick) เพื่อให้เขียนหลายบรรทัดได้
  `export const OpenAPI: OpenAPIConfig = {
    BASE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    VERSION: '1',
    WITH_CREDENTIALS: true,
    CREDENTIALS: 'include',
    TOKEN: undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
};`
);

// เขียนเนื้อหาใหม่ (ที่แก้ไขแล้ว) กลับเข้าไปในไฟล์เดิม
fs.writeFileSync(openApiPath, content);
// แสดงข้อความยืนยันว่าแก้ไขสำเร็จแล้ว
console.log('✅ OpenAPI config patched successfully');