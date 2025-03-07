
import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";
import { useOrganizationIndustrySync } from "../hooks/useOrganizationIndustrySync";
import { useOrganizationCreation } from "../hooks/useOrganizationCreation";
import { OrganizationForm, OrganizationButton } from "./Organization";

interface OrganizationSectionProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  handleSave: () => void;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  brandName,
  setBrandName,
  industry,
  setIndustry,
  handleSave
}) => {
  const [isLoadingOrgData, setIsLoadingOrgData] = useState(false);

  const {
    selectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization
  } = useSummaryTableData();

  const {
    isUpdating
  } = useOrganizationIndustrySync(selectedOrgId, industry, setIndustry);
  
  const {
    isCreatingOrg,
    handleSaveClick
  } = useOrganizationCreation(brandName, industry, handleOrgChange, handleSave);

  const handleOrganizationChange = (value: string) => {
    console.log("OrganizationSection - Organization change detected:", value);
    setIsLoadingOrgData(true);
    handleOrgChange(value);
  };

  useEffect(() => {
    if (currentOrganization) {
      console.log("OrganizationSection - Filling form with organization data:", currentOrganization);

      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
        console.log("OrganizationSection - Setting brand name to:", currentOrganization.organization_name);
      }

      if (currentOrganization.organization_industry) {
        setIndustry(currentOrganization.organization_industry);
        console.log("OrganizationSection - Setting industry to:", currentOrganization.organization_industry);
      }

      setIsLoadingOrgData(false);
    } else if (selectedOrgId === "new-organization") {
      setBrandName("");
      setIndustry("");
      console.log("OrganizationSection - Clearing form fields for new organization");
      setIsLoadingOrgData(false);
    }
  }, [currentOrganization, selectedOrgId, setBrandName, setIndustry]);

  useEffect(() => {
    const handleExternalOrgChange = (event: CustomEvent) => {
      const newOrgId = event.detail.organizationId;
      console.log("OrganizationSection - Detected external organization change:", newOrgId);

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

  const isOrgSelected = !!selectedOrgId || selectedOrgId === "new-organization";
  const isReadOnly = !!selectedOrgId && selectedOrgId !== "new-organization";

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
  };

  const onButtonClick = () => {
    handleSaveClick(selectedOrgId);
  };
  
  const isButtonDisabled = isCreatingOrg || isUpdating || isLoadingOrgData;

  return (
    <CollapsibleSection title="ORGANIZATION">
      <OrganizationForm
        selectedOrgId={selectedOrgId}
        organizations={organizations}
        handleOrganizationChange={handleOrganizationChange}
        brandName={brandName}
        setBrandName={setBrandName}
        industry={industry}
        handleIndustryChange={handleIndustryChange}
        isReadOnly={isReadOnly}
        isUpdating={isUpdating}
        isLoadingOrgData={isLoadingOrgData}
      />
      
      {isOrgSelected && (
        <OrganizationButton 
          onClick={onButtonClick}
          isDisabled={isButtonDisabled}
          isCreating={isCreatingOrg}
        />
      )}
    </CollapsibleSection>
  );
};

export default OrganizationSection;
