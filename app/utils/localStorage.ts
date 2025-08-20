const KEY_PREFIX = 'wingfanz_';

export const saveToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(`${KEY_PREFIX}${key}`, value);
};

export const loadFromLocalStorage = (key: string) => {
  return localStorage.getItem(`${KEY_PREFIX}${key}`);
};

export const clearLocalStorage = (key: string) => {
  localStorage.removeItem(`${KEY_PREFIX}${key}`);
};
