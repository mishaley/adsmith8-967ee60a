
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_KEYS } from "../../utils/localStorageUtils";

export const useSummaryTableData = () => {
  const STORAGE_KEY = "selectedOrganizationId";
  
  // Initialize with the stored organization ID from localStorage
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || ""
  );
  
  // Initialize offering selection from localStorage
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>(
    localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`) || ""
  );
  
  // Initialize persona and message selections
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  
  // Watch for changes to the organization in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = localStorage.getItem(STORAGE_KEY) || "";
      setSelectedOrgId(newOrgId);
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  // Query offerings based on selected organization
  const { data: offerings = [] } = useQuery({
    queryKey: ["offerings", selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) return [];
      
      const { data, error } = await supabase
        .from("b1offerings")
        .select("offering_id, offering_name")
        .eq("organization_id", selectedOrgId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedOrgId, // Only run query if an organization is selected
  });

  // Reset offering selection when organization changes
  useEffect(() => {
    // When organization is empty or changes, clear offering selection
    if (!selectedOrgId || offerings.length === 0) {
      setSelectedOfferingId("");
      localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
    } else {
      // If we have a selectedOfferingId from localStorage, check if it's still valid
      const savedOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
      if (savedOfferingId) {
        // Check if the saved offering belongs to the current organization
        const offeringExists = offerings.some(o => o.offering_id === savedOfferingId);
        if (!offeringExists) {
          // If not, clear the selection
          setSelectedOfferingId("");
          localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        }
      }
    }
  }, [selectedOrgId, offerings]);

  // Format options for the select component
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  // Add 'Create new offering' option if an organization is selected
  if (selectedOrgId) {
    offeringOptions.push({
      value: "new-offering",
      label: "Create new offering"
    });
  }

  // Function to handle organization change
  const handleOrgChange = (value: string) => {
    setSelectedOrgId(value);
    localStorage.setItem(STORAGE_KEY, value);
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('organizationChanged', { 
      detail: { organizationId: value }
    });
    window.dispatchEvent(event);
  };

  // Placeholder options for personas and messages
  const personaOptions = [
    { value: "persona-1", label: "Persona 1" },
    { value: "persona-2", label: "Persona 2" }
  ];
  
  const messageOptions = [
    { value: "headline", label: "Headline" },
    { value: "description", label: "Description" }
  ];

  // Determine disabled states
  const isOfferingsDisabled = !selectedOrgId;
  const isPersonasDisabled = !selectedOfferingId;
  const isMessagesDisabled = selectedPersonaIds.length === 0;

  return {
    selectedOrgId,
    setSelectedOrgId,
    selectedOfferingId,
    setSelectedOfferingId,
    organizations,
    offerings,
    offeringOptions,
    isOfferingsDisabled,
    currentOrganization,
    handleOrgChange,
    
    // Persona and message props
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    personaOptions,
    messageOptions,
    isPersonasDisabled,
    isMessagesDisabled
  };
};
