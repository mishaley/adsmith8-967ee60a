
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
  isReadOnly: boolean;
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
  offeringInputRef,
  isReadOnly
}) => {
  return (
    <>
      <RecordingField 
        label="Name just one of your offerings" 
        value={offering} 
        onChange={setOffering} 
        ref={offeringInputRef}
        placeholder=""
        disabled={isReadOnly}
      />
      <RecordingField 
        label="Key Selling Points" 
        value={sellingPoints} 
        onChange={setSellingPoints} 
        placeholder=""
        disabled={isReadOnly}
      />
      <RecordingField 
        label="Problem Solved" 
        value={problemSolved} 
        onChange={setProblemSolved} 
        placeholder=""
        disabled={isReadOnly}
      />
      <RecordingField 
        label="Unique Advantages" 
        value={uniqueOffering} 
        onChange={setUniqueOffering} 
        placeholder=""
        disabled={isReadOnly}
      />
    </>
  );
};

export default OfferingFields;
