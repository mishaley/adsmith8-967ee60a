
import React from "react";

interface IntakeHeaderProps {
  title: string;
  subtitle: string;
}

const IntakeHeader: React.FC<IntakeHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};

export default IntakeHeader;
