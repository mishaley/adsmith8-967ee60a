
export type AspectRatioConfig = {
  label: string;
  ratio: string;
  width: number;
  height: number;
  description?: string;
  colorScheme: {
    bg: string;
    text: string;
  }
};

// Create aspect ratio configurations
export const aspectRatioConfigs: AspectRatioConfig[] = [
  { 
    label: "1:1", 
    ratio: "1:1", 
    width: 1, 
    height: 1, 
    description: "Square format - equal width and height",
    colorScheme: {
      bg: "bg-blue-100",
      text: "text-blue-800"
    }
  },
  { 
    label: "4:5", 
    ratio: "4:5", 
    width: 4, 
    height: 5, 
    description: "Portrait format - taller than wide",
    colorScheme: {
      bg: "bg-purple-100",
      text: "text-purple-800"
    }
  },
  { 
    label: "9:16", 
    ratio: "9:16", 
    width: 9, 
    height: 16, 
    description: "Vertical format - much taller than wide",
    colorScheme: {
      bg: "bg-green-100",
      text: "text-green-800"
    }
  },
];
