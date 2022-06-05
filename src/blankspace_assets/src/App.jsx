import * as React from "react";
import TextEditor from "./TextEditor/TextEditor";
import TopBar from "./TopBar/TopBar";
import ShareModal from "./TopBar/ShareModal/ShareModal";

import "./index.css";

const App = () => {
    const [docName, setDocName] = React.useState("Untitled");
    const [docID, setDocID] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);

    const modalHandler = () => {
        setOpenModal(prevState => !prevState);
    }

    React.useEffect(() => {
        console.log("openModaL : ", openModal);
    }, [openModal])

    return (
        <>
        {openModal == true ? <ShareModal modalHandler={modalHandler}/> : null}
        <div>
            <TopBar docName={docName} setDocName={setDocName} docID={docID} modalHandler={modalHandler}/>
            <TextEditor docID={docID} setDocID={setDocID}/>
        </div>
        </>
    );
};

export default App;