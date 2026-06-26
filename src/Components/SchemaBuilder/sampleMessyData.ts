import { BuilderField } from "./types";

// Generates a small grid (headers + rows) with intentional data problems —
// a blank required cell, an invalid email, an out-of-range select value —
// so the Error Navigator / validation UI has something to show immediately,
// without requiring the visitor to find or craft their own broken CSV.
export const generateMessyData = (fields: BuilderField[]): any[][] => {
  const headers = fields.map((f) => f.label);

  const valueFor = (field: BuilderField, rowIndex: number): string => {
    if (field.required && rowIndex === 0) return "";
    if (field.type === "email") {
      return rowIndex === 1 ? "not-a-valid-email" : `person${rowIndex}@example.com`;
    }
    if (field.type === "number") return String(rowIndex * 10 + 5);
    if (field.type === "date") return rowIndex === 2 ? "13/45/2024" : "2024-03-15";
    if (field.type === "uuid") return `00000000-0000-0000-0000-00000000000${rowIndex}`;
    if ((field.type === "select" || field.type === "multi-select") && field.selectOptions.length > 0) {
      return rowIndex === 3 ? "not-a-real-option" : field.selectOptions[0].value;
    }
    if (field.unique && rowIndex === 2) {
      // Duplicate the row-1 value to trigger a uniqueness error
      return valueFor(field, 1);
    }
    return `${field.label} ${rowIndex}`;
  };

  const rows = [0, 1, 2, 3].map((rowIndex) => fields.map((f) => valueFor(f, rowIndex)));
  return [headers, ...rows];
};
