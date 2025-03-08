
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DropdownOption } from "@/components/ui/enhanced-dropdown";
import { PLATFORM_OPTIONS, BID_STRATEGY_OPTIONS } from "../constants";

export const useCampaignSettings = (selectedOrgId: string) => {
  // Platform state
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  
  // Daily budget state
  const [dailyBudget, setDailyBudget] = useState<string>("");
  
  // Bid strategy state
  const [selectedBidStrategy, setSelectedBidStrategy] = useState<string>("");
  
  // New state for Locations and Language
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  
  // Multi-select state (arrays instead of single string values)
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // Fetch organizations
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

  // Handle platform selection change
  const handlePlatformChange = (value: string) => {
    if (value === "clear-selection") {
      setSelectedPlatform("");
    } else {
      setSelectedPlatform(value);
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
      setSelectedBidStrategy(value);
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

  return {
    organizations,
    selectedPlatform,
    dailyBudget,
    selectedBidStrategy,
    selectedLocation,
    selectedLanguage,
    selectedOfferingIds,
    selectedPersonaIds,
    selectedMessageIds,
    setSelectedOfferingIds,
    setSelectedPersonaIds,
    setSelectedMessageIds,
    handlePlatformChange,
    handleDailyBudgetChange,
    handleBidStrategyChange,
    handleLocationChange,
    handleLanguageChange,
    offeringOptions,
    personaOptions,
    messageOptions
  };
};
