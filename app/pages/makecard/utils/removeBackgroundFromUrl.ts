import { preload, removeBackground, type Config } from '@imgly/background-removal';

const config: Config = {
  progress: (key, curr, total) => {
    console.log(`Preloading ${key}: ${curr} of ${total}`);
  }
};

preload(config).then(() => {
  console.log("Asset preloading succeeded");
});

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

const cache: Record<string, string> = {};
const removeBackgroundFromUrl = async (url: string | Blob) => {
  const cacheKey = typeof url === 'string' ? url : URL.createObjectURL(url);

  if (!cache[cacheKey]) {
    cache[cacheKey] = 'loading';
    const src = await removeBackground(url).then(blobToBase64);
    cache[cacheKey] = src;
  }

  return cache[cacheKey];
};

export default removeBackgroundFromUrl;
