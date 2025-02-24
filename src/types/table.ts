
export type InputMode = "text" | "select" | "textarea";

export interface ColumnDef {
  field: string;
  header: string;
  inputMode: InputMode;
  editable: boolean;
  required: boolean;
  format?: string;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}
