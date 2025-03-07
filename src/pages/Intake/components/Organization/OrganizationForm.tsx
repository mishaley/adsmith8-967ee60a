
import React from "react";
import FormField from "../FormField";
import RecordingField from "../RecordingField";
import OrganizationSelect from "../SummaryTable/components/OrganizationSelect";

interface OrganizationFormProps {
  selectedOrgId: string;
  organizations: Array<{
    organization_id: string;
    organization_name: string;
  }>;
  handleOrganizationChange: (value: string) => void;
  brandName: string;
  setBrandName: (value: string) => void;
  industry: string;
  handleIndustryChange: (value: string) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
  isLoadingOrgData: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  selectedOrgId,
  organizations,
  handleOrganizationChange,
  brandName,
  setBrandName,
  industry,
  handleIndustryChange,
  isReadOnly,
  isUpdating,
  isLoadingOrgData
}) => {
  return (
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
          
          {selectedOrgId && (
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
                onChange={handleIndustryChange} 
                placeholder="Hold to speak about your industry" 
                disabled={isUpdating || isLoadingOrgData} 
              />
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationForm;
