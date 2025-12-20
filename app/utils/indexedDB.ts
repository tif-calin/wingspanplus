import { openDB, type DBSchema, type OpenDBCallbacks } from 'idb';

const DB_NAMESPACE = "WingFans";

const getDb = async <T extends DBSchema | unknown>({
  dbName,
  upgrade,
}: {
  dbName: string;
  upgrade: OpenDBCallbacks<T>['upgrade'];
}) => {
  const subName = `${DB_NAMESPACE}::${dbName}`;

  return await openDB(subName, 1, { upgrade, });
};

type ProcssedPhotoEntry = {
  originalUrl: string;
  processedUrl: string;
  whenAccessed: ReturnType<typeof Date.now>;
  whenCreated: ReturnType<typeof Date.now>;
};

type MakeCardDb = DBSchema & {
  'processed-photos': {
    key: string;
    indexes: {
      whenAccessed: ProcssedPhotoEntry['whenAccessed'];
      whenCreated: ProcssedPhotoEntry['whenCreated'];
    };
    value: ProcssedPhotoEntry;
  }
}

export const getCardMakerDb = async () => {
  return await getDb<MakeCardDb>({
    dbName: 'makecard',
    upgrade: (db, _oldVer, _newVer, _tx) => {
      const processedPhotoStore = db.createObjectStore(
        'processed-photos',
        { keyPath: 'originalUrl' }
      );

      processedPhotoStore.createIndex('whenAccessed', 'whenAccessed', { unique: false });
      processedPhotoStore.createIndex('whenCreated', 'whenCreated', { unique: false });
    }
  });
};
