
import React, { useEffect } from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import CollapsibleSection from "./CollapsibleSection";
import OrganizationSelect from "./SummaryTable/components/OrganizationSelect";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";
import { toast } from "@/components/ui/use-toast";

interface OrganizationSectionProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  handleSave: () => void;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  brandName,
  setBrandName,
  industry,
  setIndustry,
  handleSave
}) => {
  // Get organization dropdown data and functionality
  const {
    selectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization
  } = useSummaryTableData();
  
  // Extended handler for organization changes
  const handleOrganizationChange = (value: string) => {
    console.log("OrganizationSection - Organization change detected:", value);
    // Just use the normal handler without showing the toast
    handleOrgChange(value);
  };
  
  // Auto-fill fields when organization data is loaded or changes
  useEffect(() => {
    if (currentOrganization) {
      console.log("OrganizationSection - Filling form with organization data:", currentOrganization);
      
      // Set brand name from organization data
      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
        console.log("OrganizationSection - Setting brand name to:", currentOrganization.organization_name);
      }
      
      // If organization has industry data, set it
      if (currentOrganization.organization_industry) {
        setIndustry(currentOrganization.organization_industry);
        console.log("OrganizationSection - Setting industry to:", currentOrganization.organization_industry);
      }
    } else if (selectedOrgId === "new-organization") {
      // Clear fields when "new-organization" is selected
      setBrandName("");
      setIndustry("");
      console.log("OrganizationSection - Clearing form fields for new organization");
    }
  }, [currentOrganization, selectedOrgId, setBrandName, setIndustry]);
  
  // Listen for external organization changes from OrganizationSelector
  useEffect(() => {
    const handleExternalOrgChange = (event: CustomEvent) => {
      const newOrgId = event.detail.organizationId;
      console.log("OrganizationSection - Detected external organization change:", newOrgId);
      
      // Update our local organization selection
      if (newOrgId !== selectedOrgId) {
        handleOrgChange(newOrgId);
      }
    };

    // Add event listener
    window.addEventListener('organizationChanged', handleExternalOrgChange as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('organizationChanged', handleExternalOrgChange as EventListener);
    };
  }, [selectedOrgId, handleOrgChange]);
  
  // Check if an organization is selected (either an existing one or "new-organization")
  const isOrgSelected = !!selectedOrgId || selectedOrgId === "new-organization";
  
  // Determine if the input should be readonly (only new organizations can edit)
  const isReadOnly = !!selectedOrgId && selectedOrgId !== "new-organization";
  
  return <CollapsibleSection title="ORGANIZATION">
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <tr className="border-transparent">
              <td colSpan={2} className="py-4 text-center">
                <div className="w-72 mx-auto">
                  <OrganizationSelect 
                    selectedOrgId={selectedOrgId} 
                    organizations={organizations} 
                    onValueChange={handleOrganizationChange} 
                  />
                </div>
              </td>
            </tr>
            
            {isOrgSelected && (
              <>
                <tr className="border-transparent">
                  <td className="py-4 pr-4 text-lg whitespace-nowrap min-w-[180px]">
                    <div>What's your brand name?</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-96">
                        <input 
                          type="text" 
                          value={brandName} 
                          onChange={e => {
                            // Only allow changes for new organizations
                            if (!isReadOnly) {
                              setBrandName(e.target.value);
                            }
                          }} 
                          readOnly={isReadOnly}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${isReadOnly ? 'bg-gray-100' : ''}`} 
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <RecordingField 
                  label="What industry are you in?" 
                  value={industry} 
                  onChange={setIndustry} 
                  placeholder="Hold to speak about your industry" 
                />
              </>
            )}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>;
};

export default OrganizationSection;
