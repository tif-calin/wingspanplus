import { useCallback, useState } from 'react';

const SITE_KEY = 'wingfans';

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const nameSpacedKey = `${SITE_KEY}::${key}`;

  const [stateValue, setStateValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(nameSpacedKey);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(stateValue) : newValue;
        setStateValue(newValue);
        window.localStorage.setItem(nameSpacedKey, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [nameSpacedKey, stateValue]
  );

  return [stateValue, setStoredValue] as const;
};

export default useLocalStorage;
