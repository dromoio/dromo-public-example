import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BuilderField, FIELD_TYPE_OPTIONS, TYPES_WITH_SELECT_OPTIONS } from "./types";

export const FieldRow = (props: {
  field: BuilderField;
  onChange: (field: BuilderField) => void;
  onDelete: () => void;
  onEditOptions: () => void;
}) => {
  const { field, onChange, onDelete, onEditOptions } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="bg-white border-b border-gray-100">
      <td className="w-8 pl-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600 px-1"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
      </td>
      <td className="py-2 pr-2">
        <input
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          className="w-full rounded-md border-0 py-1.5 px-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
        />
      </td>
      <td className="py-2 pr-2">
        <input
          value={field.key}
          placeholder="(auto)"
          onChange={(e) => onChange({ ...field, key: e.target.value })}
          className="w-full rounded-md border-0 py-1.5 px-2 text-sm font-mono text-gray-600 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
        />
      </td>
      <td className="py-2 pr-2">
        <select
          value={field.type}
          onChange={(e) => onChange({ ...field, type: e.target.value as BuilderField["type"] })}
          className="w-full rounded-md border-0 py-1.5 px-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
        >
          {FIELD_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 pr-2">
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => onChange({ ...field, required: !field.required })}
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              field.required
                ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            Required
          </button>
          <button
            onClick={() => onChange({ ...field, unique: !field.unique })}
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              field.unique
                ? "bg-purple-100 text-purple-700 border-purple-300"
                : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            Unique
          </button>
          {TYPES_WITH_SELECT_OPTIONS.includes(field.type) && (
            <button
              onClick={onEditOptions}
              className="px-2 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-300"
            >
              Options ({field.selectOptions.length})
            </button>
          )}
        </div>
      </td>
      <td className="py-2 pr-2 text-right">
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 text-sm px-1"
          aria-label="Delete field"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};
