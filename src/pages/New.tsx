
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

const STORAGE_KEY = "selectedOrganizationId";
const DEFAULT_ORG_ID = "cc1a6523-c628-4863-89f2-0ff5c979d4ec";

const New = () => {
  // Initialize with the stored organization ID from localStorage (same as OrganizationSelector)
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID
  );
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");

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

  // Get offering names map for display
  const offeringsMap = offerings.reduce((acc, offering) => {
    acc[offering.offering_id] = offering.offering_name;
    return acc;
  }, {} as Record<string, string>);

  // Query personas based on selected offerings
  // Now uses "in" filter to find personas from any of the selected offerings
  const { data: personas = [] } = useQuery({
    queryKey: ["personas", selectedOfferingIds],
    queryFn: async () => {
      if (!selectedOfferingIds.length) return [];
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name, offering_id")
        .in("offering_id", selectedOfferingIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedOfferingIds.length > 0, // Only run query if offerings are selected
  });

  // Query messages based on selected persona
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedPersonaId],
    queryFn: async () => {
      if (!selectedPersonaId) return [];
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("message_id, message_name")
        .eq("persona_id", selectedPersonaId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedPersonaId, // Only run query if a persona is selected
  });

  // Reset offerings selection when organization changes
  useEffect(() => {
    setSelectedOfferingIds([]);
  }, [selectedOrgId]);

  // Reset persona selection when offerings change
  useEffect(() => {
    setSelectedPersonaId("");
  }, [selectedOfferingIds]);

  // Reset message selection when persona changes
  useEffect(() => {
    setSelectedMessageId("");
  }, [selectedPersonaId]);

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

  // Handle offering selection changes - now adds/removes from array
  const handleOfferingChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedOfferingIds([]);
    } else {
      // Check if the value is already selected
      if (selectedOfferingIds.includes(value)) {
        // If already selected, remove it
        setSelectedOfferingIds(selectedOfferingIds.filter(id => id !== value));
      } else {
        // If not already selected, add it
        setSelectedOfferingIds([...selectedOfferingIds, value]);
      }
    }
  };

  // Handle persona selection change
  const handlePersonaChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedPersonaId("");
    } else {
      setSelectedPersonaId(value);
    }
  };

  // Handle message selection change
  const handleMessageChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedMessageId("");
    } else {
      setSelectedMessageId(value);
    }
  };

  // Create display text for selected offerings
  const getSelectedOfferingsText = () => {
    if (selectedOfferingIds.length === 0) return "";
    return selectedOfferingIds.map(id => offeringsMap[id]).join(", ");
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="max-w-3xl">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-transparent p-4 whitespace-nowrap" style={{ width: "1%", minWidth: "fit-content" }}>
                    <span className="font-medium">Organization</span>
                  </td>
                  <td className="border border-transparent p-4" style={{ width: "99%" }}>
                    <div className="relative inline-block w-auto">
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
                  <td className="border border-transparent p-4 whitespace-nowrap" style={{ width: "1%", minWidth: "fit-content" }}>
                    <span className="font-medium">Offering</span>
                  </td>
                  <td className="border border-transparent p-4" style={{ width: "99%" }}>
                    <div className="relative inline-block w-auto">
                      {/* The multi-select offering dropdown */}
                      <div className="flex flex-col space-y-1">
                        <div className="relative w-full">
                          <button
                            type="button"
                            className={`flex h-9 w-full items-center justify-between rounded px-3 py-2 text-sm ${
                              !selectedOrgId ? "opacity-50 cursor-not-allowed" : ""
                            } bg-white`}
                            disabled={!selectedOrgId}
                            onClick={(e) => {
                              const dropdown = e.currentTarget.nextElementSibling;
                              if (dropdown) {
                                dropdown.classList.toggle("hidden");
                              }
                            }}
                          >
                            <span className="truncate">
                              {getSelectedOfferingsText()}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 opacity-50"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                          <div className="absolute z-50 hidden w-auto min-w-full rounded-md border border-gray-200 bg-white shadow-md mt-1">
                            <div className="max-h-[300px] overflow-auto p-1">
                              {offerings.map((offering) => (
                                <div
                                  key={offering.offering_id}
                                  className={`flex items-center space-x-2 rounded px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                    selectedOfferingIds.includes(offering.offering_id) ? "bg-gray-100" : "bg-white"
                                  }`}
                                  onClick={() => handleOfferingChange(offering.offering_id)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedOfferingIds.includes(offering.offering_id)}
                                    onChange={() => {}}
                                    className="h-4 w-4"
                                  />
                                  <span>{offering.offering_name}</span>
                                </div>
                              ))}
                              {offerings.length > 0 && (
                                <>
                                  <div className="my-1 h-px bg-gray-200" />
                                  <div
                                    className="rounded px-2 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleOfferingChange("clear-selection")}
                                  >
                                    Clear
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-transparent p-4 whitespace-nowrap" style={{ width: "1%", minWidth: "fit-content" }}>
                    <span className="font-medium">Persona</span>
                  </td>
                  <td className="border border-transparent p-4" style={{ width: "99%" }}>
                    <div className="relative inline-block w-auto">
                      <Select 
                        value={selectedPersonaId} 
                        onValueChange={handlePersonaChange}
                        disabled={selectedOfferingIds.length === 0}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                          {personas.map((persona) => (
                            <SelectItem 
                              key={persona.persona_id} 
                              value={persona.persona_id}
                            >
                              {persona.persona_name}
                            </SelectItem>
                          ))}
                          {personas.length > 0 && (
                            <>
                              <SelectSeparator className="my-1" />
                              <SelectItem value="clear-selection" className="text-gray-500">
                                Clear
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-transparent p-4 whitespace-nowrap" style={{ width: "1%", minWidth: "fit-content" }}>
                    <span className="font-medium">Message</span>
                  </td>
                  <td className="border border-transparent p-4" style={{ width: "99%" }}>
                    <div className="relative inline-block w-auto">
                      <Select 
                        value={selectedMessageId} 
                        onValueChange={handleMessageChange}
                        disabled={!selectedPersonaId}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                          {messages.map((message) => (
                            <SelectItem 
                              key={message.message_id} 
                              value={message.message_id}
                            >
                              {message.message_name}
                            </SelectItem>
                          ))}
                          {messages.length > 0 && (
                            <>
                              <SelectSeparator className="my-1" />
                              <SelectItem value="clear-selection" className="text-gray-500">
                                Clear
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
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
