
import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database['public']['Tables'];

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

export type DbRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type DbInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type DbUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];
