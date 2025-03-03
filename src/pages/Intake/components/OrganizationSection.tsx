import React from "react";
import FormField from "./FormField";
import RecordingField from "./RecordingField";
import { Button } from "@/components/ui/button";
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
  return <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
      <h2 className="text-center text-gray-700 mb-2 font-bold text-xl">ORGANIZATION</h2>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="py-4 pr-4 text-lg">
              <div>What's your brand name?</div>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-96">
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                
              </div>
            </td>
          </tr>
          <FormField label="What industry are you in?" value={industry} onChange={e => setIndustry(e.target.value)} />
          <RecordingField label="Tell me about your business" value={businessDescription} onChange={setBusinessDescription} placeholder="Speak for at least 30 seconds" />
        </tbody>
      </table>
    </div>;
};
export default OrganizationSection;