import { useState, useEffect } from "react";

// Storage key for organization selection
const STORAGE_KEY = "selectedOrganizationId";
const DEFAULT_ORG_ID = "cc1a6523-c628-4863-89f2-0ff5c979d4ec";

export const useOrganizationSync = () => {
  // Initialize with the stored organization ID from localStorage
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID
  );

  // Watch for changes to the organization in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID;
      setSelectedOrgId(newOrgId);
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle organization selection change
  const handleOrgChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedOrgId("");
    } else {
      setSelectedOrgId(value);
      // When organization changes in this component, update localStorage 
      // to keep it in sync with the Q1 selector
      localStorage.setItem(STORAGE_KEY, value);
      // Dispatch storage event for other components to sync
      window.dispatchEvent(new Event('storage'));
    }
  };

  return { selectedOrgId, handleOrgChange };
};
