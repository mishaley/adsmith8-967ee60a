
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
}) => {
  return (
    <div className="flex items-center justify-center w-full mb-4">
      <div className="flex items-center">
        <label className="mr-2 text-sm font-medium">Format:</label>
        <Select value={selectedFormat} onValueChange={onFormatChange}>
          <SelectTrigger className="w-[200px] h-9 bg-white">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="graphic-variety">Graphic Variety</SelectItem>
            <SelectItem value="brand-aesthetic">Brand Aesthetic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormatSelector;
