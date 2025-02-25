
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

// Utility types for table operations
export type TableField<T extends TableName> = keyof Database['public']['Tables'][T]['Row'];
export type TableRecord<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
