
import React, { useState } from "react";
import GeoMapSection from "./GeoMap/GeoMapSection";
import { Input } from "@/components/ui/input";

interface LocationsSectionProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  const [locationGroupName, setLocationGroupName] = useState("");

  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">LOCATIONS</h2>
      <GeoMapSection
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
      
      <div className="mt-4">
        <label htmlFor="locationGroup" className="block text-sm font-medium text-gray-700 mb-1">
          Location Group Name
        </label>
        <Input
          id="locationGroup"
          type="text"
          placeholder="Enter a name for this location group"
          value={locationGroupName}
          onChange={(e) => setLocationGroupName(e.target.value)}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">Save this location group</p>
      </div>
    </div>
  );
};

export default LocationsSection;
