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
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>("");
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

  // Query personas based on selected offering
  const { data: personas = [] } = useQuery({
    queryKey: ["personas", selectedOfferingId],
    queryFn: async () => {
      if (!selectedOfferingId) return [];
      
      const { data, error } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name")
        .eq("offering_id", selectedOfferingId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedOfferingId, // Only run query if offering is selected
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
    enabled: !!selectedPersonaId, // Only run query if persona is selected
  });

  // Reset offerings selection when organization changes
  useEffect(() => {
    setSelectedOfferingId("");
  }, [selectedOrgId]);

  // Reset persona selection when offerings change
  useEffect(() => {
    setSelectedPersonaId("");
  }, [selectedOfferingId]);

  // Reset message selection when personas change
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

  // Handle offering selection change
  const handleOfferingChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedOfferingId("");
    } else {
      setSelectedOfferingId(value);
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
                          <SelectValue placeholder="Select organization" />
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
                      <Select 
                        value={selectedOfferingId} 
                        onValueChange={handleOfferingChange}
                        disabled={!selectedOrgId}
                      >
                        <SelectTrigger className="w-auto min-w-[180px] max-w-full bg-white">
                          <SelectValue placeholder="Select offering" />
                        </SelectTrigger>
                        <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                          {offerings.map((offering) => (
                            <SelectItem 
                              key={offering.offering_id}
                              value={offering.offering_id}
                            >
                              {offering.offering_name}
                            </SelectItem>
                          ))}
                          {offerings.length > 0 && (
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
                  <td className="border border-transparent p-4 whitespace-nowrap font-medium" style={{ width: "1px" }}>
                    Persona
                  </td>
                  <td className="border border-transparent p-4">
                    <div className="inline-block w-auto">
                      <Select 
                        value={selectedPersonaId} 
                        onValueChange={handlePersonaChange}
                        disabled={!selectedOfferingId}
                      >
                        <SelectTrigger className="w-auto min-w-[180px] max-w-full bg-white">
                          <SelectValue placeholder="Select persona" />
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
                  <td className="border border-transparent p-4 whitespace-nowrap font-medium" style={{ width: "1px" }}>
                    Message
                  </td>
                  <td className="border border-transparent p-4">
                    <div className="inline-block w-auto">
                      <Select 
                        value={selectedMessageId} 
                        onValueChange={handleMessageChange}
                        disabled={!selectedPersonaId}
                      >
                        <SelectTrigger className="w-auto min-w-[180px] max-w-full bg-white">
                          <SelectValue placeholder="Select message" />
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
