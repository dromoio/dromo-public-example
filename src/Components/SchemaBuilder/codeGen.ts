import { BuilderField, BuilderSettings, TYPES_WITH_SELECT_OPTIONS } from "./types";
import { generateRowHooksSnippet, generateStepHooksSnippet } from "./hooksLibrary";
import { CUSTOM_STEP_OBJECT_SNIPPET } from "./customStepDemo";

export interface DromoFieldConfig {
  label: string;
  key: string;
  type?: string;
  validators?: { validate: string }[];
  selectOptions?: { label: string; value: string }[];
}

// Turns builder state into the actual object Dromo's `fields` prop expects.
// This is the single source of truth shared by the live preview and the
// generated code snippet so the two can never drift apart.
export const buildDromoFields = (fields: BuilderField[]): DromoFieldConfig[] =>
  fields.map((field) => {
    const config: DromoFieldConfig = {
      label: field.label,
      key: field.key || field.label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    };

    if (field.type !== "string") {
      config.type = field.type;
    }

    const validators: { validate: string }[] = [];
    if (field.required) validators.push({ validate: "required" });
    if (field.unique) validators.push({ validate: "unique" });
    if (validators.length > 0) config.validators = validators;

    if (TYPES_WITH_SELECT_OPTIONS.includes(field.type) && field.selectOptions.length > 0) {
      config.selectOptions = field.selectOptions.map(({ label, value }) => ({ label, value }));
    }

    return config;
  });

export const fieldKeysFor = (fields: BuilderField[]): string[] =>
  buildDromoFields(fields).map((f) => f.key);

const indent = (text: string, spaces: number) =>
  text
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");

const stringifyFieldConfig = (field: DromoFieldConfig): string => {
  const lines: string[] = [];
  lines.push(`label: ${JSON.stringify(field.label)},`);
  lines.push(`key: ${JSON.stringify(field.key)},`);
  if (field.type) lines.push(`type: ${JSON.stringify(field.type)},`);
  if (field.validators) {
    lines.push(
      `validators: [${field.validators.map((v) => `{ validate: "${v.validate}" }`).join(", ")}],`
    );
  }
  if (field.selectOptions) {
    lines.push("selectOptions: [");
    field.selectOptions.forEach((opt) => {
      lines.push(`  { label: ${JSON.stringify(opt.label)}, value: ${JSON.stringify(opt.value)} },`);
    });
    lines.push("],");
  }
  return `{\n${indent(lines.join("\n"), 2)}\n}`;
};

export const generateFieldsSnippet = (fields: BuilderField[]): string => {
  const configs = buildDromoFields(fields);
  const body = configs.map(stringifyFieldConfig).join(",\n");
  return `[\n${indent(body, 2)}\n]`;
};

const stringifySettings = (
  importIdentifier: string,
  settings: BuilderSettings,
  styleOverrides?: Record<string, any>,
  hasInitialData?: boolean
): string => {
  const lines: string[] = [
    `importIdentifier: "${importIdentifier}",`,
    `developmentMode: false,`,
  ];
  if (settings.autoMapHeaders) lines.push(`autoMapHeaders: true,`);
  if (settings.matchToSchema) lines.push(`matchingStep: { matchToSchema: true },`);
  lines.push(`invalidDataBehavior: "${settings.invalidDataBehavior}",`);
  if (settings.locale !== "en") lines.push(`locale: "${settings.locale}",`);
  if (settings.enableUserTransformations || settings.enableNavigatingErrors) {
    const reviewLines: string[] = [];
    if (settings.enableUserTransformations) reviewLines.push("enableUserTransformations: true,");
    if (settings.enableNavigatingErrors) reviewLines.push("enableNavigatingErrors: true,");
    lines.push(`reviewStep: {\n${indent(reviewLines.join("\n"), 2)}\n},`);
  }
  if (hasInitialData) lines.push(`initialData: SAMPLE_DATA, // headers + rows, see below`);
  if (styleOverrides && Object.keys(styleOverrides).length > 0) {
    lines.push(`styleOverrides: ${JSON.stringify(styleOverrides, null, 2).split("\n").join("\n  ")},`);
  }
  return `{\n${indent(lines.join("\n"), 2)}\n}`;
};

export const generateReactSnippet = (
  fields: BuilderField[],
  importIdentifier: string,
  settings: BuilderSettings,
  styleOverrides?: Record<string, any>,
  enabledHookKeys: string[] = [],
  hasInitialData?: boolean
): string => {
  const fieldKeys = fieldKeysFor(fields);
  const fieldsCode = indent(generateFieldsSnippet(fields), 2);
  const settingsCode = indent(
    stringifySettings(importIdentifier, settings, styleOverrides, hasInitialData),
    2
  );
  const rowHooksSnippet = generateRowHooksSnippet(enabledHookKeys);
  const stepHooksSnippet = generateStepHooksSnippet(enabledHookKeys, fieldKeys);
  const customStepsSnippet = settings.enableCustomStepDemo
    ? `[\n${indent(CUSTOM_STEP_OBJECT_SNIPPET, 2)},\n]`
    : null;

  return `<DromoUploader
  licenseKey="<YOUR LICENSE KEY>"
  fields={${fieldsCode}}
  settings={${settingsCode}}
  user={{ id: "1", name: "Jane Doe", email: "jane@example.com" }}${
    rowHooksSnippet ? `\n  rowHooks={${indent(rowHooksSnippet, 2)}}` : ""
  }${stepHooksSnippet ? `\n  stepHooks={${indent(stepHooksSnippet, 2)}}` : ""}${
    customStepsSnippet ? `\n  customSteps={${indent(customStepsSnippet, 2)}}` : ""
  }
  onResults={(response, metadata) => {
    console.log(response);
  }}
>
  Launch Dromo
</DromoUploader>`;
};

export const generateJSSnippet = (
  fields: BuilderField[],
  importIdentifier: string,
  settings: BuilderSettings,
  styleOverrides?: Record<string, any>,
  enabledHookKeys: string[] = [],
  hasInitialData?: boolean
): string => {
  const fieldKeys = fieldKeysFor(fields);
  const fieldsCode = indent(generateFieldsSnippet(fields), 2);
  const settingsCode = indent(
    stringifySettings(importIdentifier, settings, styleOverrides, hasInitialData),
    2
  );
  const rowHooksSnippet = generateRowHooksSnippet(enabledHookKeys);
  const stepHooksSnippet = generateStepHooksSnippet(enabledHookKeys, fieldKeys);

  return `const dromo = new DromoUploader(
  "<YOUR LICENSE KEY>",
  ${fieldsCode},
  ${settingsCode},
  { id: "1", name: "Jane Doe", email: "jane@example.com" }
);
${rowHooksSnippet ? `\ndromo.registerRowHook(${rowHooksSnippet});\n` : ""}${
    stepHooksSnippet ? `\ndromo.registerStepHook(${stepHooksSnippet});\n` : ""
  }${settings.enableCustomStepDemo ? `\ndromo.registerCustomStep(${CUSTOM_STEP_OBJECT_SNIPPET});\n` : ""}
dromo.onResults((response, metadata) => {
  console.log(response);
});

dromo.open();`;
};
