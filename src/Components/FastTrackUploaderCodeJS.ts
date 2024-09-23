export const FastTrackUploaderCodeJS = `const license = "<YOUR KEY HERE>";
const fields= [
  // There are two required settings for each field: label and key
  {
    label: "ID",
    key: "id",
    type: "uuid",
    validators: [{ validate: "required" }, { validate: "unique" }],
  },
  {
    label: "First Name",
    key: "firstName",
    // validates that this field is present
    validators: [{ validate: "required" }],
  },
  {
    label: "Last Name",
    key: "lastName",
    validators: [{ validate: "required" }],
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    // Email must be present, unique, and properly formed
    validators: [{ validate: "required" }, { validate: "unique" }],
  },
  {
    label: "Position",
    key: "position",
    validators: [{ validate: "required" }],
  },
  {
    label: "Phone Number",
    key: "phoneNumber",
    type: ["phone-number", { country: "US", format: "national" }],
  },
  {
    label: "Zip Code",
    key: "zipCode",
    type: "us-zip-code",
  },
  {
    label: "Customer Since",
    key: "customerSince",
    type: "date",
    // will match this field to alternative customer column names
    alternateMatches: ["Date Activated"],
  },
  {
    label: "Deal Stage",
    key: "dealStage",
    // string, checkbox, or select
    type: "select",
    // options to match values or let customer select for mismatches
    selectOptions: [
      { label: "Qualified", value: "qualified" },
      { label: "Demo", value: "demo" },
      { label: "Proposal", value: "proposal" },
      {
        label: "Closed",
        value: "closed",
        alternateMatches: ["under contract"],
      },
    ],
  },
];
const settings= {
  importIdentifier: "Fast Track Contacts 2",
  developmentMode: false,
  uploadStep: {
    helpText:
      "Drag and drop the sample file. You can customize this help text. It even supports HTML so you can style it, embed videos, etc.",
  },
  autoMapHeaders: true,
  backendSyncMode: "MAPPINGS_ONLY",
  matchingStep: {
    headerRowOverride: 0,
  },
  invalidDataBehavior: "REMOVE_INVALID_ROWS",
};

const user={
  id: "1",
  name: "Joan Livingston",
  email: "jane@dromo.io",
  companyId: "12345",
  companyName: "DromoCustomer",
};

const dromo = new DromoUploader(license, fields, settings, user);

dromo.registerRowHook((record, _mode) => {
    const newRecord = record;

    const {
      row: { firstName, lastName },
    } = record;

    newRecord.row.fullName.value = firstName.value + " " + lastName.value;

    return newRecord;
});

dromo.registerStepHook("REVIEW_STEP", (importer) => {
  importer.addField(
    {
      key: "fullName",
      label: "Full Name",
      readOnly: true,
    },
    { after: "lastName" }
  );
})

dromo.onResults((response, metadata) => {
  props.setResults(response);
};`;
