
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { useOrganizationSync } from "./hooks/useOrganizationSync";
import { useCascadingSelections } from "./hooks/useCascadingSelections";
import CampaignSettingsForm from "./components/CampaignSettingsForm";

const New = () => {
  const { selectedOrgId, handleOrgChange } = useOrganizationSync();
  
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
  } = useCascadingSelections(selectedOrgId);

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

export default New;
