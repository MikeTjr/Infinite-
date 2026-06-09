import * as SecureStore from 'expo-secure-store';
import { useState, useEffect, useCallback } from 'react';

export function useSecureStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(key)
      .then((raw) => {
        if (raw) {
          try {
            setValue(JSON.parse(raw));
          } catch {
            setValue(defaultValue);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [key]);

  const set = useCallback(async (newValue: T) => {
    setValue(newValue);
    await SecureStore.setItemAsync(key, JSON.stringify(newValue));
  }, [key]);

  const clear = useCallback(async () => {
    setValue(defaultValue);
    await SecureStore.deleteItemAsync(key);
  }, [key, defaultValue]);

  return { value, set, clear, loading };
}
