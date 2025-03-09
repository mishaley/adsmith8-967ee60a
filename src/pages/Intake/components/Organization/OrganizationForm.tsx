
import React, { useRef, useEffect } from "react";
import RecordingField from "../RecordingField";
import OrganizationSelect from "../SummaryTable/components/OrganizationSelect";
import { logDebug } from "@/utils/logging";

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
  const brandNameRef = useRef<HTMLTextAreaElement>(null);
  const previousOrgIdRef = useRef<string | null>(null);
  
  // Track organization changes
  useEffect(() => {
    if (previousOrgIdRef.current !== selectedOrgId) {
      logDebug(`Organization changed from ${previousOrgIdRef.current} to ${selectedOrgId}`);
      previousOrgIdRef.current = selectedOrgId;
    }
  }, [selectedOrgId]);
  
  // Auto-focus the brand name field when "new-organization" is selected
  useEffect(() => {
    if (selectedOrgId === "new-organization" && brandNameRef.current) {
      // Small delay to ensure the field is rendered and visible
      const timeoutId = setTimeout(() => {
        brandNameRef.current?.focus();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedOrgId]);

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
              <RecordingField 
                ref={brandNameRef}
                label="What's your brand name?" 
                value={brandName} 
                onChange={setBrandName} 
                placeholder="" 
                disabled={isReadOnly || isUpdating || isLoadingOrgData} 
                autoFocus={selectedOrgId === "new-organization"}
              />
              <RecordingField 
                label="What industry are you in?" 
                value={industry || ""} 
                onChange={handleIndustryChange} 
                placeholder="" 
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
