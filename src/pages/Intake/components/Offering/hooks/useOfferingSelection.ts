
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { STORAGE_KEYS, isValidJSON } from "../../../utils/localStorageUtils";

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
  const previousOfferingIdRef = useRef<string>(selectedOfferingId);
  
  // Save selected offering ID to localStorage when it changes
  useEffect(() => {
    try {
      if (selectedOfferingId && selectedOfferingId !== previousOfferingIdRef.current) {
        console.log(`Saving offering ID in useOfferingSelection: ${selectedOfferingId}`);
        localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, selectedOfferingId);
        
        // Dispatch custom event for other components
        const event = new CustomEvent("offeringChanged", { 
          detail: { offeringId: selectedOfferingId }
        });
        window.dispatchEvent(event);
        
        previousOfferingIdRef.current = selectedOfferingId;
      } else if (!selectedOfferingId && previousOfferingIdRef.current) {
        // Clear localStorage when offering is reset
        console.log("Clearing offering selection from localStorage");
        localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        previousOfferingIdRef.current = "";
      }
    } catch (error) {
      console.error("Error saving offering selection to localStorage:", error);
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
    
    try {
      if (!value) {
        // Clear fields when no offering is selected
        setOffering("");
        setSellingPoints("");
        setProblemSolved("");
        setUniqueOffering("");
        // Clear the localStorage value
        localStorage.removeItem(`${STORAGE_KEYS.OFFERING}_selectedId`);
        previousOfferingIdRef.current = "";
      } else if (value === "new-offering") {
        toast({
          title: "Creating a new offering",
          description: "Please fill in the offering details below.",
        });
        // Store this selection in localStorage too
        localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, value);
        previousOfferingIdRef.current = value;
      } else {
        // Store selected offering ID
        localStorage.setItem(`${STORAGE_KEYS.OFFERING}_selectedId`, value);
        previousOfferingIdRef.current = value;
      }
      
      // Dispatch custom event
      const event = new CustomEvent("offeringChanged", { 
        detail: { offeringId: value }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error handling offering change:", error);
      // Show toast for error
      toast({
        title: "Error changing offering",
        description: "There was a problem selecting this offering. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    offeringInputRef,
    handleOfferingChange
  };
};
