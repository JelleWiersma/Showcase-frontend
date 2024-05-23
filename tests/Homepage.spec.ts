import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});


test('has the correct title', async ({ page }) => {
  await expect(page).toHaveTitle('Home');
});

test('displays the face image', async ({ page }) => {
  const image = await page.$('.round-image');
  expect(image).toBeTruthy();
});

test('displays the title text', async ({ page }) => {
  const title = await page.$('.title-text');
  expect(await title?.innerText()).toBe('Jelle Wiersma');
});

test('displays the subtitle', async ({ page }) => {
  const subtitle = await page.$('.subtitle');
  expect(subtitle).toBeTruthy();
});

test('displays the bulleted list', async ({ page }) => {
  const list = await page.$('.bulleted-list');
  expect(list).toBeTruthy();
});

test('has a LinkedIn link', async ({ page }) => {
  const link = await page.$('.bulleted-list a');
  expect(await link?.getAttribute('href')).toBe('https://www.linkedin.com/in/jelle-wiersma-9730a2207/');
});
