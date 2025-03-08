import QuadrantLayout from "@/components/QuadrantLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
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

const STORAGE_KEY = "selectedOrganizationId";
const DEFAULT_ORG_ID = "cc1a6523-c628-4863-89f2-0ff5c979d4ec";

// Campaign platform options from Supabase enum
const PLATFORM_OPTIONS = ["Google", "Meta"] as const;
type CampaignPlatform = typeof PLATFORM_OPTIONS[number];

// Campaign bid strategy options from Supabase enum
const BID_STRATEGY_OPTIONS = ["Highest Volume", "Cost Per Result", "Return On Ad Spend"] as const;
type CampaignBidStrategy = typeof BID_STRATEGY_OPTIONS[number];

const New = () => {
  // Initialize with the stored organization ID from localStorage
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID
  );
  
  // Platform state
  const [selectedPlatform, setSelectedPlatform] = useState<CampaignPlatform | "">("");
  
  // Daily budget state
  const [dailyBudget, setDailyBudget] = useState<string>("");
  
  // Bid strategy state
  const [selectedBidStrategy, setSelectedBidStrategy] = useState<CampaignBidStrategy | "">("");
  
  // New state for Locations and Language
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  
  // Multi-select state (arrays instead of single string values)
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // Watch for changes to the organization in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID;
      setSelectedOrgId(newOrgId);
    };

    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Query offerings based on selected organization
  const { data: offerings = [] } = useQuery({
    queryKey: ["offerings", selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) return [];
      
      const { data, error } = await supabase
        .from("b1offerings")
        .select("offering_id, offering_name")
        .eq("organization_id", selectedOrgId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedOrgId, // Only run query if an organization is selected
  });

  // Query personas based on selected offerings
  const { data: personas = [] } = useQuery({
    queryKey: ["personas", selectedOfferingIds],
    queryFn: async () => {
      if (selectedOfferingIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name")
        .in("offering_id", selectedOfferingIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedOfferingIds.length > 0, // Only run query if offerings are selected
  });

  // Query messages based on selected personas
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedPersonaIds],
    queryFn: async () => {
      if (selectedPersonaIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("message_id, message_name")
        .in("persona_id", selectedPersonaIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedPersonaIds.length > 0, // Only run query if personas are selected
  });

  // Reset offerings selection when organization changes
  useEffect(() => {
    setSelectedOfferingIds([]);
  }, [selectedOrgId]);

  // Reset persona selection when offerings change
  useEffect(() => {
    setSelectedPersonaIds([]);
  }, [selectedOfferingIds]);

  // Reset message selection when personas change
  useEffect(() => {
    setSelectedMessageIds([]);
  }, [selectedPersonaIds]);

  // Handle organization selection change
  const handleOrgChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedOrgId("");
    } else {
      setSelectedOrgId(value);
      // When organization changes in this component, update localStorage 
      // to keep it in sync with the Q1 selector
      localStorage.setItem(STORAGE_KEY, value);
      // Dispatch storage event for other components to sync
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Handle platform selection change
  const handlePlatformChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedPlatform("");
    } else {
      setSelectedPlatform(value as CampaignPlatform);
    }
  };

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

  // Handle location selection change
  const handleLocationChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedLocation("");
    } else {
      setSelectedLocation(value);
    }
  };

  // Handle language selection change
  const handleLanguageChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedLanguage("");
    } else {
      setSelectedLanguage(value);
    }
  };

  // Format options for the EnhancedDropdown component
  const offeringOptions: DropdownOption[] = offerings.map(offering => ({
    id: offering.offering_id,
    label: offering.offering_name
  }));

  const personaOptions: DropdownOption[] = personas.map(persona => ({
    id: persona.persona_id,
    label: persona.persona_name
  }));

  const messageOptions: DropdownOption[] = messages.map(message => ({
    id: message.message_id,
    label: message.message_name
  }));

  // EnhancedDropdown handlers
  const handleOfferingChange = (selectedIds: string[]) => {
    setSelectedOfferingIds(selectedIds);
  };

  const handlePersonaChange = (selectedIds: string[]) => {
    setSelectedPersonaIds(selectedIds);
  };

  const handleMessageChange = (selectedIds: string[]) => {
    setSelectedMessageIds(selectedIds);
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
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
                        onSelectionChange={handleOfferingChange}
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
                        onSelectionChange={handlePersonaChange}
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
                        onSelectionChange={handleMessageChange}
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
        ),
      }}
    </QuadrantLayout>
  );
};

export default New;
