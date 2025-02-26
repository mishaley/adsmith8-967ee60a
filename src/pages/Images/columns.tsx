
import { ColumnDef } from "@/types/table";
import { imageFormatOptions, resolutionOptions, statusOptions } from "./options";

export const getColumns = (messageOptions: { value: string; label: string; }[]): ColumnDef[] => [
  {
    field: "image_storage",
    header: "Image",
    inputMode: "text",
    editable: false,
    required: false,
    format: "image",
    newRecordHidden: true
  },
  {
    field: "message_id",
    header: "Message",
    inputMode: "select",
    editable: true,
    required: true,
    options: messageOptions,
    displayField: "message_name"
  },
  {
    field: "image_format",
    header: "Format",
    inputMode: "select",
    editable: true,
    required: true,
    options: imageFormatOptions
  },
  {
    field: "image_resolution",
    header: "Aspect Ratio",
    inputMode: "select",
    editable: true,
    required: true,
    options: resolutionOptions
  },
  {
    field: "image_style",
    header: "Style",
    inputMode: "text",
    editable: true,
    required: false
  },
  {
    field: "image_model",
    header: "Model",
    inputMode: "text",
    editable: true,
    required: false
  },
  {
    field: "image_inputprompt",
    header: "Input Prompt",
    inputMode: "text",
    editable: true,
    required: false
  },
  {
    field: "image_magicprompt",
    header: "Magic Prompt",
    inputMode: "text",
    editable: false,
    required: false,
    newRecordHidden: true
  },
  {
    field: "image_status",
    header: "Status",
    inputMode: "select",
    editable: false,
    required: false,
    options: statusOptions,
    newRecordHidden: true
  },
  {
    field: "created_at",
    header: "Created",
    inputMode: "text",
    editable: false,
    required: false,
    format: "M/D/YY"
  }
];
