
import React from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import CollapsibleSection from "./CollapsibleSection";
import OrganizationSelect from "./SummaryTable/components/OrganizationSelect";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";

interface OrganizationSectionProps {
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  handleSave: () => void;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  brandName,
  setBrandName,
  industry,
  setIndustry,
  businessDescription,
  setBusinessDescription,
  handleSave
}) => {
  // Get organization dropdown data and functionality
  const {
    selectedOrgId,
    organizations,
    handleOrgChange
  } = useSummaryTableData();
  
  // Extended handler for organization changes
  const handleOrganizationChange = (value: string) => {
    // Just use the normal handler without showing the toast
    handleOrgChange(value);
  };
  
  // Check if an organization is selected (either an existing one or "new-organization")
  const isOrgSelected = !!selectedOrgId || selectedOrgId === "new-organization";
  
  // Log to verify the selectedOrgId value
  console.log("Selected Organization ID:", selectedOrgId);
  
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
                <RecordingField 
                  label="Tell me about your business" 
                  value={businessDescription} 
                  onChange={setBusinessDescription} 
                  placeholder="Speak for at least 30 seconds" 
                />
              </>
            )}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>;
};

export default OrganizationSection;
