import { removeBackground } from '@imgly/background-removal';

const cache: Record<string, string> = {};
const removeBackgroundFromUrl = async (url: string) => {
  if (!cache[url]) {
    cache[url] = 'loading';
    const src = URL.createObjectURL(await removeBackground(url));
    cache[url] = src;
  }

  return cache[url];
};

export default removeBackgroundFromUrl;
