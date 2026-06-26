import { useState } from "react";
import { BuilderSettings } from "./types";
import { getHooksForTemplate } from "./hooksLibrary";
import { CUSTOM_STEP_LABEL } from "./customStepDemo";

type SpotlightTab = "hooks" | "transform" | "errorNav" | "customSteps";

const TABS: { key: SpotlightTab; label: string }[] = [
  { key: "hooks", label: "Hooks" },
  { key: "transform", label: "AI Transform Data" },
  { key: "errorNav", label: "Error Navigator" },
  { key: "customSteps", label: "Custom Steps" },
];

export const FeatureSpotlight = (props: {
  selectedTemplateKey: string;
  settings: BuilderSettings;
  setSettings: (settings: BuilderSettings) => void;
  enabledHookKeys: string[];
  setEnabledHookKeys: (keys: string[]) => void;
  hasSeededData: boolean;
  onSeedMessyData: () => void;
  onClearSeedData: () => void;
}) => {
  const [tab, setTab] = useState<SpotlightTab>("hooks");
  const templateHooks = getHooksForTemplate(props.selectedTemplateKey);

  const toggleHook = (key: string) => {
    if (props.enabledHookKeys.includes(key)) {
      props.setEnabledHookKeys(props.enabledHookKeys.filter((k) => k !== key));
    } else {
      props.setEnabledHookKeys([...props.enabledHookKeys, key]);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Feature Spotlight</h2>
      <p className="text-xs text-gray-500 mb-3">
        Dromo does more than column mapping — explore some of the harder-to-discover features.
      </p>

      <nav className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-0.5 mb-4" aria-label="Feature spotlight">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === t.key ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "hooks" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Each template ships with its own sample hooks, tailored to its fields. Toggle these
            on or off — they apply live to the preview and code on the right.
          </p>
          {templateHooks.map((hook) => {
            const enabled = props.enabledHookKeys.includes(hook.key);
            return (
              <label
                key={hook.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={enabled}
                  onChange={() => toggleHook(hook.key)}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{hook.label}</div>
                  <p className="text-xs text-gray-600">{hook.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {tab === "transform" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            "Transform Data" lets end users describe bulk edits in plain English — Dromo turns
            the request into a real transformation, previewed before they accept it.
          </p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={props.settings.enableUserTransformations}
              onChange={(e) =>
                props.setSettings({ ...props.settings, enableUserTransformations: e.target.checked })
              }
            />
            Enable AI Transform Data in the live preview
          </label>
          <p className="text-xs text-gray-500">
            Once enabled, open "Preview This Schema", upload data, and look for the "Transform
            Data" button on the review step.
          </p>
        </div>
      )}

      {tab === "errorNav" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            The Error Navigator lets end users step through validation errors one at a time
            with prev/next controls instead of hunting through the grid.
          </p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={props.settings.enableNavigatingErrors}
              onChange={(e) =>
                props.setSettings({ ...props.settings, enableNavigatingErrors: e.target.checked })
              }
            />
            Enable Error Navigator in the live preview
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={props.hasSeededData ? props.onClearSeedData : props.onSeedMessyData}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              {props.hasSeededData ? "Clear sample errors" : "Load sample data with errors"}
            </button>
            <p className="text-xs text-gray-500">
              Pre-fills the preview with a few rows that intentionally fail validation, so you
              can see the Error Navigator immediately without uploading anything.
            </p>
          </div>
        </div>
      )}

      {tab === "customSteps" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Custom Steps let you inject your own UI into the import flow. Your page renders in
            an iframe and talks back to Dromo via <code className="text-xs">postMessage</code> —
            adding fields, advancing the flow, or going back.
          </p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={props.settings.enableCustomStepDemo}
              onChange={(e) =>
                props.setSettings({ ...props.settings, enableCustomStepDemo: e.target.checked })
              }
            />
            Enable "{CUSTOM_STEP_LABEL}" custom step in the live preview
          </label>
          <p className="text-xs text-gray-500">
            Once enabled, open "Preview This Schema" — after matching columns, you'll land on a
            custom screen where you can define extra fields before continuing to review.
          </p>
        </div>
      )}
    </div>
  );
};
