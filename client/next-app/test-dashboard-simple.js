const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testDashboardSimple() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages and errors
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('🚀 Testing dashboard with error monitoring...');

    // Navigate to dashboard
    console.log('📍 Navigating to http://localhost:3000/dashboard');
    const response = await page.goto('http://localhost:3000/dashboard', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log(`Response status: ${response.status()}`);

    // Wait a bit more for any async operations
    await page.waitForTimeout(3000);

    // Take screenshot regardless of errors
    console.log('📸 Taking screenshot of current state');
    await page.screenshot({
      path: path.join(screenshotsDir, 'current-dashboard-state.png'),
      fullPage: true
    });

    // Try to find any content
    const pageContent = await page.textContent('body');
    console.log('Page content preview:', pageContent.substring(0, 200) + '...');

    // Look for specific elements that might exist
    const elementChecks = [
      'h1',
      '.text-4xl',
      '[data-testid]',
      'button',
      'main',
      'div'
    ];

    for (const selector of elementChecks) {
      try {
        const elements = await page.locator(selector).count();
        console.log(`Found ${elements} elements matching "${selector}"`);
      } catch (e) {
        console.log(`Could not check selector "${selector}": ${e.message}`);
      }
    }

    // Check for any actual dashboard elements
    const dashboardElements = [
      'h1:has-text("IoT")',
      'h1:has-text("Device")',
      '[class*="widget"]',
      '[class*="dashboard"]',
      'button:has-text("device")',
      '.grid'
    ];

    let foundDashboard = false;
    for (const selector of dashboardElements) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`✅ Found dashboard element: ${selector}`);
          foundDashboard = true;
          break;
        }
      } catch (e) {
        // Continue checking
      }
    }

    if (!foundDashboard) {
      console.log('⚠️ No dashboard elements found - checking page structure');
      const title = await page.title();
      console.log('Page title:', title);

      const url = page.url();
      console.log('Current URL:', url);
    }

    // Final screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, 'final-dashboard-test.png'),
      fullPage: true
    });

    console.log('✅ Test completed - check screenshots for results');

  } catch (error) {
    console.error('❌ Error during testing:', error);

    // Take error screenshot
    try {
      await page.screenshot({
        path: path.join(screenshotsDir, 'error-dashboard.png'),
        fullPage: true
      });
    } catch (e) {
      console.error('Could not take error screenshot:', e);
    }
  } finally {
    await browser.close();
  }
}

testDashboardSimple().catch(console.error);