
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { STORAGE_KEYS } from "../../../utils/localStorageUtils";

interface UseOfferingSelectionProps {
  selectedOfferingId: string;
  setSelectedOfferingId: (value: string) => void;
  offeringDetails: any;
  setOffering: (value: string) => void;
  setSellingPoints: (value: string) => void;
  setProblemSolved: (value: string) => void;
  setUniqueOffering: (value: string) => void;
  refetchOfferingDetails: () => void;
}

export const useOfferingSelection = ({
  selectedOfferingId,
  setSelectedOfferingId,
  offeringDetails,
  setOffering,
  setSellingPoints,
  setProblemSolved,
  setUniqueOffering,
  refetchOfferingDetails
}: UseOfferingSelectionProps) => {
  const { toast } = useToast();
  const offeringInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Save selected offering ID to localStorage when it changes
  useEffect(() => {
    if (selectedOfferingId) {
      console.log(`Saving offering ID in useOfferingSelection: ${selectedOfferingId}`);
      localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, selectedOfferingId);
      
      // Dispatch custom event for other components
      const event = new CustomEvent("offeringChanged", { 
        detail: { offeringId: selectedOfferingId }
      });
      window.dispatchEvent(event);
    }
  }, [selectedOfferingId]);
  
  // Auto-focus the offering name field when "new-offering" is selected
  useEffect(() => {
    if (selectedOfferingId === "new-offering" && offeringInputRef.current) {
      // Small delay to ensure the field is rendered and visible
      const timeoutId = setTimeout(() => {
        offeringInputRef.current?.focus();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedOfferingId]);

  // Update local form fields when an existing offering is selected
  useEffect(() => {
    if (offeringDetails) {
      setOffering(offeringDetails.offering_name || "");
      setSellingPoints(offeringDetails.offering_keysellingpoints || "");
      setProblemSolved(offeringDetails.offering_problemsolved || "");
      setUniqueOffering(offeringDetails.offering_uniqueadvantages || "");
    } else if (selectedOfferingId === "new-offering") {
      // Clear fields for new offering
      setOffering("");
      setSellingPoints("");
      setProblemSolved("");
      setUniqueOffering("");
    }
  }, [
    offeringDetails, 
    selectedOfferingId, 
    setOffering, 
    setSellingPoints, 
    setProblemSolved, 
    setUniqueOffering
  ]);

  // Effect to refetch offering details when the user selects a different offering
  useEffect(() => {
    if (selectedOfferingId && selectedOfferingId !== "new-offering") {
      refetchOfferingDetails();
    }
  }, [selectedOfferingId, refetchOfferingDetails]);

  // Handle offering change
  const handleOfferingChange = (value: string) => {
    console.log(`Offering selection changed to: ${value}`);
    setSelectedOfferingId(value);
    
    if (!value) {
      // Clear fields when no offering is selected
      setOffering("");
      setSellingPoints("");
      setProblemSolved("");
      setUniqueOffering("");
      // Clear the localStorage value
      localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
    } else if (value === "new-offering") {
      toast({
        title: "Creating a new offering",
        description: "Please fill in the offering details below.",
      });
      // Store this selection in localStorage too
      localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, value);
    } else {
      // Store selected offering ID
      localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, value);
    }
    
    // Dispatch custom event
    const event = new CustomEvent("offeringChanged", { 
      detail: { offeringId: value }
    });
    window.dispatchEvent(event);
  };

  return {
    offeringInputRef,
    handleOfferingChange
  };
};
