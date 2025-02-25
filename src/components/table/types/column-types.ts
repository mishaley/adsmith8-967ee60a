
import { ColumnDef, TableRow, TableName } from "@/types/table";
import { RefObject } from "react";

export interface TableColumnProps {
  column: ColumnDef;
  data: TableRow[];
  newRecord: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSort: (field: string) => void;
  handleFilter: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  filters: Record<string, string>;
  searchInputRef: RefObject<HTMLInputElement>;
  tableName: TableName;
  idField: string;
}

export interface EditingCell {
  rowId: string | null;
  field: string | null;
}
