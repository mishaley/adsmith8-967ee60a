
import React from "react";
import CollapsibleSection from "../CollapsibleSection";

const CaptionsSection: React.FC = () => {
  return (
    <CollapsibleSection title="CAPTIONS">
      <div className="p-4 text-center text-gray-500 bg-white rounded-md">
        Caption content will appear here
      </div>
    </CollapsibleSection>
  );
};

export default CaptionsSection;
