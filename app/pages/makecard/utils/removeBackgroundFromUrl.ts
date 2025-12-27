import { preload, removeBackground } from '@imgly/background-removal';
import { getCardMakerDb } from '~/utils/indexedDB';
import { applyAutoCurves, applyAutoLevels } from './imageProcessing';

// Preload imgly model
preload({
  progress: (key, curr, total) => console.log(`Preloading ${key}: ${curr} of ${total}`)
}).then(() => console.log("Asset preloading succeeded"));

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

// const inMemoryCache: Record<string, string> = {};
const removeBackgroundFromUrl = async (
  url: string | Blob,
  // cacheStrategy: 'memory' | 'localStorage' | 'indexedDB' = 'indexedDB'
) => {
  const cacheKey = typeof url === 'string' ? url : URL.createObjectURL(url);

  const db = await getCardMakerDb();
  const value = await db.get('processed-photos', cacheKey);
  let processedUrl = value?.processedUrl || null;
  if (processedUrl === null) {
    console.log(`Processing ${cacheKey}`);
    processedUrl = await removeBackground(url)
      .then(applyAutoCurves)
      .then(applyAutoLevels)
      .then(blobToBase64) || '';
    await db.add('processed-photos', {
      originalUrl: cacheKey,
      processedUrl,
      whenAccessed: Date.now(),
      whenCreated: Date.now(),
    });
  }
  // TODO: update whenAccessed otherwise

  return processedUrl;
};

export default removeBackgroundFromUrl;
