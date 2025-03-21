
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

// Use a different storage key to make this independent
const STORAGE_KEY = "q1_selectedOrganizationId";
const DEFAULT_ORG_ID = "cc1a6523-c628-4863-89f2-0ff5c979d4ec";

export const OrganizationSelector = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || DEFAULT_ORG_ID
  );

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name, organization_wordmark");
      if (error) throw error;
      return data || [];
    },
  });

  const selectedOrg = organizations.find(
    (org) => org.organization_id === selectedOrgId
  );

  // Update localStorage when organization changes
  const handleOrgChange = (orgId: string) => {
    console.log("Organization changed in Q1 selector to:", orgId);
    setSelectedOrgId(orgId);
    localStorage.setItem(STORAGE_KEY, orgId);
    // No longer dispatch events to sync with other components
  };

  // Listen for the clearForm event
  useEffect(() => {
    const handleClearForm = () => {
      console.log("Clear form event detected in Q1 selector");
      setSelectedOrgId(DEFAULT_ORG_ID);
      localStorage.setItem(STORAGE_KEY, DEFAULT_ORG_ID);
    };
    
    window.addEventListener('clearForm', handleClearForm);
    return () => {
      window.removeEventListener('clearForm', handleClearForm);
    };
  }, []);

  useEffect(() => {
    // Debug logging
    console.log("OrganizationSelector (Q1) - Current org:", selectedOrg?.organization_name);
  }, [selectedOrg]);

  return (
    <div className="relative h-full w-full group">
      <div className="absolute inset-0 flex items-center justify-center">
        {selectedOrg?.organization_wordmark ? (
          <img
            src={supabase.storage
              .from("adsmith_assets")
              .getPublicUrl(selectedOrg.organization_wordmark).data.publicUrl}
            alt={`${selectedOrg.organization_name} wordmark`}
            className="max-h-full max-w-full w-auto h-auto object-contain p-4"
          />
        ) : (
          <div className="text-center">
            <h1 className="font-lora text-white text-2xl font-semibold">
              {selectedOrg?.organization_name}
            </h1>
          </div>
        )}
      </div>
      <Select value={selectedOrgId} onValueChange={handleOrgChange}>
        <SelectTrigger className="absolute bottom-0 left-0 w-[170px] bg-[#2A2A2A] text-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent 
          className="bg-white border-none min-w-[170px]"
          align="start"
          side="bottom"
          alignOffset={0}
          sideOffset={0}
        >
          {organizations.map((org) => (
            <SelectItem
              key={org.organization_id}
              value={org.organization_id}
              className="pl-8 pr-3 py-2 text-[#555555] hover:text-[#ecb652] hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] focus:text-[#ecb652]"
            >
              {org.organization_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
