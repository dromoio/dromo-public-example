import { useState } from "react";
import "./Styles/App.css";
import Navbar from "./Components/Navbar";
import { UploadPage } from "./Components/UploadPage";
import { FastTrackUploadPage } from "./Components/FastTrackUploadPage";
import { SchemaBuilderPage } from "./Components/SchemaBuilder/SchemaBuilderPage";

export type Tabs = "upload" | "fastTrack" | "builder" | "viewUpload";
function App() {
  const [tab, setTab] = useState<Tabs>("upload");
  const [uploadData, setUploadData] = useState<any[][]>([]);

  let component;
  if (tab === "upload") {
    component = (
      <UploadPage
        uploadData={uploadData}
        setUploadData={setUploadData}
        setTab={setTab}
      />
    );
  } else if (tab === "builder") {
    component = (
      <SchemaBuilderPage
        uploadData={uploadData}
        setUploadData={setUploadData}
        setTab={setTab}
      />
    );
  } else {
    component = (
      <FastTrackUploadPage
        uploadData={uploadData}
        setUploadData={setUploadData}
        setTab={setTab}
      ></FastTrackUploadPage>
    );
  }
  return (
    <>
      <Navbar uploadData={uploadData} tab={tab} setTab={setTab} />
      <section className={tab === "builder" ? "main-wide" : "main"}>{component}</section>
    </>
  );
}

export default App;
