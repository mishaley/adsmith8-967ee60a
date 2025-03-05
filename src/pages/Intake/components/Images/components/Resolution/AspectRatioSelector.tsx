
import React from "react";
import { Button } from "@/components/ui/button";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";

interface AspectRatioSelectorProps {
  aspectRatioConfigs: AspectRatioConfig[];
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  aspectRatioConfigs,
  selectedRatio,
  onSelectRatio
}) => {
  return (
    <div className="flex justify-center gap-2 p-3 bg-transparent border-b">
      {aspectRatioConfigs.map((config) => (
        <Button
          key={config.ratio}
          variant={selectedRatio === config.ratio ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectRatio(config.ratio)}
          className="flex items-center gap-1"
          title={config.description}
        >
          {config.icon}
          {config.label}
        </Button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;
