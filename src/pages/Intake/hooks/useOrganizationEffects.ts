
import { useEffect, useState } from "react";

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

  // Effect to sync organization data with form fields
  useEffect(() => {
    if (currentOrganization) {
      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
      }

      if (currentOrganization.organization_industry) {
        setIndustry(currentOrganization.organization_industry);
      }

      setIsLoadingOrgData(false);
    } else if (selectedOrgId === "new-organization") {
      setBrandName("");
      setIndustry("");
      setIsLoadingOrgData(false);
    }
  }, [currentOrganization, selectedOrgId, setBrandName, setIndustry]);

  // Effect to listen for external organization changes
  useEffect(() => {
    const handleExternalOrgChange = (event: CustomEvent) => {
      const newOrgId = event.detail.organizationId;

      if (newOrgId !== selectedOrgId) {
        setIsLoadingOrgData(true);
        handleOrgChange(newOrgId);
      }
    };

    window.addEventListener('organizationChanged', handleExternalOrgChange as EventListener);

    return () => {
      window.removeEventListener('organizationChanged', handleExternalOrgChange as EventListener);
    };
  }, [selectedOrgId, handleOrgChange]);

  const handleOrganizationChange = (value: string) => {
    setIsLoadingOrgData(true);
    handleOrgChange(value);
  };

  return {
    isLoadingOrgData,
    handleOrganizationChange
  };
};
