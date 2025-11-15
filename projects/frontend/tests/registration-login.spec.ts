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
  
  // ตรวจสอบว่า checkbox ถูกติ๊ก
  const isChecked = await page.isChecked('input[name="accept"]');
  expect(isChecked).toBe(true);

  // กดปุ่ม Next และรอหน้าถัดไป
  await Promise.all([
    page.waitForNavigation({ url: /profile-setup/ }),   
    page.click('button[type="submit"]'),
  ]);

  // ตรวจสอบว่าไปหน้าถัดไป (Profile Setup)
  expect(page.url()).toContain('/profile-setup');
  
  // หน้า Profile Setup
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.fill('input[name="birthdate"]', '2000-01-01');
  await page.selectOption('select[name="sex"]', { label: 'Male' });
  await page.fill('input[name="telephoneNumber"]', '1234567890');
  await page.fill('input[name="bio"]', 'I am a software developer.');

  // ส่งข้อมูลและไปหน้า Home
  await Promise.all([
    page.waitForNavigation({ url: '/' }), // คอยให้ไปที่ home page
    page.click('button[type="submit"]'), // กด Create Account
  ]);

  // ตรวจสอบว่ามาถึงหน้าหลักแล้ว
  expect(page.url()).toBe('http://localhost:3000/'); // URL ของหน้า home page
});


