import { useState } from "react";
import "./Styles/App.css";
import Navbar from "./Components/Navbar";
import { UploadPage } from "./Components/UploadPage";
import { FastTrackUploadPage } from "./Components/FastTrackUploadPage";

export type Tabs = "upload" | "fastTrack" | "viewUpload";
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
      <section className="main">{component}</section>
    </>
  );
}

export default App;
