import * as React from "react";
import { BrowserRouter as Router, Switch, Route, useParams, Redirect } from "react-router-dom";
import TextEditor from "./TextEditor/TextEditor";
import TopBar from "./TopBar/TopBar";
import ShareModal from "./TopBar/ShareModal/ShareModal";
import SideBar from "./SideBar/SideBar";
import { blankspace } from "../../declarations/blankspace/index";
import { uuid } from 'uuidv4';

import "./index.css";

const App = () => {
    const [docName, setDocName] = React.useState("Untitled");
    const [docID, setDocID] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [sidebar, setSidebar] = React.useState(false);
    const [userDocs, setUserDocs] = React.useState([]);
    const [switchDoc, setSwitchDoc] = React.useState(false);

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

    const myPrincipal = "#hassan";

    React.useEffect(() => {
        const getDocs = async () => {
            console.log('myPrincipal: ', myPrincipal);
            const docs = await blankspace.getUsersDocs(myPrincipal);
            console.log('docs: ', docs);
            const intermDocsArr = [];
            docs.forEach(async (dId) => {
                const dnam = await blankspace.getDocName(dId);
                console.log('dnam: ', dnam);
                intermDocsArr.push({
                    'doc_id': dId,
                    'doc_name': dnam
                })
                console.log('intermDocsArr: ', intermDocsArr);
            })
            
            setUserDocs(intermDocsArr);
        }
        // const getDocsInterval = setInterval(getDocs, 2000);
        // return () => clearInterval(getDocsInterval);
        getDocs();
    }, [])

    const switchDocHandler = () => {
        setSwitchDoc(true);
    }

    React.useEffect(() => {
        if (switchDoc) {
            setTimeout(() => {
                setSwitchDoc(false);
            }, 50)
        }
    }, [switchDoc])


    

    const sidebarElement = (
        <>
            {/* <Router>   
                <SideBar docs={userDocs} />
            </Router> */}
        </>
    )



        // return (
//         <>
//         { openModal == true ? <ShareModal modalHandler={modalHandler} /> : null
// }
// <div>
//     <TopBar showSidebar={showSidebar} docName={docName} setDocName={setDocName} docID={docID} modalHandler={modalHandler} />
//     {sidebar ? sidebarElement : null}
//     <TextEditor docID={docID} setDocID={setDocID} />
// </div>
//         </>
    // );
    return (
    <>
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Redirect to={`/documents/${uuid()}`} />
                </Route>
                <Route path="/documents/:id" exact>
                    {/* <TextEditor /> */}
                    <>
                        {openModal == true ? <ShareModal modalHandler={modalHandler} /> : null}
                        <div>
                            {!switchDoc ? <TopBar showSidebar={showSidebar} docName={docName} setDocName={setDocName} docID={docID} modalHandler={modalHandler} /> : null}
                            {sidebar ? <SideBar switchDocHandler={switchDocHandler} docs={userDocs} /> : null}
                            {!switchDoc ? <TextEditor docID={docID} setDocID={setDocID} /> : null}
                        </div>
                    </>
                </Route>
            </Switch>
        </Router>
    </>
);
};

export default App;