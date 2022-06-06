import * as React from "react";
import TextEditor from "./TextEditor/TextEditor";
import TopBar from "./TopBar/TopBar";
import ShareModal from "./TopBar/ShareModal/ShareModal";
import SideBar from "./SideBar/SideBar";
import { blankspace } from "../../declarations/blankspace/index";

import "./index.css";

const App = () => {
    const [docName, setDocName] = React.useState("Untitled");
    const [docID, setDocID] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [sidebar, setSidebar] = React.useState(false);
    const [userDocs, setUserDocs] = React.useState([]);

    const showSidebar = () => setSidebar(!sidebar)

    const modalHandler = () => {
        setOpenModal(prevState => !prevState);
    }

    React.useEffect(() => {
        console.log("openModaL : ", openModal);
    }, [openModal])

    React.useEffect(() => {
        console.log("userDocs : ", userDocs);
    }, [userDocs])

    React.useEffect(() => {
        const getDocs = async () => {
            const docs = await blankspace.getUsersDocs(myPrincipal);
            setUserDocs(docs);
        }
        getDocs();
    }, [])

    const myPrincipal = location.hash;

    

    return (
        <>
        {openModal == true ? <ShareModal modalHandler={modalHandler}/> : null}
        <div>
            <TopBar showSidebar={showSidebar} docName={docName} setDocName={setDocName} docID={docID} modalHandler={modalHandler}/>
            {sidebar ? <div className="sideBarPos"><SideBar docs={userDocs} /></div> : null}
            <TextEditor docID={docID} setDocID={setDocID}/>
        </div>
        </>
    );
};

export default App;