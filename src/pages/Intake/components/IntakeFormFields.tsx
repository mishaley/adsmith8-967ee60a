import React from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import { Button } from "@/components/ui/button";

interface IntakeFormFieldsProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
  adPlatform: string;
  setAdPlatform: (value: string) => void;
  handleSave: () => void;
}

const IntakeFormFields: React.FC<IntakeFormFieldsProps> = ({
  brandName,
  setBrandName,
  industry,
  setIndustry,
  businessDescription,
  setBusinessDescription,
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering,
  adPlatform,
  setAdPlatform,
  handleSave
}) => {
  return (
    <>
      {/* The offering fields have been moved to the OfferingSection component */}
    </>
  );
};

export default IntakeFormFields;
