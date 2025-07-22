
'use client';

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Ensure initial value is returned if item is null or parsing fails
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, initialValue]); // Dependencies updated

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window == 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      window.dispatchEvent(new Event('local-storage')); // Trigger storage event for other tabs/windows
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, readValue]); // Dependency 'key' added

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    if (typeof window !== 'undefined') {
       window.addEventListener('storage', handleStorageChange);
       window.addEventListener('local-storage', handleStorageChange); // Listen for custom event
    }

    return () => {
       if (typeof window !== 'undefined') {
         window.removeEventListener('storage', handleStorageChange);
         window.removeEventListener('local-storage', handleStorageChange);
       }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readValue]); // Dependency updated

  return [storedValue, setValue];
}

export default useLocalStorage;
