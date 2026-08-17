import { BrowserAutomationService } from '../src/services/browserAutomation.service';

// Mock puppeteer to avoid downloading Chromium
jest.mock('puppeteer', () => {
  const mockPage = {
    goto: jest.fn().mockImplementation(async (url, options) => {
      // Simulate navigation errors for specific URLs
      if (url === 'invalid-url') {
        throw new Error('Invalid URL');
      }
      if (url === 'https://this-domain-definitely-does-not-exist-12345.com') {
        throw new Error('net::ERR_NAME_NOT_RESOLVED');
      }
      // Simulate timeout for httpstat endpoint
      if (url.includes('httpstat.com')) {
        // Wait longer than timeout set in test
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Navigation timeout')), 500);
        });
      }
      // Normal navigation succeeds
      return Promise.resolve();
    }),
    url: jest.fn().mockResolvedValue('https://example.com'),
    click: jest.fn().mockResolvedValue(undefined),
    type: jest.fn().mockResolvedValue(undefined),
    evaluate: jest.fn().mockImplementation((pageFn, ...args) => {
      // Simulate evaluation in page context
      if (pageFn.toString().includes('document.querySelector')) {
        const selector = args[0];
        if (selector === 'input#search') {
          return { value: 'test query' };
        }
        return null;
      }
      if (pageFn.toString().includes('el.value')) {
        const el = args[0];
        return el?.value || '';
      }
      return null;
    }),
    screenshot: jest.fn().mockResolvedValue(Buffer.from([1, 2, 3, 4, 5])), // Non-empty buffer
    pdf: jest.fn().mockResolvedValue(Buffer.from([1, 2, 3, 4, 5])), // Non-empty buffer
    close: jest.fn().mockResolvedValue(undefined),
    setDefaultTimeout: jest.fn().mockResolvedValue(undefined),
    fill: jest.fn().mockResolvedValue(undefined),
    $: jest.fn().mockImplementation((selector) => {
      // Return an ElementHandle mock for input#search
      if (selector === 'input#search') {
        return {
          evaluate: jest.fn().mockImplementation((fn) => {
            // Simulate getting the value of the input
            return 'test query';
          })
        };
      }
      return null; // Element not found
    }),
  };

  const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn().mockResolvedValue(undefined),
  };

  return {
    ...jest.requireActual('puppeteer'),
    launch: jest.fn().mockResolvedValue(mockBrowser),
  };
});

describe('Browser Automation Service', () => {
  let service: BrowserAutomationService;

  beforeEach(() => {
    service = new BrowserAutomationService();
  });

  afterEach(async () => {
    await service.cleanup();
  });

  describe('initialization', () => {
    test('should create an instance of BrowserAutomationService', () => {
      expect(service).toBeInstanceOf(BrowserAutomationService);
    });

    test('should initialize with default options', () => {
      // Assuming the service has a method to get options or we can check internal state
      expect(service.getOptions()).toMatchObject({
        headless: true,
        timeout: 30000,
      });
    });
  });

  describe('navigation', () => {
    test('should navigate to a URL and wait for page load', async () => {
      const url = 'https://example.com';
      await service.navigateTo(url);
      const currentUrl = await service.getCurrentUrl();
      expect(currentUrl).toBe(url);
    });

    test('should throw an error when navigating to an invalid URL', async () => {
      await expect(service.navigateTo('invalid-url')).rejects.toThrow(
        /Invalid URL/
      );
    });
  });

  describe('interaction', () => {
    test('should click an element by selector', async () => {
      await service.navigateTo('https://example.com');
      await service.click('a[href="https://www.iana.org/domains/example"]');
      // Add assertion based on expected behavior after click
    });

    test('should type in input field by selector', async () => {
      await service.navigateTo('https://example.com');
      await service.type('input#search', 'test query');
      const value = await service.getInputValue('input#search');
      expect(value).toBe('test query');
    });
  });

  describe('screenshot and PDF generation', () => {
    test('should take a screenshot and return a buffer', async () => {
      await service.navigateTo('https://example.com');
      const screenshot = await service.takeScreenshot();
      expect(screenshot).toBeInstanceOf(Buffer);
      expect(screenshot.length).toBeGreaterThan(0);
    });

    test('should generate PDF and return a buffer', async () => {
      await service.navigateTo('https://example.com');
      const pdf = await service.generatePDF();
      expect(pdf).toBeInstanceOf(Buffer);
      expect(pdf.length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    test('should handle page timeout errors', async () => {
      // Set a short timeout for testing
      await service.setNavigationTimeout(100);
      await expect(
        service.navigateTo('https://httpstat.com/200?sleep=200')
      ).rejects.toThrow(/timeout/i);
    });

    test('should handle navigation errors', async () => {
      await expect(
        service.navigateTo('https://this-domain-definitely-does-not-exist-12345.com')
      ).rejects.toThrow(/net::ERR_NAME_NOT_RESOLVED/);
    });
  });

  describe('cleanup', () => {
    test('should close browser instance on cleanup', async () => {
      await service.navigateTo('https://example.com');
      const isBrowserOpen = service.isBrowserOpen();
      expect(isBrowserOpen).toBe(true);
      await service.cleanup();
      expect(service.isBrowserOpen()).toBe(false);
    });
  });
});