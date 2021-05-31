import { Page } from 'puppeteer-extra/dist/puppeteer';
import puppeteer, { PuppeteerExtraPlugin } from 'puppeteer-extra';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

export class PageCreator {
  private static instance: PageCreator = null;

  private constructor(private page: Page) {}

  static async getInstance(url: string, ...plugins: PuppeteerExtraPlugin[]) {
    if (PageCreator.instance === null) {
      plugins.forEach((plugin) => puppeteer.use(plugin));
      const page = await PageCreator.launch(url);
      PageCreator.instance = new PageCreator(page);
    }
    return PageCreator.instance;
  }

  private static async launch(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
        '--proxy-server="direct://"',
        '--proxy-bypass-list=*',
        '--deterministic-fetch',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    await page.goto(url);
    return page;
  }

  getPage() {
    return this.page;
  }

  async type(xPath: string, value: string) {
    await this.page.waitForXPath(xPath);
    const input = await this.getPage().$x(xPath);
    await this.getPage().evaluate((elementHandler, user) => (elementHandler.value = user), input[0], value);
  }

  async click(xPath: string) {
    const element = await this.page.$x(xPath);
    return Promise.all([
      this.page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      element[0].click(),
    ]);
  }

  async count(xPath: string) {
    return (await this.page.$x(xPath)).length;
  }

  async read(xPath: string) {
    const element = await this.page.waitForXPath(xPath);
    return await element.evaluate((el) => el.textContent);
  }

  async solveCaptchas() {
    await (this.page as any).solveRecaptchas();
  }

  async screenshot(destination: string): Promise<string> {
    const bucket = admin.storage().bucket('gs://arsus-production.appspot.com');
    const options = {
      destination,
      metadata: {
        contentType: 'image/png',
      },
    };
    const path = 'screenshot.png';
    await this.getPage().screenshot({ path, fullPage: true });
    await bucket.upload(path, options);
    const fileFromBucket = await bucket.file(destination);
    const today = new Date();
    today.setHours(today.getHours() + 2);
    const urls = await fileFromBucket.getSignedUrl({
      action: 'read',
      expires: today,
    });
    fs.unlinkSync(path);
    return urls[0];
  }
}
