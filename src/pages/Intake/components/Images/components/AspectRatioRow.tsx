
import React from "react";
import { AspectRatioCell } from "./AspectRatioCell";
import { AspectRatioConfig } from "./AspectRatioConfig";

interface AspectRatioRowProps {
  config: AspectRatioConfig;
  cellHeight: number;
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

export const AspectRatioRow: React.FC<AspectRatioRowProps> = ({ 
  config, 
  cellHeight, 
  selectedRatio,
  onSelectRatio
}) => {
  return (
    <>
      {[0, 1, 2].map((cellIndex) => (
        <AspectRatioCell
          key={cellIndex}
          ratio={config.ratio}
          width={config.width}
          height={config.height}
          label={config.label}
          colorScheme={config.colorScheme}
          selected={selectedRatio === config.ratio}
          onSelect={() => onSelectRatio(config.ratio)}
        />
      ))}
    </>
  );
};
