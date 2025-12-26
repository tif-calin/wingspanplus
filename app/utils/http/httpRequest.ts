import type { MethodKeys } from '../utilityTypes';
import { CACHE, saveCache } from './cache';

const PROXY_URLS = [
  'https://corsproxy.io/',
  "http://thingproxy.freeboard.io/fetch/",
  "https://thingproxy.freeboard.io/fetch/",
  "https://api.allorigins.win/get?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://cors.bridged.cc/",
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://corsproxy.io/?",
  "https://cors-proxy.htmldriven.com/?url=",
]; // https://nordicapis.com/10-free-to-use-cors-proxies/

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type OptsHttpRequest = {
  /**
   * Number, in milliseconds, to wait before making a new request in order to avoid rate limiting.
   * @default 69
   */
  crawlDelay?: number;
  /**
   * Whether to output logs to console
   * @default true
   */
  isLoud?: boolean;
  /** @default 'text' */
  readAs?: Extract<MethodKeys<Body>,  'json' | 'text'>;
  /** @default true */
  shouldUseCache?: boolean;
  /** @default false */
  withProxy?: boolean;
};

// TODO: fix any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpRequest = async <T = any>(
  url: string,
  method: Method = 'GET',
  opts: Partial<OptsHttpRequest> = {}
): Promise<T> => {
  const {
    crawlDelay = 69,
    isLoud = !!import.meta.env.DEV && false,
    readAs = 'text',
    shouldUseCache = true,
    withProxy = false,
  } = opts;

  const requestId = `${method}::||${url}`;

  if (isLoud) console.group(`httpRequest: ${requestId}`);

  if (CACHE[requestId] && shouldUseCache) {
    if (isLoud) console.info('Cache hit!');
  } else {
    const urlWithProxy = `${withProxy ? PROXY_URLS[0] : ''}${url}`; // TODO: make dynamic
    if (isLoud) console.info('Cache miss. Fetching', urlWithProxy);
    const response = await fetch(urlWithProxy);
    const status = response.status;
    if (isLoud) console.info('Status:', status);
    const data = await (readAs === 'json' ? response.json() : response.text());
    if (status <= 299) {
      if (!shouldUseCache) {
        console.groupEnd();
        return data;
      }
      CACHE[requestId] = JSON.stringify(data);
      saveCache();
    }

    // sleep to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, crawlDelay));
  }

  if (isLoud) console.groupEnd();
  return JSON.parse(CACHE[requestId]);
};

export default httpRequest;
