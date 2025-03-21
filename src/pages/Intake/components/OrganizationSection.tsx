import React, { useEffect } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";
import { useOrganizationIndustrySync } from "../hooks/useOrganizationIndustrySync";
import { useOrganizationCreation } from "../hooks/useOrganizationCreation";
import { useOrganizationEffects } from "../hooks/useOrganizationEffects";
import { OrganizationForm, OrganizationButton } from "./Organization";
import { logDebug } from "@/utils/logging";

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
  handleSave,
}) => {
  const {
    selectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization,
    isLoadingOrganizations,
  } = useSummaryTableData();

  // Log the industry value for debugging
  React.useEffect(() => {
    logDebug(`OrganizationSection industry value: ${industry || "none"}`);
    if (currentOrganization) {
      logDebug(
        `Current organization industry in Supabase: ${
          currentOrganization.organization_industry || "none"
        }`
      );
    }
  }, [industry, currentOrganization]);

  const { isUpdating } = useOrganizationIndustrySync(
    selectedOrgId,
    industry,
    setIndustry
  );

  const { isCreatingOrg, handleSaveClick } = useOrganizationCreation(
    brandName,
    industry,
    handleOrgChange,
    handleSave
  );

  const { isLoadingOrgData, handleOrganizationChange } = useOrganizationEffects(
    {
      currentOrganization,
      selectedOrgId,
      setBrandName,
      setIndustry,
      handleOrgChange,
    }
  );

  // Determine if fields should be read-only
  // Fields should be read-only when an existing organization is selected
  const isOrgSelected = !!selectedOrgId;
  const isReadOnly = isOrgSelected && selectedOrgId !== "new-organization";

  const handleIndustryChange = (value: string) => {
    // Only allow changes if not read-only
    if (!isReadOnly) {
      setIndustry(value);
    }
  };

  const onButtonClick = () => {
    handleSaveClick(selectedOrgId);
  };

  const isButtonDisabled =
    isCreatingOrg || isUpdating || isLoadingOrgData || isLoadingOrganizations;
  const isLoading = isLoadingOrgData || isLoadingOrganizations;

  // Determine the display name for the organization when collapsed
  const getDisplayName = () => {
    if (selectedOrgId === "new-organization") {
      return brandName || "New Organization";
    }

    if (currentOrganization?.organization_name) {
      return currentOrganization.organization_name;
    }

    const selectedOrg = organizations.find(
      (org) => org.organization_id === selectedOrgId
    );
    return selectedOrg?.organization_name || brandName || "";
  };

  // Only show the selected value if we have an organization selected
  const selectedValue = isOrgSelected ? getDisplayName() : "";
  return (
    <CollapsibleSection
      title="ORGANIZATION"
      selectedValue={selectedValue}
      organization={isCreatingOrg}
    >
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
        isLoadingOrgData={isLoading}
      />

      {selectedOrgId === "new-organization" && (
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
