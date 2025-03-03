
import React from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface IntakeFormFieldsProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  offering: string;
  setOffering: (value: string) => void;
  sellingPoints: string;
  setSellingPoints: (value: string) => void;
  problemSolved: string;
  setProblemSolved: (value: string) => void;
  uniqueOffering: string;
  setUniqueOffering: (value: string) => void;
  adPlatform: string;
  setAdPlatform: (value: string) => void;
  handleSave: () => void;
}

const PLATFORM_OPTIONS = ["Google", "Meta"];

const IntakeFormFields: React.FC<IntakeFormFieldsProps> = ({
  brandName,
  setBrandName,
  industry,
  setIndustry,
  businessDescription,
  setBusinessDescription,
  offering,
  setOffering,
  sellingPoints,
  setSellingPoints,
  problemSolved,
  setProblemSolved,
  uniqueOffering,
  setUniqueOffering,
  adPlatform,
  setAdPlatform,
  handleSave
}) => {
  return (
    <>
      <tr className="border-b">
        <td className="py-4 pr-4 text-lg">
          <div>What's your brand name?</div>
        </td>
        <td className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-96">
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </td>
      </tr>
      <FormField 
        label="What industry are you in?" 
        value={industry} 
        onChange={e => setIndustry(e.target.value)} 
      />
      <RecordingField 
        label="Tell me about your business" 
        value={businessDescription} 
        onChange={setBusinessDescription} 
        placeholder="Speak for at least 30 seconds" 
      />
      <FormField 
        label="Name just one of your offerings" 
        helperText="We can add more later" 
        helperTextClassName="text-sm text-gray-500 mt-1" 
        value={offering} 
        onChange={e => setOffering(e.target.value)} 
      />
      <RecordingField 
        label="Key Selling Points" 
        helperText="Main reasons why customers buy this offering" 
        value={sellingPoints} 
        onChange={setSellingPoints} 
        placeholder="Speak for at least 30 seconds" 
      />
      <RecordingField 
        label="Problem Solved" 
        helperText="How does this offering help your customers?" 
        value={problemSolved} 
        onChange={setProblemSolved} 
        placeholder="Speak for at least 30 seconds" 
      />
      <RecordingField 
        label="Unique Advantages" 
        helperText="How is this offering better than alternatives?" 
        value={uniqueOffering} 
        onChange={setUniqueOffering} 
        placeholder="Speak for at least 30 seconds" 
      />
      <tr className="border-b">
        <td className="py-4 pr-4 text-lg">
          <div>Ad Platform</div>
        </td>
        <td className="py-4">
          <div className="inline-block min-w-[180px]">
            <Select 
              value={adPlatform} 
              onValueChange={(value) => {
                if (value === "clear-selection") {
                  setAdPlatform("");
                } else {
                  setAdPlatform(value);
                }
              }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                {PLATFORM_OPTIONS.map((platform) => (
                  <SelectItem 
                    key={platform}
                    value={platform}
                  >
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
    </>
  );
};

export default IntakeFormFields;
