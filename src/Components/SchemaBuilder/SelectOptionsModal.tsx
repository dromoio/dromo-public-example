import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { BuilderField, BuilderSelectOption } from "./types";

export const SelectOptionsModal = (props: {
  field: BuilderField;
  onClose: () => void;
  onSave: (options: BuilderSelectOption[]) => void;
}) => {
  const [options, setOptions] = useState<BuilderSelectOption[]>(props.field.selectOptions);

  const updateOption = (index: number, patch: Partial<BuilderSelectOption>) => {
    setOptions(options.map((opt, i) => (i === index ? { ...opt, ...patch } : opt)));
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };

  return (
    <Dialog open onClose={props.onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-3">
            Options for "{props.field.label}"
          </DialogTitle>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={opt.label}
                  placeholder="Label"
                  onChange={(e) => updateOption(i, { label: e.target.value })}
                  className="flex-1 rounded-md border-0 py-1.5 px-2 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  value={opt.value}
                  placeholder="value"
                  onChange={(e) => updateOption(i, { value: e.target.value })}
                  className="flex-1 rounded-md border-0 py-1.5 px-2 text-sm font-mono ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  onClick={() => removeOption(i)}
                  className="text-gray-400 hover:text-red-600 px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            + Add option
          </button>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={props.onClose}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => props.onSave(options.filter((o) => o.label && o.value))}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
