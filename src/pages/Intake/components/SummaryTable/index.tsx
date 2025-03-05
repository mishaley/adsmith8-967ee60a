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
  return;
};
export default SummaryTable;