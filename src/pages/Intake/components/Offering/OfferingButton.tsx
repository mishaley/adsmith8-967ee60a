
import React from "react";
import { OfferingButton as BaseOfferingButton } from "../Organization";

interface OfferingSectionButtonProps {
  onClick: () => void;
  isSaving: boolean;
  isDisabled: boolean;
}

const OfferingSectionButton: React.FC<OfferingSectionButtonProps> = ({
  onClick,
  isSaving,
  isDisabled
}) => {
  return (
    <div className="flex justify-center mt-6 mb-3">
      <BaseOfferingButton 
        onClick={onClick}
        isCreating={isSaving}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default OfferingSectionButton;
