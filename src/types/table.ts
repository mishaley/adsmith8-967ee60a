
import type { Database } from "@/integrations/supabase/types";

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
  searchField?: string; // Add this field to specify which field to search by
  width?: string;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

type TableTypes = {
  a1organizations: Database["public"]["Tables"]["a1organizations"]["Insert"];
  b1offerings: Database["public"]["Tables"]["b1offerings"]["Insert"];
  c1personas: Database["public"]["Tables"]["c1personas"]["Insert"];
  d1messages: Database["public"]["Tables"]["d1messages"]["Insert"];
  e1images: Database["public"]["Tables"]["e1images"]["Insert"];
  e2captions: Database["public"]["Tables"]["e2captions"]["Insert"];
}

export type TableData<T extends TableName> = TableTypes[T];
