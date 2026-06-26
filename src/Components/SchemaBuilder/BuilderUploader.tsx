import DromoUploader from "dromo-uploader-react";
import { ReactComponent as UploadIcon } from "../../assets/icons/upload.svg";
import { DromoFieldConfig } from "./codeGen";
import { BuilderSettings } from "./types";
import { buildHooksForPreview } from "./hooksLibrary";
import { buildCustomStepConfig } from "./customStepDemo";

export const BuilderUploader = (props: {
  fields: DromoFieldConfig[];
  fieldKeys: string[];
  importIdentifier: string;
  settings: BuilderSettings;
  styleOverrides?: Record<string, any>;
  enabledHookKeys: string[];
  initialData?: any[][] | null;
  setResults: (data: any[]) => void;
}) => {
  const { rowHooks, stepHooks } = buildHooksForPreview(props.enabledHookKeys, props.fieldKeys);

  return (
    <DromoUploader
      licenseKey="54837493-7b72-49b3-8eb4-0cbda89fcb62"
      fields={props.fields as any}
      settings={{
        importIdentifier: props.importIdentifier || "Custom Schema",
        developmentMode: false,
        maxRecords: 200,
        allowCustomFields: true,
        backendSyncMode: "MAPPINGS_ONLY",
        invalidDataBehavior: props.settings.invalidDataBehavior,
        autoMapHeaders: props.settings.autoMapHeaders,
        matchingStep: { matchToSchema: props.settings.matchToSchema },
        locale: props.settings.locale as any,
        reviewStep: {
          enableUserTransformations: props.settings.enableUserTransformations,
          enableNavigatingErrors: props.settings.enableNavigatingErrors,
        },
        ...(props.initialData ? { initialData: props.initialData as any } : {}),
        ...(props.styleOverrides && Object.keys(props.styleOverrides).length > 0
          ? { styleOverrides: props.styleOverrides as any }
          : {}),
      }}
      user={{
        id: "1",
        name: "Joan Livingston",
        email: "jane@dromo.io",
        companyId: "12345",
        companyName: "DromoCustomer",
      }}
      rowHooks={rowHooks.length > 0 ? rowHooks : undefined}
      stepHooks={stepHooks.length > 0 ? stepHooks : undefined}
      customSteps={props.settings.enableCustomStepDemo ? [buildCustomStepConfig() as any] : undefined}
      onResults={(response, _metadata) => {
        props.setResults(response);
      }}
    >
      <div className="px-6 pt-3.5 pb-3.5 text-base bg-[royalblue] hover:bg-[midnightblue] rounded-xl text-white shadow overflow-hidden text-center">
        Preview This Schema <UploadIcon className="inline size-5" />
      </div>
    </DromoUploader>
  );
};
