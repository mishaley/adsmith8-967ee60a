
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOrganizationData = () => {
  // Use a different storage key for the intake form organization
  const STORAGE_KEY = "intake_selectedOrganizationId";
  
  // Initialize with localStorage 
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return "";
    }
  });

  // Query organizations
  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name, organization_industry");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get the current organization
  const currentOrganization = selectedOrgId 
    ? organizations.find(org => org.organization_id === selectedOrgId) 
    : null;

  // Function to handle organization change
  const handleOrgChange = (value: string) => {
    setSelectedOrgId(value);
    
    // Save to localStorage
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  // Listen for form clearing
  useEffect(() => {
    const handleClearForm = () => {
      console.log("Clear form event detected in useOrganizationData");
      setSelectedOrgId("");
      localStorage.removeItem(STORAGE_KEY);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, []);

  return {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    currentOrganization,
    handleOrgChange
  };
};
