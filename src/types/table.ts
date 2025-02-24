
export type InputMode = 
  | "text"
  | "textarea"
  | "dropdown"
  | "upload"
  | "integer"
  | "image";

export type TableName = 
  | "a1organizations"
  | "b1offerings"
  | "c1personas"
  | "d1messages"
  | "e1images"
  | "e2captions";

export interface ColumnDefinition {
  field: string;
  header: string;
  inputMode: InputMode;
  editable: boolean;
  required: boolean;
  format?: string;
}

export interface TableData {
  id: string;
  [key: string]: any;
}
