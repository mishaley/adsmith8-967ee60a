
import React, { useState } from "react";
import CollapsibleSection from "../CollapsibleSection";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";

// Campaign bid strategy options from the New page
const BID_STRATEGY_OPTIONS = ["Highest Volume", "Cost Per Result", "Return On Ad Spend"] as const;
type CampaignBidStrategy = typeof BID_STRATEGY_OPTIONS[number];

const ParametersSection: React.FC = () => {
  const [dailyBudget, setDailyBudget] = useState<string>("");
  const [selectedBidStrategy, setSelectedBidStrategy] = useState<CampaignBidStrategy | "">("");
  
  // Handle daily budget change
  const handleDailyBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyBudget(e.target.value);
  };
  
  // Handle bid strategy selection change
  const handleBidStrategyChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedBidStrategy("");
    } else {
      setSelectedBidStrategy(value as CampaignBidStrategy);
    }
  };

  return (
    <CollapsibleSection title="PARAMETERS">
      <div className="p-4 bg-transparent rounded-md space-y-6">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-transparent p-4 whitespace-nowrap font-medium">
                Daily Budget
              </td>
              <td className="border border-transparent p-4">
                <div className="inline-block min-w-[180px]">
                  <div className="relative w-full">
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
            </tr>
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
};

export default ParametersSection;
