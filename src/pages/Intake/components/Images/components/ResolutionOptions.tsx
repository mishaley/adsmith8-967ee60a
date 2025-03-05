
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Resolution {
  value: string;
  label: string;
  dimensions: string;
}

interface ResolutionOptionsProps {
  adPlatform: string;
}

const ResolutionOptions: React.FC<ResolutionOptionsProps> = ({ adPlatform }) => {
  // Get platform-specific resolutions
  const resolutions = getResolutionsForPlatform(adPlatform);
  
  // Default to the first resolution
  const [selectedResolution, setSelectedResolution] = useState<string>(
    resolutions.length > 0 ? resolutions[0].value : ""
  );

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium text-sm mb-1 text-gray-700">Select Resolution:</h3>
      <RadioGroup
        value={selectedResolution}
        onValueChange={setSelectedResolution}
        className="flex flex-wrap gap-2"
      >
        {resolutions.map((resolution) => (
          <div key={resolution.value} className="flex items-center space-x-1">
            <RadioGroupItem value={resolution.value} id={resolution.value} />
            <Label htmlFor={resolution.value} className="text-xs">
              {resolution.label} ({resolution.dimensions})
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

// Helper function to get resolutions based on the selected platform
function getResolutionsForPlatform(platform: string): Resolution[] {
  switch (platform.toLowerCase()) {
    case "facebook":
      return [
        { value: "fb-square", label: "Square", dimensions: "1080×1080" },
        { value: "fb-portrait", label: "Portrait", dimensions: "1080×1350" },
        { value: "fb-landscape", label: "Landscape", dimensions: "1200×628" }
      ];
    case "instagram":
      return [
        { value: "ig-square", label: "Square", dimensions: "1080×1080" },
        { value: "ig-portrait", label: "Portrait", dimensions: "1080×1350" },
        { value: "ig-story", label: "Story", dimensions: "1080×1920" }
      ];
    case "twitter":
      return [
        { value: "tw-landscape", label: "Landscape", dimensions: "1200×675" },
        { value: "tw-square", label: "Square", dimensions: "1200×1200" }
      ];
    case "linkedin":
      return [
        { value: "li-square", label: "Square", dimensions: "1200×1200" },
        { value: "li-landscape", label: "Landscape", dimensions: "1200×627" }
      ];
    case "tiktok":
      return [
        { value: "tt-vertical", label: "Vertical", dimensions: "1080×1920" }
      ];
    case "youtube":
      return [
        { value: "yt-thumbnail", label: "Thumbnail", dimensions: "1280×720" },
        { value: "yt-display", label: "Display", dimensions: "300×250" }
      ];
    default:
      return [
        { value: "default-square", label: "Square", dimensions: "1080×1080" },
        { value: "default-landscape", label: "Landscape", dimensions: "1200×628" },
        { value: "default-portrait", label: "Portrait", dimensions: "1080×1350" }
      ];
  }
}

export default ResolutionOptions;
