
import React from "react";
import CollapsibleSection from "../CollapsibleSection";

const ParametersSection: React.FC = () => {
  return (
    <CollapsibleSection title="PARAMETERS">
      <div className="p-4 text-center text-gray-500 bg-white rounded-md">
        Parameter settings will appear here
      </div>
    </CollapsibleSection>
  );
};

export default ParametersSection;
