import { preload, removeBackground, type Config } from '@imgly/background-removal';

const config: Config = {
  progress: (key, curr, total) => {
    console.log(`Preloading ${key}: ${curr} of ${total}`);
  }
};
preload(config).then(() => {
  console.log("Asset preloading succeeded");
});

const cache: Record<string, string> = {};
const removeBackgroundFromUrl = async (url: string | Blob) => {
  const cacheKey = typeof url === 'string' ? url : URL.createObjectURL(url);

  if (!cache[cacheKey]) {
    cache[cacheKey] = 'loading';
    const src = URL.createObjectURL(await removeBackground(url));
    cache[cacheKey] = src;
  }

  return cache[cacheKey];
};

export default removeBackgroundFromUrl;
