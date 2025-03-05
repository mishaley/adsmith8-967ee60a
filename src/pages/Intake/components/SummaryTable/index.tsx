
import React from "react";
import TableRow from "./components/TableRow";
import MultiSelectField from "./components/MultiSelectField";
import { useSummaryTableData } from "./useSummaryTableData";

const SummaryTable: React.FC = () => {
  const {
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    personaOptions,
    messageOptions,
    isOfferingsDisabled,
    isPersonasDisabled,
    isMessagesDisabled
  } = useSummaryTableData();

  return (
    <div className="my-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <table className="w-full border-collapse">
        <tbody>
          <TableRow label="Persona">
            <MultiSelectField
              options={personaOptions}
              value={selectedPersonaIds}
              onChange={setSelectedPersonaIds}
              disabled={isPersonasDisabled}
              placeholder="Select personas"
            />
          </TableRow>
          
          <TableRow label="Message">
            <MultiSelectField
              options={messageOptions}
              value={selectedMessageIds}
              onChange={setSelectedMessageIds}
              disabled={isMessagesDisabled}
              placeholder="Select messages"
            />
          </TableRow>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
