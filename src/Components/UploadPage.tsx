import { useState } from "react";
import { Tabs } from "../App";
import { Uploader } from "./Uploader";
import { UploaderCode } from "./UploaderCode";
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
function classNames(...classes: string[]) {
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
      "Dromo provides a Match Values step to bulk fix entire columns of data. The developer defines the acceptable values and Dromo uses AI to assist in reconciling the uploaded values with the target. The prevents the user from having to do any tedious copy and pasting. In our example we match values in the 'Deal Stage' column.",
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

  return (
    <div>
      <div className="bg-white rounded-lg">
        <div className="mb-6 flex gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
          <p>
            In a hurry? Check out the{" "}
            <a
              href="#fastTrack"
              className={"text-blue-600 font-bold no-underline hover:underline"}
              onClick={() => props.setTab("fastTrack")}
            >
              🏎️ 🏁 Fast Track Import Demo
            </a>{" "}
            to see Dromo import data in just one click!
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow grid grid-cols-[1fr,auto] items-center">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 flex flex-row justify-between ">
          <div className="min-w-0 ml-4 mt-2">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Dromo Importer Demo
            </h3>
          </div>
          <div className="flex items-center align-middle">
            <a
              href="https://codesandbox.io/p/sandbox/dromo-uploader-demo-lmdly8?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clzd7zbvq00063b6m7xgfjb2f%2522%252C%2522sizes%2522%253A%255B100%252C0%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clzd7zbvq00023b6mgx1uoklz%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clzd7zbvq00033b6m564o678x%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clzd7zbvq00053b6m55v1pi44%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B51.93090270419763%252C48.06909729580237%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clzd7zbvq00023b6mgx1uoklz%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clzd7zbvq00013b6mpa72fkfn%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fsrc%252Findex.tsx%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522id%2522%253A%2522clzd7zbvq00023b6mgx1uoklz%2522%252C%2522activeTabId%2522%253A%2522clzd7zbvq00013b6mpa72fkfn%2522%257D%252C%2522clzd7zbvq00053b6m55v1pi44%2522%253A%257B%2522id%2522%253A%2522clzd7zbvq00053b6m55v1pi44%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clzd7zbvq00043b6mzy0ixmxm%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clzd7zbvq00043b6mzy0ixmxm%2522%257D%252C%2522clzd7zbvq00033b6m564o678x%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clzd7zbvq00033b6m564o678x%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D"
              target="_blank"
              rel="noreferrer"
              className="flex  hover:text-blue-600 hover:underline"
            >
              CodeSandbox <CodeSandBoxIcon className="h-5 ml-2 " />
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
                <ol className="list-decimal text-2xl list-inside space-y-6">
                  <li>
                    Download
                    <a
                      className="text-blue-600  no-underline hover:underline"
                      href="data/contacts.csv"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {"  "}
                      the example CSV export of contacts.{" "}
                    </a>
                  </li>
                  <li>Click "Import with Dromo" and upload the sample CSV</li>
                  <div>
                    <div className="py-3 flex justify-center">
                      <Uploader setResults={props.setUploadData} />
                    </div>
                  </div>
                </ol>

                <Disclosure>
                  <DisclosureButton className="py-2 flex justify-between w-full">
                    <span className="flex">What is Dromo doing?</span>
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
                                  <span className="text-base  leading-7">
                                    {highlight.summary}
                                  </span>
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
                  <CodeBlock
                    children={prettyFormat(props.uploadData, {
                      printBasicPrototype: false,
                    })}
                    codeType="json"
                    showCopyButton={false}
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <CodeBlock children={UploaderCode} codeType="javascript" />
          )}
        </div>
      </div>
    </div>
  );
};
