
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
    // Just use the normal handler without showing the toast
    handleOrgChange(value);
  };
  
  // Auto-fill fields when organization data is loaded
  useEffect(() => {
    if (currentOrganization) {
      console.log("Filling form with organization data:", currentOrganization);
      
      // Set brand name from organization data
      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
        console.log("Setting brand name to:", currentOrganization.organization_name);
      }
      
      // If organization has industry data, set it
      if (currentOrganization.organization_industry) {
        setIndustry(currentOrganization.organization_industry);
        console.log("Setting industry to:", currentOrganization.organization_industry);
      }
    } else if (selectedOrgId === "new-organization") {
      // Clear fields when "new-organization" is selected
      setBrandName("");
      setIndustry("");
      console.log("Clearing form fields for new organization");
    }
  }, [currentOrganization, selectedOrgId, setBrandName, setIndustry]);
  
  // Check if an organization is selected (either an existing one or "new-organization")
  const isOrgSelected = !!selectedOrgId || selectedOrgId === "new-organization";
  
  // Log to verify the selectedOrgId value and organization data
  console.log("Selected Organization ID:", selectedOrgId);
  console.log("Current Organization Data:", currentOrganization);
  
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
                  <td className="py-4 pr-4 text-lg">
                    <div>What's your brand name?</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-96">
                        <input 
                          type="text" 
                          value={brandName} 
                          onChange={e => setBrandName(e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
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
