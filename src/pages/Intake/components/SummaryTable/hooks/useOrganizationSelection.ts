
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEY } from "../constants";

// Interface for organization data
export interface OrganizationData {
  organization_name: string;
  organization_industry?: string;
}

export const useOrganizationSelection = () => {
  // Initialize with the stored organization ID from localStorage or empty string
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    const storedOrgId = localStorage.getItem(STORAGE_KEY);
    return storedOrgId || "";
  });
  
  // Store current organization data
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationData | null>(null);

  // Watch for changes to the organization in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = localStorage.getItem(STORAGE_KEY) || "";
      if (newOrgId !== selectedOrgId) {
        setSelectedOrgId(newOrgId);
      }
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedOrgId]);

  // Clear organization data when selecting "new-organization" or empty
  useEffect(() => {
    console.log("Organization changed to:", selectedOrgId);
    
    if (selectedOrgId === "new-organization" || !selectedOrgId) {
      setCurrentOrganization(null);
    }
  }, [selectedOrgId]);

  // Fetch organizations for dropdown
  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch organization details when an organization is selected
  useQuery({
    queryKey: ["organization-details", selectedOrgId],
    queryFn: async () => {
      // Don't fetch if we're creating a new organization or no org is selected
      if (selectedOrgId === "new-organization" || !selectedOrgId) {
        setCurrentOrganization(null);
        return null;
      }
      
      console.log("Fetching organization details for:", selectedOrgId);
      
      try {
        // Using maybeSingle instead of single to avoid errors if no row is found
        const { data, error } = await supabase
          .from("a1organizations")
          .select("organization_name, organization_industry")
          .eq("organization_id", selectedOrgId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching organization details:", error);
          setCurrentOrganization(null);
          return null;
        }
        
        console.log("Fetched organization data:", data);
        
        if (data) {
          setCurrentOrganization(data);
        } else {
          console.warn("No organization found with ID:", selectedOrgId);
          setCurrentOrganization(null);
        }
        
        return data;
      } catch (error) {
        console.error("Unexpected error fetching organization:", error);
        setCurrentOrganization(null);
        return null;
      }
    },
    enabled: !!selectedOrgId && selectedOrgId !== "new-organization",
  });

  // Handle organization selection change
  const handleOrgChange = (value: string) => {
    console.log("Organization selection changed to:", value);
    
    // Update local state
    setSelectedOrgId(value);
    
    // Update localStorage
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // Trigger storage event for other components to sync
    window.dispatchEvent(new Event('storage'));
  };

  return {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization
  };
};
