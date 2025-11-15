import { test, expect } from '@playwright/test';

test('create account with checkbox ticked', async ({ page }) => {

  // Mock API Response
  await page.route('**/api/consent/current-policy', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ policy: "Mock policy loaded successfully" })
    });
  });

  // ไปที่หน้า register
  await page.goto('http://localhost:3000/register');

  // รอให้ form ทั้งหมดพร้อม
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', 'you@example.com');
  await page.fill('input[name="password"]', 'Password_Test55');
  await page.fill('input[name="confirmPassword"]', 'Password_Test55');
  
  // รอ checkbox ให้ปรากฏ
  await page.waitForSelector('input[name="accept"]', { state: 'visible' });
  
  // ติ๊ก checkbox "I accept the policy"
  await page.check('input[name="accept"]');
  await page.waitForTimeout(200);
  
  // ตรวจสอบว่า checkbox ถูกติ๊ก
  const isChecked = await page.isChecked('input[name="accept"]');
  expect(isChecked).toBe(true);

  // กดปุ่ม Next และรอหน้าถัดไป
  await page.click('button[type="submit"]');
  await page.waitForURL(/profile-setup/);

  // ตรวจสอบว่าไปหน้าถัดไป (Profile Setup)
  expect(page.url()).toContain('/profile-setup');
  
  // หน้า Profile Setup
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.fill('input[name="birthdate"]', '2000-01-01');
  await page.selectOption('select[name="sex"]', { label: 'Male' });
  await page.fill('input[name="telephoneNumber"]', '1234567890');
  await page.fill('input[name="bio"]', 'I am a software developer.');
  await page.waitForTimeout(200);
  
  // ส่งข้อมูลและไปหน้า Home
  await page.click('button[type="submit"]'); // กด Create Account
  await page.waitForURL('http://localhost:3000/'); // คอยให้ไปที่หน้า Home

  // รอให้ element ในหน้า Home ปรากฏ
  await page.waitForSelector('text=Up Coming Event');  // รอให้ section "Up Coming Event" ปรากฏ

  // ตรวจสอบว่าไปหน้า Home
  expect(page.url()).toBe('http://localhost:3000/'); // URL ของหน้า Home

});


test('login with email & password', async ({ page }) => {
  // ไปที่หน้า Login
  await page.goto('http://localhost:3000/login');
  
  // กรอกข้อมูลที่ถูกต้อง
  await page.fill('input[name="email"]', 'you@example.com');
  await page.fill('input[name="password"]', 'Password_Test55');
  
  // รอให้ปุ่ม Log In ปรากฏ
  await page.waitForSelector('button[type="submit"]'); // รอให้ปุ่ม submit ปรากฏ
  
  // กดปุ่ม Log In
  await page.click('button[type="submit"]'); // กดปุ่ม submit (Log In)
  
  // รอการเปลี่ยนหน้าไปที่ Home
  await page.waitForURL('http://localhost:3000/');  // คอยให้ไปที่หน้า Home
  
  // รอให้ element ในหน้า Home ปรากฏ (เช่น "Up Coming Event")
  await page.waitForSelector('text=Up Coming Event');  // รอให้ section "Up Coming Event" ปรากฏ
  
  // ตรวจสอบว่าไปหน้า Home
  expect(page.url()).toBe('http://localhost:3000/'); // URL ของหน้า Home
});