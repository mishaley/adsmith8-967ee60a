
import React from "react";
import IntakeHeader from "./IntakeHeader";
import StyleTester from "./Images/components/StyleTester";

const IntakeTop: React.FC = () => {
  return (
    <div className="space-y-6">
      <StyleTester />
      <IntakeHeader />
    </div>
  );
};

export default IntakeTop;
