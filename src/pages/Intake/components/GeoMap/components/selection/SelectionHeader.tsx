
import React from "react";

interface SelectionHeaderProps {
  title: string;
}

const SelectionHeader: React.FC<SelectionHeaderProps> = ({ title }) => {
  return <div className="font-bold text-lg mb-4">{title}</div>;
};

export default SelectionHeader;
