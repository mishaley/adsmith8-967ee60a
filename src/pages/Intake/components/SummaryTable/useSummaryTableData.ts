
import { useOrganizationSelection } from "./hooks/useOrganizationSelection";
import { useOfferingSelection } from "./hooks/useOfferingSelection";
import { usePersonaSelection } from "./hooks/usePersonaSelection";
import { useMessageSelection } from "./hooks/useMessageSelection";

export const useSummaryTableData = () => {
  // Get organization selection data and functions
  const {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization
  } = useOrganizationSelection();
  
  // Get offering selection data and functions
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    offeringOptions,
    isOfferingsDisabled
  } = useOfferingSelection(selectedOrgId);
  
  // Get persona selection data and functions
  const {
    selectedPersonaIds,
    setSelectedPersonaIds,
    personaOptions,
    isPersonasDisabled
  } = usePersonaSelection(selectedOfferingId, isOfferingsDisabled);
  
  // Get message selection data and functions
  const {
    selectedMessageIds,
    setSelectedMessageIds,
    messageOptions,
    isMessagesDisabled
  } = useMessageSelection(selectedPersonaIds, isPersonasDisabled);

  // Return all the data and functions needed by components
  return {
    // Organization
    selectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization,
    
    // Offering
    selectedOfferingId,
    setSelectedOfferingId,
    offeringOptions,
    
    // Persona
    selectedPersonaIds,
    setSelectedPersonaIds,
    personaOptions,
    
    // Message
    selectedMessageIds,
    setSelectedMessageIds,
    messageOptions,
    
    // Disabled states
    isOfferingsDisabled,
    isPersonasDisabled,
    isMessagesDisabled
  };
};
