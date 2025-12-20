import { preload, removeBackground, type Config } from '@imgly/background-removal';
import { getCardMakerDb } from '~/utils/indexedDB';

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

const inMemoryCache: Record<string, string> = {};
const removeBackgroundFromUrl = async (
  url: string | Blob,
  cacheStrategy: 'memory' | 'localStorage' | 'indexedDB' = 'indexedDB'
) => {
  const cacheKey = typeof url === 'string' ? url : URL.createObjectURL(url);

  switch (cacheStrategy) {
    case 'memory':
      if (!inMemoryCache[cacheKey]) {
        inMemoryCache[cacheKey] = 'loading';
        const src = await removeBackground(url).then(blobToBase64);
        inMemoryCache[cacheKey] = src;
      }

      return inMemoryCache[cacheKey];
    case 'localStorage':
      throw new Error('Not implemented');
    case 'indexedDB': {
      const db = await getCardMakerDb();
      const value = await db.get('processed-photos', cacheKey);
      let processedUrl = value?.processedUrl || null;
      if (processedUrl === null) {
        console.log(`Processing ${cacheKey}`);
        processedUrl = await removeBackground(url).then(blobToBase64) || '';
        await db.add('processed-photos', {
          originalUrl: cacheKey,
          processedUrl,
          whenAccessed: Date.now(),
          whenCreated: Date.now(),
        });
      }
      // TODO: update whenAccessed otherwise

      return processedUrl;
    }
  }
};

export default removeBackgroundFromUrl;
