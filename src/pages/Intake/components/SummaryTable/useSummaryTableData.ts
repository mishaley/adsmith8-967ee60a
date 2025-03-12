
import { useOrganizationData } from "../../hooks/useOrganizationData";
import { useOfferingData } from "../../hooks/useOfferingData";
import { usePersonaMessageData } from "../../hooks/usePersonaMessageData";

export const useSummaryTableData = () => {
  // Get organization data
  const {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    currentOrganization,
    handleOrgChange,
    isLoadingOrganizations
  } = useOrganizationData();

  // Get offering data based on selected organization
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    offerings,
    offeringOptions,
    isOfferingsDisabled,
    isOfferingsLoading
  } = useOfferingData(selectedOrgId);

  // Get persona and message data
  const {
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    personaOptions,
    messageOptions,
    isPersonasDisabled,
    isMessagesDisabled
  } = usePersonaMessageData();

  return {
    // Organization data
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    currentOrganization,
    handleOrgChange,
    isLoadingOrganizations,
    // Offering data
    selectedOfferingId,
    setSelectedOfferingId,
    offerings,
    offeringOptions,
    isOfferingsDisabled,
    isOfferingsLoading,
    
    // Persona and message data
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    personaOptions,
    messageOptions,
    isPersonasDisabled: isPersonasDisabled(selectedOfferingId),
    isMessagesDisabled
  };
};
