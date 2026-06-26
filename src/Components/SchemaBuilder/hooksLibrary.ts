export interface HookDefinition {
  key: string;
  templateKey: string;
  label: string;
  description: string;
}

// Each template ships with its own sample hooks, tailored to that
// template's fields and use case — not a generic library gated on field
// presence. Switching templates swaps in that template's hooks.
export const HOOK_DEFINITIONS: HookDefinition[] = [
  {
    key: "fullName",
    templateKey: "contacts",
    label: "Derive Full Name",
    description:
      "Row hook combines First Name + Last Name into a read-only Full Name field, injected via a step hook.",
  },
  {
    key: "dedupeEmail",
    templateKey: "contacts",
    label: "Flag Duplicate Emails",
    description:
      "Row hook flags any email address that's already appeared earlier in the file, in real time as rows load.",
  },
  {
    key: "lowStock",
    templateKey: "inventory",
    label: "Flag Low Stock",
    description: "Row hook warns when Quantity drops below 10 units, so reorders aren't missed during import.",
  },
  {
    key: "skuFormat",
    templateKey: "inventory",
    label: "Normalize SKU Casing",
    description: "Row hook upper-cases SKU values on load so casing inconsistencies don't create duplicate products.",
  },
  {
    key: "largeAmount",
    templateKey: "transactions",
    label: "Flag Large Transactions",
    description: "Row hook warns on any transaction over $10,000, flagging it for manual review.",
  },
  {
    key: "creditDebitCheck",
    templateKey: "transactions",
    label: "Require Memo on Debits",
    description: "Row hook flags debit transactions that are missing a memo, since those need an audit trail.",
  },
  {
    key: "tenure",
    templateKey: "employees",
    label: "Derive Tenure",
    description:
      "Row hook calculates years of tenure from Start Date into a read-only field, injected via a step hook.",
  },
];

export const getHooksForTemplate = (templateKey: string): HookDefinition[] =>
  HOOK_DEFINITIONS.filter((h) => h.templateKey === templateKey);

// ── Real, runnable implementations used by the live preview ──

const fullNameRowHook = (record: any, _mode: any) => {
  const newRecord = record;
  const { row } = record;
  if (row.firstName && row.lastName && row.fullName) {
    newRecord.row.fullName.value = `${row.firstName.value || ""} ${row.lastName.value || ""}`.trim();
  }
  return newRecord;
};

const fullNameStepHook = {
  type: "REVIEW_STEP" as const,
  callback: (importer: any) => {
    importer.addField({ key: "fullName", label: "Full Name", readOnly: true }, { after: "lastName" });
  },
};

const seenEmails = new Set<string>();
const dedupeEmailRowHook = (record: any, mode: any) => {
  const newRecord = record;
  const email = record.row.email?.value;
  if (mode === "init" && email) {
    const key = String(email).toLowerCase();
    if (seenEmails.has(key)) {
      newRecord.row.email.info = [
        { message: "This email already appeared earlier in the file", level: "warning" },
      ];
    }
    seenEmails.add(key);
  }
  return newRecord;
};

const lowStockRowHook = (record: any, _mode: any) => {
  const newRecord = record;
  const qty = Number(record.row.quantity?.value);
  if (record.row.quantity && !Number.isNaN(qty) && qty < 10) {
    newRecord.row.quantity.info = [{ message: "Low stock — consider reordering", level: "warning" }];
  }
  return newRecord;
};

const skuFormatRowHook = (record: any, _mode: any) => {
  const newRecord = record;
  if (record.row.sku?.value) {
    newRecord.row.sku.value = String(record.row.sku.value).toUpperCase();
  }
  return newRecord;
};

const largeAmountRowHook = (record: any, _mode: any) => {
  const newRecord = record;
  const amount = Number(record.row.amount?.value);
  if (record.row.amount && !Number.isNaN(amount) && amount > 10000) {
    newRecord.row.amount.info = [{ message: "Large transaction — review recommended", level: "warning" }];
  }
  return newRecord;
};

const creditDebitCheckRowHook = (record: any, _mode: any) => {
  const newRecord = record;
  const type = record.row.type?.value;
  const memo = record.row.memo?.value;
  if (type === "debit" && !memo) {
    newRecord.row.memo.info = [{ message: "Debits should include a memo for audit purposes", level: "warning" }];
  }
  return newRecord;
};

const tenureRowHook = (record: any, _mode: any) => {
  const newRecord = record;
  const start = record.row.startDate?.value;
  if (start && record.row.tenureYears) {
    const years = (Date.now() - new Date(start).getTime()) / (365.25 * 24 * 3600 * 1000);
    newRecord.row.tenureYears.value = years >= 0 ? years.toFixed(1) : "";
  }
  return newRecord;
};

const tenureStepHook = {
  type: "REVIEW_STEP" as const,
  callback: (importer: any) => {
    importer.addField({ key: "tenureYears", label: "Tenure (yrs)", readOnly: true }, { after: "startDate" });
  },
};

