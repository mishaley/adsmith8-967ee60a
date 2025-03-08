
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { useOrganizationSync } from "./hooks/useOrganizationSync";
import { useCampaignSettings } from "./hooks/useCampaignSettings";
import CampaignSettingsForm from "./components/CampaignSettingsForm";

const NewCampaignPage = () => {
  // Sync organization selection with localStorage
  const { selectedOrgId, handleOrgChange } = useOrganizationSync();
  
  // Get all campaign settings state and handlers
  const {
    organizations,
    selectedPlatform,
    dailyBudget,
    selectedBidStrategy,
    selectedLocation,
    selectedLanguage,
    selectedOfferingIds,
    selectedPersonaIds,
    selectedMessageIds,
    setSelectedOfferingIds,
    setSelectedPersonaIds,
    setSelectedMessageIds,
    handlePlatformChange,
    handleDailyBudgetChange,
    handleBidStrategyChange,
    handleLocationChange,
    handleLanguageChange,
    offeringOptions,
    personaOptions,
    messageOptions
  } = useCampaignSettings(selectedOrgId);

  return (
    <QuadrantLayout>
      {{
        q4: (
          <CampaignSettingsForm
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            handleOrgChange={handleOrgChange}
            offeringOptions={offeringOptions}
            selectedOfferingIds={selectedOfferingIds}
            setSelectedOfferingIds={setSelectedOfferingIds}
            personaOptions={personaOptions}
            selectedPersonaIds={selectedPersonaIds}
            setSelectedPersonaIds={setSelectedPersonaIds}
            messageOptions={messageOptions}
            selectedMessageIds={selectedMessageIds}
            setSelectedMessageIds={setSelectedMessageIds}
            selectedPlatform={selectedPlatform}
            handlePlatformChange={handlePlatformChange}
            dailyBudget={dailyBudget}
            handleDailyBudgetChange={handleDailyBudgetChange}
            selectedBidStrategy={selectedBidStrategy}
            handleBidStrategyChange={handleBidStrategyChange}
            selectedLocation={selectedLocation}
            handleLocationChange={handleLocationChange}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default NewCampaignPage;
