// Real, runnable Custom Step demo. The iframe at /custom-step-demo.html lets
// the end user define extra fields in-flow; it posts them back via
// { type: "DROMO_MESSAGE", payload: { fields: [...] } } followed by
// { type: "DROMO_NEXT" }, which Dromo turns into this onMessage callback plus
// automatic step advancement.
export const CUSTOM_STEP_ID = "add-custom-fields";
export const CUSTOM_STEP_LABEL = "Add Custom Fields";
export const CUSTOM_STEP_URL = "/custom-step-demo.html";

export const buildCustomStepConfig = () => ({
  id: CUSTOM_STEP_ID,
  insertAfter: "COLUMN_MATCH" as const,
  label: CUSTOM_STEP_LABEL,
  url: CUSTOM_STEP_URL,
  onMessage: async (uploader: any, payload: any) => {
    const fields = payload?.fields ?? [];
    for (const field of fields) {
      await uploader.addField(
        field.type === "select"
          ? { key: field.key, label: field.label, type: "select", selectOptions: field.selectOptions }
          : { key: field.key, label: field.label, type: "string" }
      );
    }
  },
});

export const CUSTOM_STEP_OBJECT_SNIPPET = `{
  id: "${CUSTOM_STEP_ID}",
  insertAfter: "COLUMN_MATCH",
  label: "${CUSTOM_STEP_LABEL}",
  url: "${CUSTOM_STEP_URL}",
  onMessage: async (uploader, payload) => {
    for (const field of payload.fields) {
      await uploader.addField(field);
    }
  },
}`;
