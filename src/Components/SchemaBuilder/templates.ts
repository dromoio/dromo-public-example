import { BuilderField } from "./types";

export interface SchemaTemplate {
  key: string;
  name: string;
  description: string;
  icon: string;
  importIdentifier: string;
  fields: BuilderField[];
  sampleDataFile: string;
}

export const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    key: "contacts",
    name: "Contacts",
    description: "Names, emails, and deal stage for a CRM-style import",
    icon: "👤",
    importIdentifier: "Contacts",
    sampleDataFile: "data/contacts.csv",
    fields: [
      { id: "c-id", label: "ID", key: "id", type: "uuid", required: true, unique: true, selectOptions: [] },
      { id: "c-first", label: "First Name", key: "firstName", type: "string", required: true, unique: false, selectOptions: [] },
      { id: "c-last", label: "Last Name", key: "lastName", type: "string", required: true, unique: false, selectOptions: [] },
      { id: "c-email", label: "Email", key: "email", type: "email", required: true, unique: true, selectOptions: [] },
      { id: "c-phone", label: "Phone Number", key: "phoneNumber", type: "phone-number", required: false, unique: false, selectOptions: [] },
      {
        id: "c-stage",
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
    ],
  },
  {
    key: "inventory",
    name: "Inventory",
    description: "SKU-based product catalog import",
    icon: "📦",
    importIdentifier: "Inventory",
    sampleDataFile: "data/inventory.csv",
    fields: [
      { id: "i-sku", label: "SKU", key: "sku", type: "string", required: true, unique: true, selectOptions: [] },
      { id: "i-name", label: "Product Name", key: "productName", type: "string", required: true, unique: false, selectOptions: [] },
      { id: "i-qty", label: "Quantity", key: "quantity", type: "number", required: true, unique: false, selectOptions: [] },
      { id: "i-price", label: "Unit Price", key: "unitPrice", type: "number", required: true, unique: false, selectOptions: [] },
      {
        id: "i-category",
        label: "Category",
        key: "category",
        type: "select",
        required: false,
        unique: false,
        selectOptions: [
          { label: "Electronics", value: "electronics" },
          { label: "Apparel", value: "apparel" },
          { label: "Home Goods", value: "home_goods" },
        ],
      },
    ],
  },
  {
    key: "transactions",
    name: "Transactions",
    description: "Financial transaction ledger import",
    icon: "💳",
    importIdentifier: "Transactions",
    sampleDataFile: "data/transactions.csv",
    fields: [
      { id: "t-id", label: "Transaction ID", key: "transactionId", type: "uuid", required: true, unique: true, selectOptions: [] },
      { id: "t-date", label: "Date", key: "date", type: "date", required: true, unique: false, selectOptions: [] },
      { id: "t-amount", label: "Amount", key: "amount", type: "number", required: true, unique: false, selectOptions: [] },
      {
        id: "t-type",
        label: "Type",
        key: "type",
        type: "select",
        required: true,
        unique: false,
        selectOptions: [
          { label: "Credit", value: "credit" },
          { label: "Debit", value: "debit" },
        ],
      },
      { id: "t-memo", label: "Memo", key: "memo", type: "string", required: false, unique: false, selectOptions: [] },
    ],
  },
  {
    key: "employees",
    name: "Employees",
    description: "HR roster import with department and start date",
    icon: "🧑‍💼",
    importIdentifier: "Employees",
    sampleDataFile: "data/employees.csv",
    fields: [
      { id: "e-id", label: "Employee ID", key: "employeeId", type: "uuid", required: true, unique: true, selectOptions: [] },
      { id: "e-first", label: "First Name", key: "firstName", type: "string", required: true, unique: false, selectOptions: [] },
      { id: "e-last", label: "Last Name", key: "lastName", type: "string", required: true, unique: false, selectOptions: [] },
      { id: "e-email", label: "Work Email", key: "workEmail", type: "email", required: true, unique: true, selectOptions: [] },
      { id: "e-start", label: "Start Date", key: "startDate", type: "date", required: true, unique: false, selectOptions: [] },
      {
        id: "e-dept",
        label: "Department",
        key: "department",
        type: "select",
        required: false,
        unique: false,
        selectOptions: [
          { label: "Engineering", value: "engineering" },
          { label: "Sales", value: "sales" },
          { label: "Marketing", value: "marketing" },
          { label: "Support", value: "support" },
        ],
      },
    ],
  },
];
