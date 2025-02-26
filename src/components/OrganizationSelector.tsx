
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

const STORAGE_KEY = "selectedOrganizationId";
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedOrgId);
  }, [selectedOrgId]);

  return (
    <div className="h-full w-full">
      <div className="absolute inset-[18px]">
        {selectedOrg?.organization_wordmark ? (
          <img
            src={`${
              supabase.storage
                .from("adsmith_assets")
                .getPublicUrl(selectedOrg.organization_wordmark).data.publicUrl
            }`}
            alt={`${selectedOrg.organization_name} wordmark`}
            className="max-h-full max-w-full w-auto h-auto object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <h1 className="font-lora text-white text-2xl font-semibold">
              {selectedOrg?.organization_name}
            </h1>
          </div>
        )}
      </div>
      <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
        <div className="absolute bottom-0 left-0">
          <SelectTrigger 
            className="w-[170px] bg-[#2A2A2A] text-white border-none opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
        </div>
        <SelectContent 
          className="bg-[#2A2A2A] text-white border-none"
          align="start"
          side="bottom"
          avoidCollisions={false}
          collisionPadding={0}
          sticky="always"
        >
          {organizations.map((org) => (
            <SelectItem
              key={org.organization_id}
              value={org.organization_id}
              className="text-white hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]"
            >
              {org.organization_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
