
import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";

interface PlatformsSectionProps {
  adPlatform: string;
  setAdPlatform: (platform: string) => void;
}

const PLATFORM_OPTIONS = ["Google", "Meta"];
const PLATFORM_ICONS = {
  Google: "https://kyxotvtinlpackztktxe.supabase.co/storage/v1/object/public/adsmith_assets/app/icons/googleads.png",
  Meta: "https://kyxotvtinlpackztktxe.supabase.co/storage/v1/object/public/adsmith_assets/app/icons/meta.png"
};

const PlatformsSection: React.FC<PlatformsSectionProps> = ({
  adPlatform,
  setAdPlatform
}) => {
  // Set Google as the default platform when component mounts
  useEffect(() => {
    if (!adPlatform) {
      setAdPlatform("Google");
    }
  }, [adPlatform, setAdPlatform]);

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
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {PLATFORM_OPTIONS.map(platform => (
                      <SelectItem key={platform} value={platform} className="flex items-center">
                        <div className="flex items-center gap-2">
                          <img 
                            src={PLATFORM_ICONS[platform]} 
                            alt={`${platform} icon`} 
                            className="h-4 w-4" 
                          />
                          <span>{platform}</span>
                        </div>
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
