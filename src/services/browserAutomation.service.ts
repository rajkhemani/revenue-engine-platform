import { Buffer } from 'buffer';
import puppeteer, { Browser as PuppeteerBrowser, Page as PuppeteerPage } from 'puppeteer';

export class BrowserAutomationService {
    private browser: PuppeteerBrowser | null = null;
    private page: PuppeteerPage | null = null;
    private options: {
        headless: boolean;
        timeout: number;
    } = {
        headless: true,
        timeout: 30000,
    };

    constructor() {
        // Initialize browser and page
        this.initialize();
    }

    private async initialize() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: this.options.headless,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            // Set default timeout
            this.page.setDefaultTimeout(this.options.timeout);
        }
    }

    getOptions() {
        return { ...this.options };
    }

    async navigateTo(url: string): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch (error) {
            throw new Error('Invalid URL');
        }

        await this.page.goto(url, { waitUntil: 'networkidle0' });
    }

    async getCurrentUrl(): Promise<string> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        return this.page.url();
    }

    async click(selector: string): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.click(selector);
    }

    async fill(selector: string, value: string): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.evaluate((selector, value) => {
            const element = document.querySelector(selector) as HTMLInputElement;
            if (!element) {
                throw new Error(`Element not found: ${selector}`);
            }
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }, selector, value);
    }

    async type(selector: string, text: string): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.type(selector, text);
    }

    async getInputValue(selector: string): Promise<string> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        const inputHandle = await this.page.$(selector);
        if (!inputHandle) {
            throw new Error(`Element not found: ${selector}`);
        }
        return await inputHandle.evaluate(el => (el as HTMLInputElement).value);
    }

    async takeScreenshot(): Promise<Buffer> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        const screenshotBuffer = await this.page.screenshot();
        return Buffer.from(screenshotBuffer);
    }

    async generatePDF(): Promise<Buffer> {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        const pdfBuffer = await this.page.pdf();
        return Buffer.from(pdfBuffer);
    }

    async setNavigationTimeout(ms: number): Promise<void> {
        this.options.timeout = ms;
        if (this.page) {
            this.page.setDefaultTimeout(ms);
        }
    }

    isBrowserOpen(): boolean {
        return !!this.browser;
    }

    async cleanup(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}