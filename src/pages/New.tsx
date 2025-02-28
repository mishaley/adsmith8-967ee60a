
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
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "selectedOrganizationId";
const DEFAULT_ORG_ID = "cc1a6523-c628-4863-89f2-0ff5c979d4ec";

// Campaign platform options from Supabase enum
const PLATFORM_OPTIONS = ["Google", "Meta"] as const;
type CampaignPlatform = typeof PLATFORM_OPTIONS[number];

// Campaign bid strategy options from Supabase enum
const BID_STRATEGY_OPTIONS = ["Highest Volume", "Cost Per Result", "Return On Ad Spend"] as const;
type CampaignBidStrategy = typeof BID_STRATEGY_OPTIONS[number];

// Multi-select component
const MultiSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "", 
  disabled = false 
}: { 
  options: { value: string; label: string }[]; 
  value: string[]; 
  onChange: (value: string[]) => void; 
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  
  const handleValueChange = (itemValue: string) => {
    const newValue = [...value];
    const index = newValue.indexOf(itemValue);
    
    if (index === -1) {
      newValue.push(itemValue);
    } else {
      newValue.splice(index, 1);
    }
    
    onChange(newValue);
  };
  
  const displayValue = () => {
    if (value.length === 0) return "";
    if (value.length === 1) {
      const selectedOption = options.find(option => option.value === value[0]);
      return selectedOption ? selectedOption.label : "";
    }
    return `${value.length} selected`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={`flex h-9 w-full bg-white items-center justify-between px-3 text-sm border border-gray-300 rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="truncate">{displayValue()}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-visible bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-1">
            {options.length === 0 ? (
              <div className="py-2 px-3 text-gray-400 italic">No options available</div>
            ) : (
              options.map(option => (
                <div 
                  key={option.value} 
                  className="relative flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleValueChange(option.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleValueChange(option.value);
                    }
                  }}
                >
                  <Checkbox 
                    id={`option-${option.value}`}
                    checked={value.includes(option.value)} 
                    className="mr-2"
                    onCheckedChange={() => {}}
                    onClick={(e) => e.stopPropagation()} // Prevent checkbox from triggering its own click event
                  />
                  <label 
                    htmlFor={`option-${option.value}`}
                    className="flex-grow cursor-pointer"
                    onClick={(e) => e.preventDefault()} // Prevent label click from triggering its own event
                  >
                    {option.label}
                  </label>
                </div>
              ))
            )}
            
            {value.length > 0 && (
              <>
                <div className="mx-1 my-1 h-px bg-gray-200" />
                <div 
                  className="px-2 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onChange([])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onChange([]);
                    }
                  }}
                >
                  Clear
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {open && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)} 
        />
      )}
    </div>
  );
};

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

  // Format options for the multi-select component
  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  const messageOptions = messages.map(message => ({
    value: message.message_id,
    label: message.message_name
  }));

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
        ),
      }}
    </QuadrantLayout>
  );
};

export default New;
