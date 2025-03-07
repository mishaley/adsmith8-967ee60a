import React, { useEffect, useState } from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import CollapsibleSection from "./CollapsibleSection";
import OrganizationSelect from "./SummaryTable/components/OrganizationSelect";
import { useSummaryTableData } from "./SummaryTable/useSummaryTableData";
import { toast } from "@/components/ui/use-toast";
import { useOrganizationIndustrySync } from "../hooks/useOrganizationIndustrySync";
import { Button } from "@/components/ui/button";

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
  const [isLoadingOrgData, setIsLoadingOrgData] = useState(false);

  const {
    selectedOrgId,
    organizations,
    handleOrgChange,
    currentOrganization
  } = useSummaryTableData();

  const {
    isUpdating
  } = useOrganizationIndustrySync(selectedOrgId, industry, setIndustry);

  const handleOrganizationChange = (value: string) => {
    console.log("OrganizationSection - Organization change detected:", value);
    setIsLoadingOrgData(true);
    handleOrgChange(value);
  };

  useEffect(() => {
    if (currentOrganization) {
      console.log("OrganizationSection - Filling form with organization data:", currentOrganization);

      if (currentOrganization.organization_name) {
        setBrandName(currentOrganization.organization_name);
        console.log("OrganizationSection - Setting brand name to:", currentOrganization.organization_name);
      }

      if (currentOrganization.organization_industry) {
        setIndustry(currentOrganization.organization_industry);
        console.log("OrganizationSection - Setting industry to:", currentOrganization.organization_industry);
      }

      setIsLoadingOrgData(false);
    } else if (selectedOrgId === "new-organization") {
      setBrandName("");
      setIndustry("");
      console.log("OrganizationSection - Clearing form fields for new organization");
      setIsLoadingOrgData(false);
    }
  }, [currentOrganization, selectedOrgId, setBrandName, setIndustry]);

  useEffect(() => {
    const handleExternalOrgChange = (event: CustomEvent) => {
      const newOrgId = event.detail.organizationId;
      console.log("OrganizationSection - Detected external organization change:", newOrgId);

      if (newOrgId !== selectedOrgId) {
        setIsLoadingOrgData(true);
        handleOrgChange(newOrgId);
      }
    };

    window.addEventListener('organizationChanged', handleExternalOrgChange as EventListener);

    return () => {
      window.removeEventListener('organizationChanged', handleExternalOrgChange as EventListener);
    };
  }, [selectedOrgId, handleOrgChange]);

  const isOrgSelected = !!selectedOrgId || selectedOrgId === "new-organization";

  const isReadOnly = !!selectedOrgId && selectedOrgId !== "new-organization";

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
  };

  return <CollapsibleSection title="ORGANIZATION">
      <div className="flex justify-center">
        <table className="border-collapse border-transparent">
          <tbody>
            <tr className="border-transparent">
              <td colSpan={2} className="py-4 text-center">
                <div className="w-72 mx-auto">
                  <OrganizationSelect selectedOrgId={selectedOrgId} organizations={organizations} onValueChange={handleOrganizationChange} />
                </div>
              </td>
            </tr>
            
            {isOrgSelected && <>
                <tr className="border-transparent">
                  <td className="py-4 pr-4 text-lg whitespace-nowrap min-w-[180px]">
                    <div>What's your brand name?</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-96">
                        <input type="text" value={brandName} onChange={e => {
                      if (!isReadOnly) {
                        setBrandName(e.target.value);
                      }
                    }} readOnly={isReadOnly} className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${isReadOnly ? 'bg-gray-100' : ''}`} />
                      </div>
                    </div>
                  </td>
                </tr>
                <RecordingField label="What industry are you in?" value={industry} onChange={handleIndustryChange} placeholder="Hold to speak about your industry" disabled={isUpdating || isLoadingOrgData} />
              </>}
          </tbody>
        </table>
      </div>
      
      {isOrgSelected && <div className="flex justify-center mt-6 mb-3">
          <Button onClick={handleSave} className="w-20">NEXT</Button>
        </div>}
    </CollapsibleSection>;
};

export default OrganizationSection;
