
import React from "react";

interface ResolutionOptionsProps {
  adPlatform: string;
}

const ResolutionOptions: React.FC<ResolutionOptionsProps> = ({ adPlatform }) => {
  // Calculate the number of images (placeholder for now)
  const getImageCountPlaceholder = () => 10;
  
  // Get the appropriate resolution options based on the ad platform
  const getResolutionsForPlatform = () => {
    const platformResolutions = {
      "Google": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "21:11", value: "RESOLUTION_1344_704" }
      ],
      "Meta": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "9:16", value: "RESOLUTION_720_1280" }
      ]
    };
    
    return adPlatform && platformResolutions[adPlatform] ? platformResolutions[adPlatform] : [];
  };
  
  // Determine what to display in the resolution row
  if (!adPlatform) {
    return <span className="text-gray-500">Select an Ad Platform to see available resolutions</span>;
  }
  
  const resOptions = getResolutionsForPlatform();
  
  return (
    <div>
      <span className="font-medium">{adPlatform} - </span>
      {resOptions.map((res, index) => (
        <React.Fragment key={res.value}>
          <span>{res.label} ({getImageCountPlaceholder()}) </span>
          {index < resOptions.length - 1 && <span className="text-gray-400">• </span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ResolutionOptions;
