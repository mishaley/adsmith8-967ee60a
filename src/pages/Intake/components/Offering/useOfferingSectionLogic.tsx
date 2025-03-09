
import { useOfferingInitialization } from "./hooks/useOfferingInitialization";
import { useOfferingSyncEvents } from "./hooks/useOfferingSyncEvents";
import { useOfferingForm } from "../../hooks/form/useOfferingForm";
import { useOfferingSelection } from "./hooks/useOfferingSelection";
import { useOfferingSave } from "./hooks/useOfferingSave";
import { useSummaryTableData } from "../SummaryTable/useSummaryTableData";
import { useOfferingDetails } from "../SummaryTable/hooks/useOfferingDetails";

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

  // Handle initial offering loading from localStorage
  useOfferingInitialization({
    offeringOptions,
    isOfferingsDisabled,
    selectedOfferingId,
    setSelectedOfferingId,
    refetchOfferingDetails,
    selectedOrgId
  });

  // Handle window events for synchronization
  useOfferingSyncEvents({
    selectedOfferingId,
    setSelectedOfferingId
  });

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
