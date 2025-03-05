
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MultiSelect from "./MultiSelect";

// Campaign platform options from Supabase enum
const PLATFORM_OPTIONS = ["Google", "Meta"] as const;

// Campaign bid strategy options from Supabase enum
const BID_STRATEGY_OPTIONS = ["Highest Volume", "Cost Per Result", "Return On Ad Spend"] as const;

interface CampaignSettingsFormProps {
  // Organizations section
  organizations: any[];
  selectedOrgId: string;
  handleOrgChange: (value: string) => void;
  offeringOptions: { value: string; label: string }[];
  selectedOfferingIds: string[];
  setSelectedOfferingIds: (value: string[]) => void;
  personaOptions: { value: string; label: string }[];
  selectedPersonaIds: string[];
  setSelectedPersonaIds: (value: string[]) => void;
  messageOptions: { value: string; label: string }[];
  selectedMessageIds: string[];
  setSelectedMessageIds: (value: string[]) => void;
  
  // Campaign settings
  selectedPlatform: string;
  handlePlatformChange: (value: string) => void;
  dailyBudget: string;
  handleDailyBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedBidStrategy: string;
  handleBidStrategyChange: (value: string) => void;
  
  // Location and language
  selectedLocation: string;
  handleLocationChange: (value: string) => void;
  selectedLanguage: string;
  handleLanguageChange: (value: string) => void;
}

const CampaignSettingsForm: React.FC<CampaignSettingsFormProps> = ({
  organizations,
  selectedOrgId,
  handleOrgChange,
  offeringOptions,
  selectedOfferingIds,
  setSelectedOfferingIds,
  personaOptions,
  selectedPersonaIds,
  setSelectedPersonaIds,
  messageOptions,
  selectedMessageIds,
  setSelectedMessageIds,
  
  selectedPlatform,
  handlePlatformChange,
  dailyBudget,
  handleDailyBudgetChange,
  selectedBidStrategy,
  handleBidStrategyChange,
  
  selectedLocation,
  handleLocationChange,
  selectedLanguage,
  handleLanguageChange
}) => {
  return (
    <div className="max-w-3xl">
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Platform
            </td>
            <td className="border border-transparent p-4">
              <div className="inline-block min-w-[180px]">
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
            </td>
            <td className="border border-transparent p-4"></td>
            {/* Fourth column with Locations label */}
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Locations
            </td>
            <td className="border border-transparent p-4">
              <div className="inline-block min-w-[180px]">
                <Select value={selectedLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {/* Empty for now, will be filled later */}
                    <SelectSeparator className="my-1" />
                    <SelectItem value="clear-selection" className="text-gray-500">
                      Clear
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Organization
            </td>
            <td className="border border-transparent p-4">
              <div className="inline-block min-w-[180px]">
                <Select value={selectedOrgId} onValueChange={handleOrgChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {organizations.map((org) => (
                      <SelectItem 
                        key={org.organization_id}
                        value={org.organization_id}
                      >
                        {org.organization_name}
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
          <tr>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Daily Budget
            </td>
            <td className="border border-transparent p-4">
              <div className="relative min-w-[180px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  type="text"
                  value={dailyBudget}
                  onChange={handleDailyBudgetChange}
                  className="pl-7 bg-white w-full"
                  placeholder=""
                />
              </div>
            </td>
            <td className="border border-transparent p-4"></td>
            {/* Fourth column with Language label */}
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Language
            </td>
            <td className="border border-transparent p-4">
              <div className="inline-block min-w-[180px]">
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {/* Empty for now, will be filled later */}
                    <SelectSeparator className="my-1" />
                    <SelectItem value="clear-selection" className="text-gray-500">
                      Clear
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Offering
            </td>
            <td className="border border-transparent p-4">
              <div className="min-w-[180px]">
                <MultiSelect
                  options={offeringOptions}
                  value={selectedOfferingIds}
                  onChange={setSelectedOfferingIds}
                  placeholder=""
                  disabled={!selectedOrgId}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Bid Strategy
            </td>
            <td className="border border-transparent p-4">
              <div className="inline-block min-w-[180px]">
                <Select value={selectedBidStrategy} onValueChange={handleBidStrategyChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                    {BID_STRATEGY_OPTIONS.map((strategy) => (
                      <SelectItem 
                        key={strategy}
                        value={strategy}
                      >
                        {strategy}
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
            <td className="border border-transparent p-4"></td>
            {/* Three new columns */}
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Persona
            </td>
            <td className="border border-transparent p-4">
              <div className="min-w-[180px]">
                <MultiSelect
                  options={personaOptions}
                  value={selectedPersonaIds}
                  onChange={setSelectedPersonaIds}
                  placeholder=""
                  disabled={selectedOfferingIds.length === 0}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4"></td>
            {/* Three new columns */}
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4"></td>
            <td className="border border-transparent p-4 whitespace-nowrap font-medium">
              Message
            </td>
            <td className="border border-transparent p-4">
              <div className="min-w-[180px]">
                <MultiSelect
                  options={messageOptions}
                  value={selectedMessageIds}
                  onChange={setSelectedMessageIds}
                  placeholder=""
                  disabled={selectedPersonaIds.length === 0}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CampaignSettingsForm;
