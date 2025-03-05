
import React from "react";

export type AspectRatioConfig = {
  label: string;
  ratio: string;
  width: number;
  height: number;
  description?: string;
  icon: React.ReactNode;
};

// Create a function that returns the JSX element instead of using JSX directly
const createIcon = (width: string, height: string): React.ReactNode => {
  return React.createElement('div', {
    className: `${width} ${height} border border-current flex-shrink-0`
  });
};

export const aspectRatioConfigs: AspectRatioConfig[] = [
  { 
    label: "1:1", 
    ratio: "1:1", 
    width: 1, 
    height: 1, 
    description: "Square format - equal width and height",
    icon: createIcon("w-4", "h-4")
  },
  { 
    label: "4:5", 
    ratio: "4:5", 
    width: 4, 
    height: 5, 
    description: "Portrait format - taller than wide",
    icon: createIcon("w-3", "h-4")
  },
  { 
    label: "9:16", 
    ratio: "9:16", 
    width: 9, 
    height: 16, 
    description: "Vertical format - much taller than wide",
    icon: createIcon("w-2.5", "h-4")
  },
  { 
    label: "21:11", 
    ratio: "21:11", 
    width: 21, 
    height: 11, 
    description: "Landscape format - wider than tall",
    icon: createIcon("w-4", "h-2.5")
  },
];
