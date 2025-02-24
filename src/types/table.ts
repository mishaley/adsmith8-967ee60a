
export type InputMode = 
  | "text"
  | "textarea"
  | "dropdown"
  | "upload"
  | "integer"
  | "image";

export interface ColumnDefinition {
  field: string;
  header: string;
  inputMode: InputMode;
  editable: boolean;
  required: boolean;
  format?: string;
  displayField?: string;
  options?: string[] | { value: string; label: string }[];
  foreignTable?: string;
  foreignField?: string;
  foreignDisplayField?: string;
}

export interface TableData {
  id: string;
  [key: string]: any;
}
