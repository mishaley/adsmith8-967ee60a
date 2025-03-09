
import { useEffect, useState, useCallback } from "react";
import { logDebug, logError, logInfo } from "@/utils/logging";

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
      logDebug(`Organization data already synced for org ID: ${selectedOrgId}`);
      return;
    }

    if (currentOrganization) {
      logInfo(`Syncing data for organization: ${currentOrganization.organization_name}`);
      
      // Update brand name if available
      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
      }

      // Update industry if available, otherwise clear it
      if (currentOrganization.organization_industry) {
        logDebug(`Setting industry to: ${currentOrganization.organization_industry}`);
        setIndustry(currentOrganization.organization_industry);
      } else {
        logDebug('Clearing industry field as organization has no industry set');
        setIndustry('');
      }

      setLastSyncedOrgId(selectedOrgId);
      setIsLoadingOrgData(false);
    } else if (selectedOrgId === "new-organization") {
      logInfo('Creating new organization, clearing fields');
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
          logError("Received organizationChanged event with missing organizationId");
          return;
        }

        if (newOrgId !== selectedOrgId) {
          logInfo(`External organization change detected: ${newOrgId}`);
          setIsLoadingOrgData(true);
          setLastSyncedOrgId(null); // Reset to force data sync
          handleOrgChange(newOrgId);
        }
      } catch (error) {
        logError("Error handling external organization change event:", error);
      }
    };

    window.addEventListener('organizationChanged', handleExternalOrgChange as EventListener);

    return () => {
      window.removeEventListener('organizationChanged', handleExternalOrgChange as EventListener);
    };
  }, [selectedOrgId, handleOrgChange]);

  const handleOrganizationChange = useCallback((value: string) => {
    if (value !== selectedOrgId) {
      logInfo(`Changing organization to: ${value}`);
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
