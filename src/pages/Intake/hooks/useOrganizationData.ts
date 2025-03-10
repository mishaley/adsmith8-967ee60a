
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logInfo } from "@/utils/logging";

export const useOrganizationData = () => {
  // Use a different storage key for the intake form organization
  const STORAGE_KEY = "intake_selectedOrganizationId";
  
  // Initialize with localStorage 
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      logDebug(`Initial organization ID from localStorage: ${storedValue || "none"}`);
      return storedValue || "";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return "";
    }
  });

  // Query organizations
  const { data: organizations = [], isLoading: isLoadingOrganizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      logInfo("Fetching organizations from database");
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name, organization_industry");
      
      if (error) throw error;
      logInfo(`Fetched ${data?.length || 0} organizations`);
      return data || [];
    },
  });

  // Get the current organization
  const currentOrganization = selectedOrgId 
    ? organizations.find(org => org.organization_id === selectedOrgId) 
    : null;

  // Function to handle organization change
  const handleOrgChange = (value: string) => {
    logInfo(`Setting organization ID to: ${value || "none"}`);
    setSelectedOrgId(value);
    
    // Save to localStorage
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
        logDebug(`Saved organization ID to localStorage: ${value}`);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        logDebug("Removed organization ID from localStorage");
      }
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  // Listen for form clearing
  useEffect(() => {
    const handleClearForm = () => {
      logInfo("Clear form event detected in useOrganizationData");
      setSelectedOrgId("");
      localStorage.removeItem(STORAGE_KEY);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, []);

  // Debug log when current organization changes
  useEffect(() => {
    if (currentOrganization) {
      logDebug(`Current organization: ${currentOrganization.organization_name}, Industry: ${currentOrganization.organization_industry || "none"}`);
    } else if (selectedOrgId) {
      logDebug(`Organization ID ${selectedOrgId} selected but data not loaded yet`);
    }
  }, [currentOrganization, selectedOrgId]);

  return {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    currentOrganization,
    handleOrgChange,
    isLoadingOrganizations
  };
};
