
import { useState } from "react";
import { SortConfig } from "@/types/table";
import { TableHeader } from "./TableHeader";
import { InputRow } from "./InputRow";

interface TableActionsProps {
  columns: any[];
  newRecord: any;
  handleInputChange: (field: string, value: any) => void;
  handleAdd: () => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  handleSort: (field: string, direction: "asc" | "desc") => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function TableActions({
  columns,
  newRecord,
  handleInputChange,
  handleAdd,
  activeFilter,
  setActiveFilter,
  handleSort,
  searchInputRef
}: TableActionsProps) {
  return (
    <>
      <InputRow
        columns={columns}
        newRecord={newRecord}
        handleInputChange={handleInputChange}
        handleAdd={handleAdd}
      />
      <TableHeader
        columns={columns}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        handleSort={handleSort}
        searchInputRef={searchInputRef}
      />
    </>
  );
}