const ROW_HOOK_IMPLS: Record<string, (record: any, mode: any) => any> = {
  fullName: fullNameRowHook,
  dedupeEmail: dedupeEmailRowHook,
  lowStock: lowStockRowHook,
  skuFormat: skuFormatRowHook,
  largeAmount: largeAmountRowHook,
  creditDebitCheck: creditDebitCheckRowHook,
  tenure: tenureRowHook,
};

const STEP_HOOK_IMPLS: Record<string, { type: "REVIEW_STEP"; callback: (importer: any) => void } | undefined> = {
  fullName: fullNameStepHook,
  tenure: tenureStepHook,
};

// Field key a step hook injects, so we can skip re-adding it if it's
// already part of the schema.
const STEP_HOOK_INJECTED_KEY: Record<string, string> = {
  fullName: "fullName",
  tenure: "tenureYears",
};

export const buildHooksForPreview = (enabledHookKeys: string[], fieldKeys: string[]) => {
  seenEmails.clear();
  const rowHooks = enabledHookKeys.filter((k) => ROW_HOOK_IMPLS[k]).map((k) => ROW_HOOK_IMPLS[k]);
  const stepHooks = enabledHookKeys
    .filter((k) => STEP_HOOK_IMPLS[k] && !fieldKeys.includes(STEP_HOOK_INJECTED_KEY[k]))
    .map((k) => STEP_HOOK_IMPLS[k]!);
  return { rowHooks, stepHooks };
};

const indent = (text: string, spaces: number) =>
  text
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");

const ROW_HOOK_SNIPPETS: Record<string, string> = {
  fullName: `(record, mode) => {\n  const newRecord = record;\n  const { row } = record;\n  newRecord.row.fullName.value = \`\${row.firstName.value || ""} \${row.lastName.value || ""}\`.trim();\n  return newRecord;\n}`,
  dedupeEmail: `(record, mode) => {\n  const newRecord = record;\n  const email = record.row.email?.value;\n  if (mode === "init" && email && seenEmails.has(email.toLowerCase())) {\n    newRecord.row.email.info = [{ message: "Duplicate email seen earlier in file", level: "warning" }];\n  }\n  seenEmails.add(email?.toLowerCase());\n  return newRecord;\n}`,
  lowStock: `(record, mode) => {\n  const newRecord = record;\n  const qty = Number(record.row.quantity?.value);\n  if (!Number.isNaN(qty) && qty < 10) {\n    newRecord.row.quantity.info = [{ message: "Low stock — consider reordering", level: "warning" }];\n  }\n  return newRecord;\n}`,
  skuFormat: `(record, mode) => {\n  const newRecord = record;\n  newRecord.row.sku.value = String(record.row.sku.value).toUpperCase();\n  return newRecord;\n}`,
  largeAmount: `(record, mode) => {\n  const newRecord = record;\n  const amount = Number(record.row.amount?.value);\n  if (!Number.isNaN(amount) && amount > 10000) {\n    newRecord.row.amount.info = [{ message: "Large transaction — review recommended", level: "warning" }];\n  }\n  return newRecord;\n}`,
  creditDebitCheck: `(record, mode) => {\n  const newRecord = record;\n  const { type, memo } = record.row;\n  if (type.value === "debit" && !memo.value) {\n    newRecord.row.memo.info = [{ message: "Debits should include a memo", level: "warning" }];\n  }\n  return newRecord;\n}`,
  tenure: `(record, mode) => {\n  const newRecord = record;\n  const start = record.row.startDate?.value;\n  if (start) {\n    const years = (Date.now() - new Date(start).getTime()) / (365.25 * 24 * 3600 * 1000);\n    newRecord.row.tenureYears.value = years.toFixed(1);\n  }\n  return newRecord;\n}`,
};

const STEP_HOOK_SNIPPETS: Record<string, string> = {
  fullName: `{\n  type: "REVIEW_STEP",\n  callback: (importer) => {\n    importer.addField(\n      { key: "fullName", label: "Full Name", readOnly: true },\n      { after: "lastName" }\n    );\n  },\n}`,
  tenure: `{\n  type: "REVIEW_STEP",\n  callback: (importer) => {\n    importer.addField(\n      { key: "tenureYears", label: "Tenure (yrs)", readOnly: true },\n      { after: "startDate" }\n    );\n  },\n}`,
};

export const generateRowHooksSnippet = (enabledHookKeys: string[]): string | null => {
  const snippets = enabledHookKeys.filter((k) => ROW_HOOK_SNIPPETS[k]).map((k) => ROW_HOOK_SNIPPETS[k]);
  if (snippets.length === 0) return null;
  return `[\n${indent(snippets.join(",\n"), 2)},\n]`;
};

export const generateStepHooksSnippet = (enabledHookKeys: string[], fieldKeys: string[]): string | null => {
  const snippets = enabledHookKeys
    .filter((k) => STEP_HOOK_SNIPPETS[k] && !fieldKeys.includes(STEP_HOOK_INJECTED_KEY[k]))
    .map((k) => STEP_HOOK_SNIPPETS[k]);
  if (snippets.length === 0) return null;
  return `[\n${indent(snippets.join(",\n"), 2)},\n]`;
};
