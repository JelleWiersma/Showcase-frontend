import { test, expect } from '@playwright/test';

test('form fields are present', async ({ page }) => {
  await page.goto('/contact');

  const nameField = await page.$('#name');
  const surnameField = await page.$('#surname');
  const emailField = await page.$('#email');
  const phoneField = await page.$('#phone');
  const subjectField = await page.$('#subject');
  const messageField = await page.$('#message');
  const recaptcha = await page.$('#recaptcha');

  expect(nameField).toBeTruthy();
  expect(surnameField).toBeTruthy();
  expect(emailField).toBeTruthy();
  expect(phoneField).toBeTruthy();
  expect(subjectField).toBeTruthy();
  expect(messageField).toBeTruthy();
  expect(recaptcha).toBeTruthy();
});

test('form submission with valid data', async ({ page, browserName }) => {
  await page.goto('/contact');

  // Find and click the cookie banner accept button
  const cookieBannerAcceptButton = await page.waitForSelector('.cookie-banner button', { timeout: 5000 });
  if (cookieBannerAcceptButton) {
    await cookieBannerAcceptButton.click();
  }

  // Fill in the form fields
  await page.fill('#name', 'John');
  await page.fill('#surname', 'Doe');
  await page.fill('#email', 'john.doe@example.com');
  await page.fill('#phone', '+31656789054');
  await page.fill('#subject', 'Test Subject');
  await page.fill('#message', 'Test Message');

  // Find and click recaptcha (should use developer keys)
  const frame = page.frames().find(frame => frame.url().includes('https://www.google.com/recaptcha/api2/anchor'));
  if (frame) {
    await frame.click('.recaptcha-checkbox');
  }

  //scroll to the submit button
  const submitButton = await page.$('button[type="submit"]');
  await submitButton?.scrollIntoViewIfNeeded();

  // Assuming all fields are correctly filled in, submit the form
  await submitButton?.click();

  // Wait for either the success message or the failure message to appear
  const successMessage = await page.$('.success-message');
  const failureMessage = await page.$('.failure-message');

  if (successMessage) {
    await expect(successMessage).toBeTruthy();
  } else if (failureMessage){
    console.warn('Contact: Failure message was shown');
    await expect(failureMessage).toBeTruthy();
  } else {
    throw new Error('Neither success nor failure message was shown');
  }

  // Expect the form fields to be empty
  expect(await page.inputValue('#name')).toBe('');
  expect(await page.inputValue('#surname')).toBe('');
  expect(await page.inputValue('#email')).toBe('');
  expect(await page.inputValue('#phone')).toBe('');
  expect(await page.inputValue('#subject')).toBe('');
  expect(await page.inputValue('#message')).toBe('');
});