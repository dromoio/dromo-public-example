import { useState } from "react";
import { Tabs } from "../App";
import { Uploader, UploaderConfig } from "./Uploader";
import { CodeBlock } from "./CodeBlock";
import { format as prettyFormat } from "pretty-format";
import { ReactComponent as CodeSandBoxIcon } from "../assets/icons/codesandbox.svg";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  MinusSmallIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { UploaderCodeReact } from "./UploaderCodeReact";
import { UploaderCodeJS } from "./UploaderCodeJS";
import { stylePresets } from "../common/stylePresets";
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
type DisplayOptions = "demo" | "code";

const hightlights = [
  {
    summary: "AI Assisted Mapping",
    content:
      "Cutting edge AI aides the user in matching columns in the import file to the target schema. 'Postition' is matched to 'role', 'Date Activated' to 'customerSince', 'first' to 'First Name', 'zip' to 'Zip Code'. Dromo uses a mix of fuzzy matching to catch typos as well as LLM assistance to match on semantic value and even across languages.",
  },
  {
    summary: "Bulk data fixing",
    content:
      "Dromo has great features for fixing data in bulk. Here we're bulk fixing a date and a pick-list type field. The date is automatically detected and fixed. The 'Deal Stage' field uses AI to map values found in the data to the acceptable values in the schema.",
  },
  {
    summary: "Advanced validations",
    content:
      "Dromo has a large library of built in validations. It's easy to validate presence, uniqueness (even across multiple columns), length, regex, and more. Dromo also provides a library of types allowing a developer to easily validate a field conforms to any international date format, an email address, a number, currency, zip codes, and more. In this example we validate the presence of 'First Name', 'Last Name', 'Email', and 'Position'. We ensure the uniqueness of 'ID' and 'Email'. We check the validity of 'Email', 'Zip Code', 'Phone Number', 'Customer Since', and 'Deal Stage'.",
  },
  {
    summary: "Flexible Transformations",
    content:
      "Dromo's hooks make it possible to transform the data in any way you could imagine. A developer can access an entire row of data, validate, set values, and set custom error/notification messages. Hooks can perform API request to compare data to your own backend database. In our examples, we're creating a 'Full Name' field from the 'First Name' and 'Last Name' columns",
  },
];
const tabs: { key: DisplayOptions; name: string }[] = [
  { key: "demo", name: "Demo" },
  { key: "code", name: "<> Code" },
];

