
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import MultiSelect from "./MultiSelect";
import TableRow from "./TableRow";
import { useSummaryTableData } from "./useSummaryTableData";

const SummaryTable: React.FC = () => {
  const {
    selectedOrgId,
    selectedOfferingIds,
    setSelectedOfferingIds,
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    organizations,
    offeringOptions,
    personaOptions,
    messageOptions,
    handleOrgChange
  } = useSummaryTableData();

  return (
    <div className="my-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <table className="w-full border-collapse">
        <tbody>
          <TableRow label="Organization">
            <Select value={selectedOrgId} onValueChange={handleOrgChange}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                {organizations.map((org) => (
                  <SelectItem 
                    key={org.organization_id}
                    value={org.organization_id}
                  >
                    {org.organization_name}
                  </SelectItem>
                ))}
                <SelectSeparator className="my-1" />
                <SelectItem value="clear-selection" className="text-gray-500">
                  Clear
                </SelectItem>
              </SelectContent>
            </Select>
          </TableRow>
          
          <TableRow label="Offering">
            <MultiSelect
              options={offeringOptions}
              value={selectedOfferingIds}
              onChange={setSelectedOfferingIds}
              placeholder=""
              disabled={!selectedOrgId}
            />
          </TableRow>
          
          <TableRow label="Persona">
            <MultiSelect
              options={personaOptions}
              value={selectedPersonaIds}
              onChange={setSelectedPersonaIds}
              placeholder=""
              disabled={selectedOfferingIds.length === 0}
            />
          </TableRow>
          
          <TableRow label="Message">
            <MultiSelect
              options={messageOptions}
              value={selectedMessageIds}
              onChange={setSelectedMessageIds}
              placeholder=""
              disabled={selectedPersonaIds.length === 0}
            />
          </TableRow>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
