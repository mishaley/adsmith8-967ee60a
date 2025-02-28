
import QuadrantLayout from "@/components/QuadrantLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
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
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  
  // Dropdown open states
  const [isOfferingDropdownOpen, setIsOfferingDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
  
  // Refs for dropdowns and their buttons
  const offeringDropdownRef = useRef<HTMLDivElement>(null);
  const offeringButtonRef = useRef<HTMLButtonElement>(null);
  const personaDropdownRef = useRef<HTMLDivElement>(null);
  const personaButtonRef = useRef<HTMLButtonElement>(null);
  const messageDropdownRef = useRef<HTMLDivElement>(null);
  const messageButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle clicks outside of the offerings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle offering dropdown
      if (isOfferingDropdownOpen && 
          offeringDropdownRef.current && 
          offeringButtonRef.current && 
          !offeringDropdownRef.current.contains(event.target as Node) &&
          !offeringButtonRef.current.contains(event.target as Node)) {
        setIsOfferingDropdownOpen(false);
      }
      
      // Handle persona dropdown
      if (isPersonaDropdownOpen && 
          personaDropdownRef.current && 
          personaButtonRef.current && 
          !personaDropdownRef.current.contains(event.target as Node) &&
          !personaButtonRef.current.contains(event.target as Node)) {
        setIsPersonaDropdownOpen(false);
      }
      
      // Handle message dropdown
      if (isMessageDropdownOpen && 
          messageDropdownRef.current && 
          messageButtonRef.current && 
          !messageDropdownRef.current.contains(event.target as Node) &&
          !messageButtonRef.current.contains(event.target as Node)) {
        setIsMessageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOfferingDropdownOpen, isPersonaDropdownOpen, isMessageDropdownOpen]);

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

  // Get persona names map for display
  const personasMap = personas.reduce((acc, persona) => {
    acc[persona.persona_id] = persona.persona_name;
    return acc;
  }, {} as Record<string, string>);

  // Query messages based on selected personas - now using 'in' for multiple personas
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedPersonaIds],
    queryFn: async () => {
      if (!selectedPersonaIds.length) return [];
      
      const { data, error } = await supabase
        .from("d1messages")
        .select("message_id, message_name, persona_id")
        .in("persona_id", selectedPersonaIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: selectedPersonaIds.length > 0, // Only run query if personas are selected
  });

  // Get message names map for display
  const messagesMap = messages.reduce((acc, message) => {
    acc[message.message_id] = message.message_name;
    return acc;
  }, {} as Record<string, string>);

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

  // Handle persona selection change - now adds/removes from array
  const handlePersonaChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedPersonaIds([]);
    } else {
      // Check if the value is already selected
      if (selectedPersonaIds.includes(value)) {
        // If already selected, remove it
        setSelectedPersonaIds(selectedPersonaIds.filter(id => id !== value));
      } else {
        // If not already selected, add it
        setSelectedPersonaIds([...selectedPersonaIds, value]);
      }
    }
  };

  // Handle message selection change - now adds/removes from array
  const handleMessageChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedMessageIds([]);
    } else {
      // Check if the value is already selected
      if (selectedMessageIds.includes(value)) {
        // If already selected, remove it
        setSelectedMessageIds(selectedMessageIds.filter(id => id !== value));
      } else {
        // If not already selected, add it
        setSelectedMessageIds([...selectedMessageIds, value]);
      }
    }
  };

  // Toggle dropdown functions
  const toggleOfferingDropdown = () => {
    setIsOfferingDropdownOpen(!isOfferingDropdownOpen);
  };
  
  const togglePersonaDropdown = () => {
    setIsPersonaDropdownOpen(!isPersonaDropdownOpen);
  };
  
  const toggleMessageDropdown = () => {
    setIsMessageDropdownOpen(!isMessageDropdownOpen);
  };

  // Create display text for selected items
  const getSelectedOfferingsText = () => {
    if (selectedOfferingIds.length === 0) return "";
    return selectedOfferingIds.map(id => offeringsMap[id]).join(", ");
  };
  
  const getSelectedPersonasText = () => {
    if (selectedPersonaIds.length === 0) return "";
    return selectedPersonaIds.map(id => personasMap[id]).join(", ");
  };
  
  const getSelectedMessagesText = () => {
    if (selectedMessageIds.length === 0) return "";
    return selectedMessageIds.map(id => messagesMap[id]).join(", ");
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="max-w-3xl">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-transparent p-4 whitespace-nowrap font-medium" style={{ width: "1px" }}>
                    Organization
                  </td>
                  <td className="border border-transparent p-4">
                    <div className="inline-block w-auto">
                      <Select value={selectedOrgId} onValueChange={handleOrgChange}>
                        <SelectTrigger className="w-auto min-w-[180px] max-w-full bg-white">
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
                  <td className="border border-transparent p-4 whitespace-nowrap font-medium" style={{ width: "1px" }}>
                    Offering
                  </td>
                  <td className="border border-transparent p-4">
                    <div className="inline-block w-auto">
                      {/* The multi-select offering dropdown */}
                      <div className="flex flex-col space-y-1">
                        <div className="relative w-auto min-w-[180px]">
                          <button
                            ref={offeringButtonRef}
                            type="button"
                            className={`flex h-9 w-full items-center justify-between rounded px-3 py-2 text-sm ${
                              !selectedOrgId ? "opacity-50 cursor-not-allowed" : ""
                            } bg-white`}
                            disabled={!selectedOrgId}
                            onClick={toggleOfferingDropdown}
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
                          <div 
                            ref={offeringDropdownRef}
                            className={`absolute z-50 ${isOfferingDropdownOpen ? '' : 'hidden'} w-auto min-w-[250px] rounded-md border border-gray-200 bg-white shadow-md mt-1`}
                          >
                            <div className="flex flex-col">
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
                                    <span className="whitespace-normal">{offering.offering_name}</span>
                                  </div>
                                ))}
                              </div>
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
                  <td className="border border-transparent p-4 whitespace-nowrap font-medium" style={{ width: "1px" }}>
                    Persona
                  </td>
                  <td className="border border-transparent p-4">
                    <div className="inline-block w-auto">
                      {/* The multi-select persona dropdown */}
                      <div className="flex flex-col space-y-1">
                        <div className="relative w-auto min-w-[180px]">
                          <button
                            ref={personaButtonRef}
                            type="button"
                            className={`flex h-9 w-full items-center justify-between rounded px-3 py-2 text-sm ${
                              selectedOfferingIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                            } bg-white`}
                            disabled={selectedOfferingIds.length === 0}
                            onClick={togglePersonaDropdown}
                          >
                            <span className="truncate">
                              {getSelectedPersonasText()}
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
                          <div 
                            ref={personaDropdownRef}
                            className={`absolute z-50 ${isPersonaDropdownOpen ? '' : 'hidden'} w-auto min-w-[250px] rounded-md border border-gray-200 bg-white shadow-md mt-1`}
                          >
                            <div className="flex flex-col bg-white">
                              <div className="max-h-[300px] overflow-auto p-1 bg-white">
                                {personas.map((persona) => (
                                  <div
                                    key={persona.persona_id}
                                    className={`flex items-center space-x-2 rounded px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                      selectedPersonaIds.includes(persona.persona_id) ? "bg-gray-100" : "bg-white"
                                    }`}
                                    onClick={() => handlePersonaChange(persona.persona_id)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPersonaIds.includes(persona.persona_id)}
                                      onChange={() => {}}
                                      className="h-4 w-4"
                                    />
                                    <span className="whitespace-normal">{persona.persona_name}</span>
                                  </div>
                                ))}
                              </div>
                              {personas.length > 0 && (
                                <>
                                  <div className="my-1 h-px bg-gray-200" />
                                  <div
                                    className="rounded px-2 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handlePersonaChange("clear-selection")}
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
                  <td className="border border-transparent p-4 whitespace-nowrap font-medium" style={{ width: "1px" }}>
                    Message
                  </td>
                  <td className="border border-transparent p-4">
                    <div className="inline-block w-auto">
                      {/* The multi-select message dropdown */}
                      <div className="flex flex-col space-y-1">
                        <div className="relative w-auto min-w-[180px]">
                          <button
                            ref={messageButtonRef}
                            type="button"
                            className={`flex h-9 w-full items-center justify-between rounded px-3 py-2 text-sm ${
                              selectedPersonaIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                            } bg-white`}
                            disabled={selectedPersonaIds.length === 0}
                            onClick={toggleMessageDropdown}
                          >
                            <span className="truncate">
                              {getSelectedMessagesText()}
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
                          <div 
                            ref={messageDropdownRef}
                            className={`absolute z-50 ${isMessageDropdownOpen ? '' : 'hidden'} w-auto min-w-[250px] rounded-md border border-gray-200 bg-white shadow-md mt-1`}
                          >
                            <div className="flex flex-col bg-white">
                              <div className="max-h-[300px] overflow-auto p-1 bg-white">
                                {messages.map((message) => (
                                  <div
                                    key={message.message_id}
                                    className={`flex items-center space-x-2 rounded px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                      selectedMessageIds.includes(message.message_id) ? "bg-gray-100" : "bg-white"
                                    }`}
                                    onClick={() => handleMessageChange(message.message_id)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedMessageIds.includes(message.message_id)}
                                      onChange={() => {}}
                                      className="h-4 w-4"
                                    />
                                    <span className="whitespace-normal">{message.message_name}</span>
                                  </div>
                                ))}
                              </div>
                              {messages.length > 0 && (
                                <>
                                  <div className="my-1 h-px bg-gray-200" />
                                  <div
                                    className="rounded px-2 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleMessageChange("clear-selection")}
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
              </tbody>
            </table>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default New;
