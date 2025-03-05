
import React from "react";
import OfferingSection from "../OfferingSection";

interface OfferingContainerProps {
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
}

const OfferingContainer: React.FC<OfferingContainerProps> = ({
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering
}) => {
  return (
    <OfferingSection
      offering={offering}
      setOffering={setOffering}
      sellingPoints={sellingPoints}
      setSellingPoints={setSellingPoints}
      problemSolved={problemSolved}
      setProblemSolved={setProblemSolved}
      uniqueOffering={uniqueOffering}
      setUniqueOffering={setUniqueOffering}
    />
  );
};

export default OfferingContainer;
