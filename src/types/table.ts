
export type TableName = "a1organizations" | "b1offerings" | "c1personas" | "d1messages" | "e1images" | "e2captions";

export type InputMode = "text" | "select" | "textarea";

export interface SelectOption {
  value: string;
  label: string;
}

export interface ColumnDef {
  field: string;
  header: string;
  inputMode: InputMode;
  editable: boolean;
  required: boolean;
  format?: string;
  options?: SelectOption[];
  displayField?: string;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface TableData {
  [key: string]: any;
}
