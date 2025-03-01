
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import FormField from "./components/FormField";
import RecordingField from "./components/RecordingField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

// Campaign platform options from Supabase enum
const PLATFORM_OPTIONS = ["Google", "Meta"] as const;
type CampaignPlatform = typeof PLATFORM_OPTIONS[number];

const IntakeForm = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [problemSolved, setProblemSolved] = useState(""); 
  const [uniqueOffering, setUniqueOffering] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<CampaignPlatform | "">("");
  
  const handleSave = () => {
    console.log("Saving form data:", {
      brandName,
      industry,
      offering,
      sellingPoints,
      problemSolved,
      uniqueOffering,
      adPlatform: selectedPlatform
    });
    // Here you would typically save the data to a database
  };
  
  // Handle platform selection change
  const handlePlatformChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedPlatform("");
    } else {
      setSelectedPlatform(value as CampaignPlatform);
    }
  };
  
  return <QuadrantLayout>
      {{
      q4: <div className="w-full">
            <p className="text-lg mb-4">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
            <p className="text-lg mb-4">
              Let's get a demo campaign set up. It'll only take a few minutes.
            </p>
            
            <div className="mt-8">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg">
                      <div>What's your brand name?</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={brandName}
                          onChange={e => setBrandName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Button onClick={handleSave}>Save</Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg">
                      <div>Ad Platform</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-full">
                          <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
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
                      </div>
                    </td>
                  </tr>
                  <FormField label="What industry are you in?" value={industry} onChange={e => setIndustry(e.target.value)} />
                  <FormField label="Name one of your offerings" helperText="We can add more later" helperTextClassName="text-sm text-gray-500 mt-1" value={offering} onChange={e => setOffering(e.target.value)} />
                  <RecordingField label="Key Selling Points" helperText="Main reasons why customers buy this offering" value={sellingPoints} onChange={setSellingPoints} placeholder="Speak for at least 30 seconds" />
                  <RecordingField label="Problem Solved" helperText="How does this offering help your customers?" value={problemSolved} onChange={setProblemSolved} placeholder="Speak for at least 30 seconds" />
                  <RecordingField label="Unique Advantages" helperText="How is this offering better than alternatives?" value={uniqueOffering} onChange={setUniqueOffering} placeholder="Speak for at least 30 seconds" />
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg"></td>
                    <td className="py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
    }}
    </QuadrantLayout>;
};
export default IntakeForm;
