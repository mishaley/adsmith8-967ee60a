
import { useEffect, useState, useCallback } from "react";
import { logDebug, logError, logInfo } from "@/utils/logging";
import { supabase } from "@/integrations/supabase/client";

interface UseOrganizationEffectsProps {
  currentOrganization: {
    organization_name?: string;
    organization_industry?: string;
  } | null;
  selectedOrgId: string;
  setBrandName: (value: string) => void;
  setIndustry: (value: string) => void;
  handleOrgChange: (value: string) => void;
}

export const useOrganizationEffects = ({
  currentOrganization,
  selectedOrgId,
  setBrandName,
  setIndustry,
  handleOrgChange
}: UseOrganizationEffectsProps) => {
  const [isLoadingOrgData, setIsLoadingOrgData] = useState(false);
  const [lastSyncedOrgId, setLastSyncedOrgId] = useState<string | null>(null);

  // Effect to sync organization data with form fields
  useEffect(() => {
    // Skip if we've already synced this organization's data
    if (lastSyncedOrgId === selectedOrgId) {
      logDebug(`Organization data already synced for org ID: ${selectedOrgId}`, 'ui');
      return;
    }

    if (selectedOrgId && selectedOrgId !== "new-organization" && !currentOrganization) {
      // Organization ID is selected but data isn't loaded yet - fetch it directly
      const fetchOrgData = async () => {
        try {
          logInfo(`Directly fetching data for organization ID: ${selectedOrgId}`, 'api');
          setIsLoadingOrgData(true);
          
          const { data, error } = await supabase
            .from("a1organizations")
            .select("organization_name, organization_industry")
            .eq("organization_id", selectedOrgId)
            .maybeSingle();
          
          if (error) {
            logError("Error fetching organization data:", 'api', error);
            return;
          }
          
          if (data) {
            // Update brand name if available
            if (data.organization_name) {
              setBrandName(data.organization_name);
            }

            // Update industry if available, otherwise clear it
            if (data.organization_industry) {
              logDebug(`Setting industry directly to: ${data.organization_industry}`, 'ui');
              setIndustry(data.organization_industry);
            } else {
              logDebug('Clearing industry field as organization has no industry set', 'ui');
              setIndustry('');
            }
            
            setLastSyncedOrgId(selectedOrgId);
          }
        } catch (error) {
          logError("Unexpected error fetching organization data:", 'api', error);
        } finally {
          setIsLoadingOrgData(false);
        }
      };
      
      fetchOrgData();
    } else if (currentOrganization) {
      logInfo(`Syncing data for organization: ${currentOrganization.organization_name}`, 'ui');
      
      // Update brand name if available
      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
      }

      // Update industry if available, otherwise clear it
      if (currentOrganization.organization_industry) {
        logDebug(`Setting industry to: ${currentOrganization.organization_industry}`, 'ui');
        setIndustry(currentOrganization.organization_industry);
      } else {
        logDebug('Clearing industry field as organization has no industry set', 'ui');
        setIndustry('');
      }

      setLastSyncedOrgId(selectedOrgId);
      setIsLoadingOrgData(false);
    } else if (selectedOrgId === "new-organization") {
      logInfo('Creating new organization, clearing fields', 'ui');
      setBrandName("");
      setIndustry("");
      setLastSyncedOrgId(selectedOrgId);
      setIsLoadingOrgData(false);
    }
  }, [currentOrganization, selectedOrgId, setBrandName, setIndustry, lastSyncedOrgId]);

  // Effect to listen for external organization changes
  useEffect(() => {
    const handleExternalOrgChange = (event: CustomEvent) => {
      try {
        const newOrgId = event.detail.organizationId;
        
        if (!newOrgId) {
          logError("Received organizationChanged event with missing organizationId", 'ui');
          return;
        }

        if (newOrgId !== selectedOrgId) {
          logInfo(`External organization change detected: ${newOrgId}`, 'ui');
          setIsLoadingOrgData(true);
          setLastSyncedOrgId(null); // Reset to force data sync
          handleOrgChange(newOrgId);
        }
      } catch (error) {
        logError("Error handling external organization change event:", 'ui', error);
      }
    };

    window.addEventListener('organizationChanged', handleExternalOrgChange as EventListener);

    return () => {
      window.removeEventListener('organizationChanged', handleExternalOrgChange as EventListener);
    };
  }, [selectedOrgId, handleOrgChange]);

  const handleOrganizationChange = useCallback((value: string) => {
    if (value !== selectedOrgId) {
      logInfo(`Changing organization to: ${value}`, 'ui');
      setIsLoadingOrgData(true);
      setLastSyncedOrgId(null); // Reset to force data sync
      handleOrgChange(value);
    }
  }, [handleOrgChange, selectedOrgId]);

  return {
    isLoadingOrgData,
    handleOrganizationChange
  };
};
