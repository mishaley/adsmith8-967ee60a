
import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database['public']['Tables'];
type Tables = Database['public']['Tables'];

export type TableField<T> = keyof T;

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

export type DbRecord<T extends TableName> = Tables[T]['Row'];
export type DbInsert<T extends TableName> = Tables[T]['Insert'];
export type DbUpdate<T extends TableName> = Tables[T]['Update'];

export function asTableField<T extends TableName>(field: string): keyof DbRecord<T> {
  return field as keyof DbRecord<T>;
}

export function asDbRecord<T extends TableName>(data: any): DbRecord<T> {
  return data as DbRecord<T>;
}
