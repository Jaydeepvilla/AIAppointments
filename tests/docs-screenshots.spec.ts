import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Define all routes we need screenshots for
const SCREENS = [
  { name: 'Dashboard', route: '/dashboard' },
  { name: 'Setup Wizard', route: '/setup' },
  { name: 'Business Profile', route: '/profile' },
  { name: 'Account Settings', route: '/settings/account' },
  { name: 'Knowledge Base', route: '/kb' },
  { name: 'Services', route: '/services' },
  { name: 'Appointments', route: '/appointments' },
  { name: 'Inbox', route: '/inbox' },
  { name: 'Conversations', route: '/conversations' },
  { name: 'Channels', route: '/channels' },
  { name: 'AI Settings', route: '/settings/ai' },
  { name: 'Widget Setup', route: '/widget' },
  { name: 'Analytics', route: '/analytics' },
  { name: 'Users', route: '/admin/users' },
  { name: 'Billing', route: '/billing' },
  { name: 'Settings', route: '/settings' },
  { name: 'Booking Rules', route: '/settings/booking' },
  { name: 'Booking Deposits', route: '/settings/booking/deposits' },
  { name: 'Voice AI', route: '/voice' },
  { name: 'Voice AI Settings', route: '/voice/settings' },
];

test.describe('Documentation Screenshot Generation Pipeline', () => {
  // Authentication is handled by globalSetup and storageState in playwright.config.ts
  
  for (const screen of SCREENS) {
    test(`Capture screenshot for ${screen.name}`, async ({ page }) => {
      // Create safe filename
      const filename = screen.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filepath = path.join(process.cwd(), 'public', 'docs-assets', 'screenshots', `${filename}.png`);
      
      try {
        await page.goto(`http://localhost:3000${screen.route}`, { waitUntil: 'networkidle', timeout: 15000 });
        
        // Wait for animations to settle
        await page.waitForTimeout(1000);
        
        // Capture the full page screenshot
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`Generated screenshot for ${screen.name} at ${filepath}`);
      } catch (e) {
        console.log(`Could not load route ${screen.route} for ${screen.name}. Skipping screenshot.`);
      }
    });
  }
});
