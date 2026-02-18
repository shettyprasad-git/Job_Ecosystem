'use client';

import { useState, useEffect } from 'react';

// This hook is now SSR-safe. It initializes with a default value on the server and
// on the client's first render, then hydrates from localStorage on the client.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // We need a state to hold the value, and we initialize it to the initialValue.
  // This ensures that the server render and the first client render are identical.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This effect runs ONLY on the client, after the component has mounted.
  // It reads the value from localStorage and updates the state.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If a value is found in localStorage, parse it and update the state.
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      // If there's an error, we'll just use the initialValue.
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    // This should only run on the client.
    if (typeof window == 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
      return;
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      // Dispatch a custom event to notify other instances of the hook in the same tab.
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // This effect sets up listeners to sync the state across tabs/windows.
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
         console.warn(`Error reading localStorage key “${key}” on storage event:`, error);
      }
    };
    
    // Listen for the standard 'storage' event (for other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Listen for our custom 'local-storage' event (for the current tab)
    window.addEventListener("local-storage", handleStorageChange);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
