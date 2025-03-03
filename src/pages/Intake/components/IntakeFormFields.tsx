
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
      <FormField 
        label="Name just one of your offerings" 
        helperText="We can add more later" 
        helperTextClassName="text-sm text-gray-500 mt-1" 
        value={offering} 
        onChange={e => setOffering(e.target.value)} 
      />
      <RecordingField 
        label="Key Selling Points" 
        helperText="Main reasons why customers buy this offering" 
        value={sellingPoints} 
        onChange={setSellingPoints} 
        placeholder="Speak for at least 30 seconds" 
      />
      <RecordingField 
        label="Problem Solved" 
        helperText="How does this offering help your customers?" 
        value={problemSolved} 
        onChange={setProblemSolved} 
        placeholder="Speak for at least 30 seconds" 
      />
      <RecordingField 
        label="Unique Advantages" 
        helperText="How is this offering better than alternatives?" 
        value={uniqueOffering} 
        onChange={setUniqueOffering} 
        placeholder="Speak for at least 30 seconds" 
      />
    </>
  );
};

export default IntakeFormFields;
