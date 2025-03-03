
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";

interface PlatformsSectionProps {
  adPlatform: string;
  setAdPlatform: (platform: string) => void;
}

const PLATFORM_OPTIONS = ["Google", "Meta"];

const PlatformsSection: React.FC<PlatformsSectionProps> = ({
  adPlatform,
  setAdPlatform
}) => {
  return (
    <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-4 font-bold text-xl">PLATFORMS</h2>
      <table className="w-full border-collapse border-transparent">
        <tbody>
          <tr className="border-transparent">
            <td colSpan={2} className="py-4 text-center">
              <div className="inline-block min-w-[180px]">
                <Select value={adPlatform} onValueChange={value => {
                  if (value === "clear-selection") {
                    setAdPlatform("");
                  } else {
                    setAdPlatform(value);
                  }
                }}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {PLATFORM_OPTIONS.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                    <SelectSeparator className="my-1" />
                    <SelectItem value="clear-selection" className="text-gray-500">
                      Clear
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlatformsSection;
