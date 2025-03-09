
import { useSummaryTableData } from "../SummaryTable/useSummaryTableData";
import { useOfferingDetails } from "../SummaryTable/hooks/useOfferingDetails";
import { useOfferingSelection } from "./hooks/useOfferingSelection";
import { useOfferingSave } from "./hooks/useOfferingSave";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../../utils/localStorageUtils";

interface UseOfferingSectionLogicProps {
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
}

export const useOfferingSectionLogic = ({
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering
}: UseOfferingSectionLogicProps) => {
  // Track if initial loading is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Get offering dropdown data and functionality
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    offeringOptions,
    isOfferingsDisabled,
    selectedOrgId
  } = useSummaryTableData();
  
  // Get offering details if an existing offering is selected
  const { offeringDetails, refetchOfferingDetails } = useOfferingDetails(selectedOfferingId);
  
  // Handle offering selection and form field population
  const { 
    offeringInputRef, 
    handleOfferingChange 
  } = useOfferingSelection({
    selectedOfferingId,
    setSelectedOfferingId,
    offeringDetails,
    setOffering,
    setSellingPoints,
    setProblemSolved,
    setUniqueOffering,
    refetchOfferingDetails
  });
  
  // Handle saving and submitting the offering
  const { 
    isSaving, 
    handleNextClick 
  } = useOfferingSave({
    selectedOrgId,
    selectedOfferingId,
    setSelectedOfferingId,
    offering,
    sellingPoints,
    problemSolved,
    uniqueOffering,
    refetchOfferingDetails
  });

  // Load the initial offering from localStorage on mount - only once
  useEffect(() => {
    if (!initialLoadComplete) {
      const storedOfferingId = localStorage.getItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
      
      if (storedOfferingId && !isOfferingsDisabled) {
        console.log(`Loading initial offering ID from storage: ${storedOfferingId}`);
        setSelectedOfferingId(storedOfferingId);
        
        // If it's a real offering ID (not "new-offering"), we should load its details
        if (storedOfferingId !== "new-offering") {
          refetchOfferingDetails();
        }
      }
      
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete, isOfferingsDisabled, refetchOfferingDetails, setSelectedOfferingId]);

  // Sync between components using window events
  useEffect(() => {
    const handleOfferingChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { offeringId } = customEvent.detail;
      
      if (offeringId && offeringId !== selectedOfferingId) {
        console.log(`Received offering changed event with ID: ${offeringId}`);
        setSelectedOfferingId(offeringId);
      }
    };
    
    window.addEventListener('offeringChanged', handleOfferingChanged as EventListener);
    
    return () => {
      window.removeEventListener('offeringChanged', handleOfferingChanged as EventListener);
    };
  }, [selectedOfferingId, setSelectedOfferingId]);

  return {
    selectedOfferingId,
    offeringOptions,
    isOfferingsDisabled,
    offeringDetails,
    offeringInputRef,
    handleOfferingChange,
    handleNextClick,
    isSaving
  };
};
