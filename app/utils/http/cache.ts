import { loadFromLocalStorage, saveToLocalStorage } from '../localStorage';

const CACHE_KEY = 'http_cache';

export const CACHE: Record<string, string> = (() => {
  return loadCache();
})();

export const saveCache = (cache: Record<string, string> = CACHE) => {
  saveToLocalStorage(CACHE_KEY, JSON.stringify(cache));
};

export function loadCache() {
  const data = loadFromLocalStorage(CACHE_KEY) || '{}';
  return JSON.parse(data);
};

export function clearCache(key: string) {
  delete CACHE[key];
};
