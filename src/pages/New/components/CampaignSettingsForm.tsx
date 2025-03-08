
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
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";
import { PLATFORM_OPTIONS, BID_STRATEGY_OPTIONS } from "../constants";

interface CampaignSettingsFormProps {
  organizations: any[];
  selectedOrgId: string;
  handleOrgChange: (value: string) => void;
  offeringOptions: DropdownOption[];
  selectedOfferingIds: string[];
  setSelectedOfferingIds: (ids: string[]) => void;
  personaOptions: DropdownOption[];
  selectedPersonaIds: string[];
  setSelectedPersonaIds: (ids: string[]) => void;
  messageOptions: DropdownOption[];
  selectedMessageIds: string[];
  setSelectedMessageIds: (ids: string[]) => void;
  selectedPlatform: string;
  handlePlatformChange: (value: string) => void;
  dailyBudget: string;
  handleDailyBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedBidStrategy: string;
  handleBidStrategyChange: (value: string) => void;
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
                <EnhancedDropdown
                  options={offeringOptions}
                  selectedItems={selectedOfferingIds}
                  onSelectionChange={setSelectedOfferingIds}
                  placeholder="Select offerings"
                  searchPlaceholder="Search offerings..."
                  multiSelect={true}
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
                <EnhancedDropdown
                  options={personaOptions}
                  selectedItems={selectedPersonaIds}
                  onSelectionChange={setSelectedPersonaIds}
                  placeholder="Select personas"
                  searchPlaceholder="Search personas..."
                  multiSelect={true}
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
                <EnhancedDropdown
                  options={messageOptions}
                  selectedItems={selectedMessageIds}
                  onSelectionChange={setSelectedMessageIds}
                  placeholder="Select messages"
                  searchPlaceholder="Search messages..."
                  multiSelect={true}
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
