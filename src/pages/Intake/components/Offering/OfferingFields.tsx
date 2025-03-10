
import React from "react";
import RecordingField from "../RecordingField";

interface OfferingFieldsProps {
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
  offeringInputRef: React.RefObject<HTMLTextAreaElement>;
}

const OfferingFields: React.FC<OfferingFieldsProps> = ({
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering,
  offeringInputRef
}) => {
  return (
    <>
      <RecordingField 
        label="Name just one of your offerings" 
        value={offering} 
        onChange={setOffering} 
        ref={offeringInputRef}
        placeholder=""
      />
      <RecordingField 
        label="Key Selling Points" 
        value={sellingPoints} 
        onChange={setSellingPoints} 
        placeholder=""
      />
      <RecordingField 
        label="Problem Solved" 
        value={problemSolved} 
        onChange={setProblemSolved} 
        placeholder=""
      />
      <RecordingField 
        label="Unique Advantages" 
        value={uniqueOffering} 
        onChange={setUniqueOffering} 
        placeholder=""
      />
    </>
  );
};

export default OfferingFields;
