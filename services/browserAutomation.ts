import { chromium, Browser, Page } from 'playwright';

/**
 * Browser automation service using Playwright.
 */
export class BrowserAutomationService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Launches a new browser instance.
   */
  async launch(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  /**
   * Navigates to a given URL.
   * @param url - The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.goto(url);
  }

  /**
   * Takes a screenshot of the current page and saves it to a file.
   * @param path - The file path to save the screenshot.
   */
  async takeScreenshot(path: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.screenshot({ path });
  }

  /**
   * Closes the browser instance.
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Gets the current page instance.
   */
  getPage(): Page | null {
    return this.page;
  }
}