export const UploadPage = (props: {
  setUploadData: (data: any[][]) => void;
  uploadData: any[][];
  setTab: (tab: Tabs) => void;
}) => {
  const [display, setDisplay] = useState<DisplayOptions>("demo");
  const [codeLang, setCodeLang] = useState<string>("React");
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [config, setConfig] = useState<UploaderConfig>({
    enableUserTransformations: true,
    autoMapHeaders: false,
    invalidDataBehavior: "REMOVE_INVALID_ROWS",
  });

  const applyTheme = (theme: string) => {
    setSelectedTheme(theme);
    if (theme === "default") {
      const { styleOverrides, ...rest } = config;
      setConfig(rest);
    } else {
      const { name, description, previewColor, ...styleOverrides } = stylePresets[theme];
      setConfig({
        ...config,
        styleOverrides,
      });
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg">
        <div className="mb-6 flex gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-black">
          <p>
            In a hurry? Check out the{" "}
            <a
              href="#fastTrack"
              className={"text-blue-600 font-bold no-underline hover:underline"}
              onClick={() => props.setTab("fastTrack")}
            >
              Fast Track Import Demo
            </a>{" "}
            to see Dromo import data in just one click!
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow grid grid-cols-[1fr,auto] items-center">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 flex flex-row justify-between ">
          <div className="min-w-0 ml-4 mt-2">
            <h1 className="text-2xl font-bold leading-6 text-gray-900 mb-1">
              Dromo Importer Demo
            </h1>
          </div>
          <div className="flex items-center align-middle">
            <a
              href="https://codesandbox.io/p/sandbox/dromo-uploader-demo-lmdly8?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clzd7zbvq00063b6m7xgfjb2f%2522%252C%2522sizes%2522%253A%255B100%252C0%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clzd7zbvq00023b6mgx1uoklz%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clzd7zbvq00033b6m564o678x%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clzd7zbvq00053b6m55v1pi44%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B51.93090270419763%252C48.06909729580237%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clzd7zbvq00023b6mgx1uoklz%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clzd7zbvq00013b6mpa72fkfn%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fsrc%252Findex.tsx%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522id%2522%253A%2522clzd7zbvq00023b6mgx1uoklz%2522%252C%2522activeTabId%2522%253A%2522clzd7zbvq00013b6mpa72fkfn%2522%257D%252C%2522clzd7zbvq00053b6m55v1pi44%2522%253A%257B%2522id%2522%253A%2522clzd7zbvq00053b6m55v1pi44%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clzd7zbvq00043b6mzy0ixmxm%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clzd7zbvq00043b6mzy0ixmxm%2522%257D%252C%2522clzd7zbvq00033b6m564o678x%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clzd7zbvq00033b6m564o678x%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D"
              target="_blank"
              rel="noreferrer"
              className="flex  text-blue-600 hover:underline"
            >
              Try on CodeSandbox <CodeSandBoxIcon className="h-5 ml-2 " />
            </a>
            <div className="mx-3 hidden h-5 w-px bg-slate-900/10 sm:block"></div>
            <nav
              className="flex space-x-1 rounded-lg bg-slate-100 p-0.5"
              aria-label="Tabs"
            >
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={classNames(
                    display === t.key
                      ? "flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 bg-white shadow"
                      : "text-gray-500 hover:text-gray-700",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                  onClick={() => setDisplay(t.key)}
                >
                  {t.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6 col-span-2 row-start-2 min-w-0">
          {display === "demo" ? (
            <div className="">
              <div className="text-xl text-gray-500">
                <div className="mb-8 space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">1</span>
                    <div className="flex-1">
                      <p className="text-lg text-gray-900 mb-2">Download the sample CSV file</p>
                      <a
                        className="inline-flex items-center gap-2 text-blue-600 font-medium no-underline hover:underline"
                        href="data/contacts.csv"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        contacts.csv
                      </a>
                      <p className="text-sm text-gray-600 mt-1">This file contains sample contact data with intentional issues to showcase Dromo's features</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">2</span>
                    <div className="flex-1">
                      <p className="text-lg text-gray-900 mb-3">Customize settings and click "Import with Dromo"</p>

                      {/* Configuration Toggle */}
                      <button
                        onClick={() => setShowConfig(!showConfig)}
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {showConfig ? 'Hide' : 'Show'} Configuration Panel
                      </button>

                      {/* Configuration Panel */}
                      {showConfig && (
                        <div className="mb-4 p-4 bg-white border border-gray-300 rounded-lg space-y-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Dromo Settings</h4>

                          {/* Feature Toggles */}

                          <hr className="border-gray-200" />

                          {/* Style Theme Presets */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Style Theme</h4>
                            <p className="text-xs text-gray-500 mb-3">Choose a pre-built theme to customize the importer appearance</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(stylePresets).map(([key, preset]) => (
                                <button
                                  key={key}
                                  onClick={() => applyTheme(key)}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    selectedTheme === key
                                      ? "border-indigo-600 bg-indigo-50"
                                      : "border-gray-200 hover:border-indigo-300 bg-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <div
                                      className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                                      style={{ backgroundColor: preset.global?.backgroundColor || "#FFFFFF" }}
                                    />
                                    <span className="text-sm font-semibold text-gray-900">
                                      {preset.name}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">{preset.description}</p>
                                  <div
                                    className="w-full h-2 rounded"
                                    style={{ backgroundColor: preset.global?.backgroundColor || "#FFFFFF" }}
                                  />
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              View all available style properties in the{" "}
                              <a
                                href="https://developer.dromo.io/guides/custom-styling"
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                styling documentation
                              </a>
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-start">
                        <Uploader setResults={props.setUploadData} config={config} />
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure>
                  <DisclosureButton className="py-2 flex justify-between w-full">
                    <span className="flex text-xl">What is Dromo doing?</span>
                    <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                  </DisclosureButton>
                  <DisclosurePanel>
                    <dl className="space-y-1 divide-y divide-gray-900/10">
                      {hightlights.map((highlight) => (
                        <Disclosure
                          as="div"
                          key={highlight.summary}
                          className="pt-2"
                        >
                          {({ open }) => (
                            <>
                              <dt>
                                <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-900">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base leading-7">
                                      {highlight.summary}
                                    </span>
                                  </div>
                                  <span className="ml-6 flex h-7 items-center">
                                    {open ? (
                                      <MinusSmallIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <PlusSmallIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </DisclosureButton>
                              </dt>
                              <DisclosurePanel as="dd" className="mt-2 pr-12">
                                <p className="text-base leading-7 text-gray-600">
                                  {highlight.content}
                                </p>
                              </DisclosurePanel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </dl>
                  </DisclosurePanel>
                </Disclosure>
                <br />
                {props.uploadData.length > 0 ? (
                  <div className="mt-6">
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-green-900">Import Successful!</h3>
                      </div>
                      <p className="text-sm text-green-800">
                        Successfully imported {props.uploadData.length} records. Below is the cleaned and validated data returned from Dromo.
                      </p>
                    </div>
                    <CodeBlock
                      children={prettyFormat(props.uploadData, {
                        printBasicPrototype: false,
                      })}
                      codeType="json"
                      showCopyButton={false}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div>
              <div className="w-full flex flex-row justify-end">
                <div className="flex">
                  <select
                    id="location"
                    name="location"
                    value={codeLang}
                    className="mb-5 block  rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                    onChange={(e) => setCodeLang(e.target.value)}
                  >
                    {["React", "JavaScript"].map((lang) => (
                      <option>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
              <CodeBlock
                children={
                  codeLang === "React" ? UploaderCodeReact : UploaderCodeJS
                }
                codeType="javascript"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
