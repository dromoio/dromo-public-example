export type BuilderFieldType =
  | "string"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "email"
  | "select"
  | "multi-select"
  | "checkbox"
  | "phone-number"
  | "us-zip-code"
  | "url"
  | "uuid";

export const FIELD_TYPE_OPTIONS: { value: BuilderFieldType; label: string }[] = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Datetime" },
  { value: "time", label: "Time" },
  { value: "email", label: "Email" },
  { value: "select", label: "Select" },
  { value: "multi-select", label: "Multi-Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "phone-number", label: "Phone Number" },
  { value: "us-zip-code", label: "US Zip Code" },
  { value: "url", label: "URL" },
  { value: "uuid", label: "UUID" },
];

export const TYPES_WITH_SELECT_OPTIONS: BuilderFieldType[] = ["select", "multi-select"];

export interface BuilderSelectOption {
  label: string;
  value: string;
}

export interface BuilderField {
  id: string;
  label: string;
  key: string;
  type: BuilderFieldType;
  required: boolean;
  unique: boolean;
  selectOptions: BuilderSelectOption[];
}

export type InvalidDataBehavior = "BLOCK_SUBMIT" | "REMOVE_INVALID_ROWS" | "INCLUDE_INVALID_ROWS";

export interface BuilderSettings {
  autoMapHeaders: boolean;
  matchToSchema: boolean;
  invalidDataBehavior: InvalidDataBehavior;
  locale: string;
  enableUserTransformations: boolean;
  enableNavigatingErrors: boolean;
  enableCustomStepDemo: boolean;
}

export const DEFAULT_BUILDER_SETTINGS: BuilderSettings = {
  autoMapHeaders: false,
  matchToSchema: false,
  invalidDataBehavior: "REMOVE_INVALID_ROWS",
  locale: "en",
  enableUserTransformations: false,
  enableNavigatingErrors: false,
  enableCustomStepDemo: false,
};

export const LOCALE_OPTIONS: { value: string; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

export const createBlankField = (): BuilderField => ({
  id: crypto.randomUUID ? crypto.randomUUID() : `field_${Date.now()}_${Math.random()}`,
  label: "New Field",
  key: "",
  type: "string",
  required: false,
  unique: false,
  selectOptions: [],
});

export const DEFAULT_BUILDER_FIELDS: BuilderField[] = [
  {
    id: "f-id",
    label: "ID",
    key: "id",
    type: "uuid",
    required: true,
    unique: true,
    selectOptions: [],
  },
  {
    id: "f-firstName",
    label: "First Name",
    key: "firstName",
    type: "string",
    required: true,
    unique: false,
    selectOptions: [],
  },
  {
    id: "f-lastName",
    label: "Last Name",
    key: "lastName",
    type: "string",
    required: true,
    unique: false,
    selectOptions: [],
  },
  {
    id: "f-email",
    label: "Email",
    key: "email",
    type: "email",
    required: true,
    unique: true,
    selectOptions: [],
  },
  {
    id: "f-dealStage",
    label: "Deal Stage",
    key: "dealStage",
    type: "select",
    required: false,
    unique: false,
    selectOptions: [
      { label: "Qualified", value: "qualified" },
      { label: "Demo", value: "demo" },
      { label: "Proposal", value: "proposal" },
      { label: "Closed", value: "closed" },
    ],
  },
];
