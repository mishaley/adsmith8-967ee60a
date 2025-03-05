
import React from "react";
import TableRow from "./components/TableRow";
import SingleSelectField from "./components/SingleSelectField";
import MultiSelectField from "./components/MultiSelectField";
import { useSummaryTableData } from "./useSummaryTableData";

const SummaryTable: React.FC = () => {
  const {
    selectedOfferingId,
    setSelectedOfferingId,
    selectedPersonaIds,
    setSelectedPersonaIds,
    selectedMessageIds,
    setSelectedMessageIds,
    offeringOptions,
    personaOptions,
    messageOptions,
    isOfferingsDisabled,
    isPersonasDisabled,
    isMessagesDisabled
  } = useSummaryTableData();

  console.log("SummaryTable rendering", { 
    isOfferingsDisabled, 
    isPersonasDisabled,
    isMessagesDisabled,
    offeringOptions: offeringOptions.length,
    personaOptions: personaOptions.length,
    messageOptions: messageOptions.length
  });

  return (
    <div className="my-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <table className="w-full border-collapse">
        <tbody>
          <TableRow label="Offering">
            <SingleSelectField
              options={offeringOptions}
              value={selectedOfferingId}
              onChange={setSelectedOfferingId}
              disabled={isOfferingsDisabled}
              placeholder="Select an offering"
            />
          </TableRow>
          
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
