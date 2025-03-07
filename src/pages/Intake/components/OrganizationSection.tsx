
import React from "react";
import CollapsibleSection from "./CollapsibleSection";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";
import { useOrganizationIndustrySync } from "../hooks/useOrganizationIndustrySync";
import { useOrganizationCreation } from "../hooks/useOrganizationCreation";
import { useOrganizationEffects } from "../hooks/useOrganizationEffects";
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
  
  const {
    isLoadingOrgData,
    handleOrganizationChange
  } = useOrganizationEffects({
    currentOrganization,
    selectedOrgId,
    setBrandName,
    setIndustry,
    handleOrgChange
  });

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
