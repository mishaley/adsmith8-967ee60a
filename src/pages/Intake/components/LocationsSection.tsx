
import React from "react";
import GeoMapSection from "./GeoMap/GeoMapSection";

interface LocationsSectionProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-2 font-bold text-xl">LOCATIONS</h2>
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <GeoMapSection
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationsSection;
