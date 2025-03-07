
import { useState } from "react";
import { useCreateMutation } from "@/components/table/mutations/useCreateMutation";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

// Define the type for organization data returned from the API
type OrganizationRecord = Database["public"]["Tables"]["a1organizations"]["Row"];

export const useOrganizationCreation = (
  brandName: string,
  industry: string,
  handleOrgChange: (value: string) => void,
  handleSave: () => void
) => {
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  
  // Import the create mutation for organizations
  const createOrgMutation = useCreateMutation('a1organizations');

  // Function to create a new organization
  const createNewOrganization = async () => {
    // Validation
    if (!brandName.trim()) {
      toast({
        title: "Brand name required",
        description: "Please enter a brand name for your organization",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingOrg(true);
      
      // Create organization record with proper type assertion
      const result = await createOrgMutation.mutateAsync({
        organization_name: brandName.trim(),
        organization_industry: industry.trim() || null
      });
      
      // Cast the result to the OrganizationRecord type
      const newOrg = result as OrganizationRecord;
      
      console.log("useOrganizationCreation - Created new organization:", newOrg);
      
      // Check if organization_id exists before using it
      if (newOrg && newOrg.organization_id) {
        handleOrgChange(newOrg.organization_id);
        
        toast({
          title: "Organization created",
          description: `"${brandName}" has been created successfully.`
        });
        
        // Continue with the normal save flow
        handleSave();
      }
    } catch (error) {
      console.error("useOrganizationCreation - Error creating organization:", error);
      toast({
        title: "Failed to create organization",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrg(false);
    }
  };

  // Handle the save button click
  const handleSaveClick = (selectedOrgId: string) => {
    if (selectedOrgId === "new-organization") {
      createNewOrganization();
    } else {
      // For existing organizations, just call the normal save handler
      handleSave();
    }
  };

  return {
    isCreatingOrg,
    handleSaveClick
  };
};
