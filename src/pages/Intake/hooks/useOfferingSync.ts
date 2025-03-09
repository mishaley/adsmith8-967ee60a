
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../utils/localStorageUtils";

// Storage key for offering selection
const STORAGE_KEY = `${STORAGE_KEYS.OFFERING}_selectedId`;

export const useOfferingSync = () => {
  // Initialize with the stored offering ID from localStorage
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || ""
  );

  // Watch for changes to the offering in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOfferingId = localStorage.getItem(STORAGE_KEY) || "";
      setSelectedOfferingId(newOfferingId);
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom offeringChanged events
    const handleOfferingChanged = (event: CustomEvent) => {
      const { offeringId } = event.detail;
      setSelectedOfferingId(offeringId);
    };

    window.addEventListener('offeringChanged' as any, handleOfferingChanged);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('offeringChanged' as any, handleOfferingChanged);
    };
  }, []);

  // Handle offering selection change
  const handleOfferingChange = (value: string) => {
    setSelectedOfferingId(value);
    
    // When offering changes in this component, update localStorage
    localStorage.setItem(STORAGE_KEY, value);
    
    // Dispatch a custom event for other components to sync
    const event = new CustomEvent("offeringChanged", { 
      detail: { offeringId: value }
    });
    window.dispatchEvent(event);
  };

  return { selectedOfferingId, handleOfferingChange };
};
