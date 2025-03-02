
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

interface CountrySelectorProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil"
];

const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  selectedCountry, 
  setSelectedCountry 
}) => {
  return (
    <div className="inline-block min-w-[220px]">
      <Select 
        value={selectedCountry} 
        onValueChange={(value) => {
          if (value === "clear-selection") {
            setSelectedCountry("");
          } else {
            setSelectedCountry(value);
          }
        }}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
          {COUNTRIES.map((country) => (
            <SelectItem 
              key={country}
              value={country}
            >
              {country}
            </SelectItem>
          ))}
          <SelectSeparator className="my-1" />
          <SelectItem value="clear-selection" className="text-gray-500">
            Clear
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelector;
