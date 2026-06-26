import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format as prettyFormat } from "pretty-format";
import { Tabs } from "../../App";
import { CodeBlock } from "../CodeBlock";
import { stylePresets, stylePresetToOverrides } from "../../common/stylePresets";
import { FieldRow } from "./FieldRow";
import { SelectOptionsModal } from "./SelectOptionsModal";
import { BuilderUploader } from "./BuilderUploader";
import { FeatureSpotlight } from "./FeatureSpotlight";
import { SCHEMA_TEMPLATES } from "./templates";
import { generateMessyData } from "./sampleMessyData";
import { getHooksForTemplate } from "./hooksLibrary";
import { buildShareUrl, readShareStateFromLocation } from "./shareLink";
import { trackEvent } from "./analytics";
import copyTextToClipboard from "../../util/copyTextToClipboard";
import {
  BuilderField,
  BuilderSettings,
  DEFAULT_BUILDER_FIELDS,
  DEFAULT_BUILDER_SETTINGS,
  InvalidDataBehavior,
  LOCALE_OPTIONS,
  createBlankField,
} from "./types";
import {
  buildDromoFields,
  fieldKeysFor,
  generateJSSnippet,
  generateReactSnippet,
} from "./codeGen";

type ViewMode = "preview" | "code";

export const SchemaBuilderPage = (props: {
  uploadData: any[][];
  setUploadData: (data: any[][]) => void;
  setTab: (tab: Tabs) => void;
}) => {
  const [sharedState] = useState(() => readShareStateFromLocation());
  const [fields, setFields] = useState<BuilderField[]>(sharedState?.fields ?? DEFAULT_BUILDER_FIELDS);
  const [importIdentifier, setImportIdentifier] = useState(
    sharedState?.importIdentifier ?? "Custom Schema"
  );
  const [settings, setSettings] = useState<BuilderSettings>(
    sharedState?.settings ?? DEFAULT_BUILDER_SETTINGS
  );
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(sharedState?.selectedTheme ?? "default");
  const [view, setView] = useState<ViewMode>("preview");
  const [codeLang, setCodeLang] = useState<"React" | "JavaScript">("React");
  const [editingOptionsFor, setEditingOptionsFor] = useState<BuilderField | null>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("contacts");
  const [enabledHookKeys, setEnabledHookKeys] = useState<string[]>(
    sharedState?.enabledHookKeys ?? getHooksForTemplate("contacts").map((h) => h.key)
  );
  const [seededData, setSeededData] = useState<any[][] | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (sharedState) trackEvent("shared_config_loaded", { importIdentifier: sharedState.importIdentifier });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeSampleDataFile = useMemo(
    () =>
      SCHEMA_TEMPLATES.find((t) => t.key === selectedTemplateKey)?.sampleDataFile ??
      "data/contacts.csv",
    [selectedTemplateKey]
  );

  const styleOverrides = useMemo(() => stylePresetToOverrides(selectedTheme), [selectedTheme]);
  const dromoFields = useMemo(() => buildDromoFields(fields), [fields]);
  const fieldKeys = useMemo(() => fieldKeysFor(fields), [fields]);

  const reactSnippet = useMemo(
    () =>
      generateReactSnippet(
        fields,
        importIdentifier,
        settings,
        styleOverrides,
        enabledHookKeys,
        !!seededData
      ),
    [fields, importIdentifier, settings, styleOverrides, enabledHookKeys, seededData]
  );
  const jsSnippet = useMemo(
    () =>
      generateJSSnippet(
        fields,
        importIdentifier,
        settings,
        styleOverrides,
        enabledHookKeys,
        !!seededData
      ),
    [fields, importIdentifier, settings, styleOverrides, enabledHookKeys, seededData]
  );

  const updateField = (updated: BuilderField) => {
    setFields(fields.map((f) => (f.id === updated.id ? updated : f)));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const addField = () => {
    setFields([...fields, createBlankField()]);
  };

  const applyTemplate = (templateKey: string) => {
    const template = SCHEMA_TEMPLATES.find((t) => t.key === templateKey);
    if (!template) return;
    trackEvent("template_selected", { template: templateKey });
    setFields(template.fields.map((f) => ({ ...f })));
    setImportIdentifier(template.importIdentifier);
    setSelectedTemplateKey(templateKey);
    setEnabledHookKeys(getHooksForTemplate(templateKey).map((h) => h.key));
    setSeededData(null);
  };

  const selectTheme = (themeKey: string) => {
    trackEvent("theme_selected", { theme: themeKey });
    setSelectedTheme(themeKey);
  };

  const handleEnabledHookKeysChange = (keys: string[]) => {
    trackEvent("hook_toggled", { keys });
    setEnabledHookKeys(keys);
  };

  const handleSeedMessyData = () => {
    trackEvent("sample_errors_loaded", { importIdentifier });
    setSeededData(generateMessyData(fields));
  };

  const handleViewChange = (next: ViewMode) => {
    if (next === "code") trackEvent("code_tab_viewed", { codeLang });
    setView(next);
  };

  const handleCopyShareLink = async () => {
    const url = buildShareUrl({ fields, importIdentifier, settings, selectedTheme, enabledHookKeys });
    await copyTextToClipboard(url);
    trackEvent("share_link_copied", { importIdentifier });
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    setFields(arrayMove(fields, oldIndex, newIndex));
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-indigo-500/20 bg-indigo-50/50 p-4 leading-6 text-black">
        <p>
          Build your own import schema below — start from a template, add columns, set
          types and validations, and drag to reorder. The preview and code on the right
          update live as you go.
        </p>
        <button
          onClick={handleCopyShareLink}
          className="shrink-0 px-3 py-1.5 rounded-md text-sm font-medium bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 whitespace-nowrap"
        >
          {shareCopied ? "Link copied!" : "🔗 Copy Share Link"}
        </button>
      </div>

      {/* Templates gallery */}
      <div className="mb-6 bg-white rounded-lg shadow border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Start from a template</h2>
        <p className="text-xs text-gray-500 mb-3">
          Pick a starting point relevant to your use case, then customize it below.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SCHEMA_TEMPLATES.map((template) => (
            <div
              key={template.key}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                importIdentifier === template.importIdentifier
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300 bg-white"
              }`}
            >
              <button onClick={() => applyTemplate(template.key)} className="text-left w-full">
                <div className="text-2xl mb-1">{template.icon}</div>
                <div className="text-sm font-semibold text-gray-900">{template.name}</div>
                <p className="text-xs text-gray-600 mt-0.5">{template.description}</p>
              </button>
              <a
                href={template.sampleDataFile}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
              >
                ⬇ Sample data
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Builder */}
      <div className="mb-6 bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Template Columns</h2>
          <button
            onClick={addField}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + Add a column
          </button>
        </div>

        <div className="mb-4 max-w-sm">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Import Identifier
          </label>
          <input
            value={importIdentifier}
            onChange={(e) => setImportIdentifier(e.target.value)}
            className="w-full rounded-md border-0 py-1.5 px-2 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="w-8"></th>
                  <th className="py-1.5 pr-3 min-w-[220px]">Column Name</th>
                  <th className="py-1.5 pr-3 min-w-[180px]">Key</th>
                  <th className="py-1.5 pr-3 min-w-[170px]">Type</th>
                  <th className="py-1.5 pr-3 min-w-[260px]">Validations</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {fields.map((field) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      onChange={updateField}
                      onDelete={() => deleteField(field.id)}
                      onEditOptions={() => setEditingOptionsFor(field)}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
          {fields.length === 0 && (
            <p className="text-sm text-gray-500 py-6 text-center">
              No columns yet. Click "Add a column" to get started.
            </p>
          )}
        </div>

        {/* Settings panel */}
        <div className="mt-5 border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {showSettings ? "Hide" : "Show"} Settings &amp; Theme
          </button>

          {showSettings && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={settings.autoMapHeaders}
                      onChange={(e) =>
                        setSettings({ ...settings, autoMapHeaders: e.target.checked })
                      }
                    />
                    Auto-map headers
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={settings.matchToSchema}
                      onChange={(e) =>
                        setSettings({ ...settings, matchToSchema: e.target.checked })
                      }
                    />
                    Match to schema only
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Invalid Data Behavior
                  </label>
                  <select
                    value={settings.invalidDataBehavior}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        invalidDataBehavior: e.target.value as InvalidDataBehavior,
                      })
                    }
                    className="w-full rounded-md border-0 py-1.5 px-2 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="BLOCK_SUBMIT">Block submit</option>
                    <option value="REMOVE_INVALID_ROWS">Remove invalid rows</option>
                    <option value="INCLUDE_INVALID_ROWS">Include invalid rows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Locale
                  </label>
                  <select
                    value={settings.locale}
                    onChange={(e) => setSettings({ ...settings, locale: e.target.value })}
                    className="w-full rounded-md border-0 py-1.5 px-2 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  >
                    {LOCALE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Style Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(stylePresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => selectTheme(key)}
                      className={`p-2 rounded-lg border-2 text-left transition-all ${
                        selectedTheme === key
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: preset.global?.backgroundColor || "#FFFFFF" }}
                        />
                        <span className="text-xs font-semibold text-gray-900">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <FeatureSpotlight
        selectedTemplateKey={selectedTemplateKey}
        settings={settings}
        setSettings={setSettings}
        enabledHookKeys={enabledHookKeys}
        setEnabledHookKeys={handleEnabledHookKeysChange}
        hasSeededData={!!seededData}
        onSeedMessyData={handleSeedMessyData}
        onClearSeedData={() => setSeededData(null)}
      />

      {/* Live preview / code — the final step, once the schema above is configured */}
      <div className="mt-6 bg-white rounded-lg shadow border border-indigo-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Ready? Try your importer</h2>
          <nav className="flex space-x-1 rounded-lg bg-slate-100 p-0.5" aria-label="View">
            {(["preview", "code"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => handleViewChange(v)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  view === v ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {v === "preview" ? "Live Preview" : "<> Code"}
              </button>
            ))}
          </nav>
        </div>

        {view === "preview" ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              This launches the real Dromo importer configured with exactly the schema,
              settings, hooks, and theme you built above — try uploading{" "}
              <a
                href={activeSampleDataFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                the sample CSV for this template
              </a>
              .
            </p>
            <div onClick={() => trackEvent("preview_launched", { importIdentifier })}>
              <BuilderUploader
                fields={dromoFields}
                fieldKeys={fieldKeys}
                importIdentifier={importIdentifier}
                settings={settings}
                styleOverrides={styleOverrides}
                enabledHookKeys={enabledHookKeys}
                initialData={seededData}
                setResults={props.setUploadData}
              />
            </div>
            {props.uploadData.length > 0 && (
              <div className="mt-6 max-w-3xl">
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  Imported {props.uploadData.length} records with your custom schema.
                </div>
                <CodeBlock
                  children={prettyFormat(props.uploadData, { printBasicPrototype: false })}
                  codeType="json"
                  showCopyButton={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-3">
              <select
                value={codeLang}
                onChange={(e) => setCodeLang(e.target.value as "React" | "JavaScript")}
                className="rounded-md border-0 py-1.5 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              >
                <option>React</option>
                <option>JavaScript</option>
              </select>
            </div>
            <CodeBlock
              children={codeLang === "React" ? reactSnippet : jsSnippet}
              codeType="javascript"
            />
          </div>
        )}
      </div>

      {editingOptionsFor && (
        <SelectOptionsModal
          field={editingOptionsFor}
          onClose={() => setEditingOptionsFor(null)}
          onSave={(selectOptions) => {
            updateField({ ...editingOptionsFor, selectOptions });
            setEditingOptionsFor(null);
          }}
        />
      )}
    </div>
  );
};
