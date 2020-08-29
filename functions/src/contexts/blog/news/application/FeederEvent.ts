import { get } from 'request-promise';
import * as xml from 'xml2js';
import * as moment from 'moment';
import admin from 'firebase-admin';

export type Operator = (response: any) => any;

export const filterPublishedBetween: Operator = async (response: Promise<any[]>) => {
  const start = moment().subtract(8, 'hours');
  const today = new Date();
  return (await response).filter((item) => moment(item.publishedAt).isBetween(start, today));
};

async function factory(url: string, format: string, headers?: any): Promise<any> {
  if (format === 'xml') {
    return get(url, {
      headers,
    }).then((xmlResponse: any) => xml.parseStringPromise(xmlResponse));
  }
  if (format === 'database') {
    return await admin
      .firestore()
      .doc(url)
      .get()
      .then((document) => document.data());
  }
  return get({
    url,
    headers,
    json: true,
  });
}

export function from<JsonResponse>(
  url: string,
  format: 'xml' | 'json' | 'database' = 'json',
  headers?: any
): FeederEvent {
  const response = factory(url, format, headers);
  return new FeederEvent(response);
}

export class FeederEvent {
  private operators: Operator[] = [];

  constructor(private event: Promise<any>) {}

  pipe(...operators: Operator[]): this {
    this.operators.push(...operators);
    return this;
  }

  async toObjectPromise() {
    let event: any = await this.event;
    for (const operator of this.operators) {
      event = await operator(event);
    }
    return event;
  }

  async toPromise<T>(): Promise<any> {
    let event: any = await this.event;
    for (const operator of this.operators) {
      event = await Promise.all(await operator(event));
    }
    return event;
  }
}
