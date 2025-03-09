
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorageWithEvents } from "./useLocalStorageWithEvents";

export const useOrganizationData = () => {
  const STORAGE_KEY = "selectedOrganizationId";
  
  // Initialize with localStorage and event integration
  const [selectedOrgId, setSelectedOrgId] = useLocalStorageWithEvents({
    key: STORAGE_KEY,
    initialValue: "",
    eventName: "organizationChanged",
    eventDetailKey: "organizationId"
  });

  // Query organizations
  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name, organization_industry");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get the current organization
  const currentOrganization = selectedOrgId 
    ? organizations.find(org => org.organization_id === selectedOrgId) 
    : null;

  // Function to handle organization change
  const handleOrgChange = (value: string) => {
    setSelectedOrgId(value);
  };

  return {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    currentOrganization,
    handleOrgChange
  };
};
