import * as React from "react";
import { BrowserRouter as Router, Switch, Route, useParams, Redirect } from "react-router-dom";
import TextEditor from "./TextEditor/TextEditor";
import TopBar from "./TopBar/TopBar";
import ShareModal from "./TopBar/ShareModal/ShareModal";
import SideBar from "./SideBar/SideBar";
import { blankspace, canisterId, createActor } from "../../declarations/blankspace/index";
import { AuthClient } from "@dfinity/auth-client"; //@dfinity/authentication and @dfinity/identity
import { uuid } from 'uuidv4';
import myPrincipal from "./constants/userid";

import "./index.css";

const App = () => {
    const [docName, setDocName] = React.useState("untitled");
    const [docID, setDocID] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [sidebar, setSidebar] = React.useState(false);
    const [switchDoc, setSwitchDoc] = React.useState(false);
    const [userDocs, setUserDocs] = React.useState([]);
    const [exportD, setExportD] = React.useState(false);
    const [selectedAccess, setAccess] = React.useState('Anyone');
    const [docsLoaded, setDocsLoaded] = React.useState(false);

    React.useEffect(() => {
        const getDocs = async () => {
            const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();

            const authenticatedCanister = createActor(canisterId, {
                agentOptions: {
                    identity
                },
            });
            const docs = await authenticatedCanister.getUsersDocs();
            const intermDocsArr = [];
            for (var i = 0; i < docs.length; i++) {
                const dnam = await blankspace.getDocName(docs[i]);
                intermDocsArr.push({
                    'doc_id': docs[i],
                    'doc_name': dnam
                })
            }
            setUserDocs(intermDocsArr);
            setDocsLoaded(true);
        }
        setTimeout(getDocs, 7000);
        
    }, []);

    async function deleteDoc(id) {
        setUserDocs(prevDocs => {
            return prevDocs.filter((docItem, index) => {
                return docItem['doc_id'] !== id;
            })
        })
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();

        const authenticatedCanister = createActor(canisterId, {
            agentOptions: {
                identity
            },
        });
        await authenticatedCanister.removeUserDoc(id);
    }

    async function addDoc(id) {
        const newDoc = {
            'doc_id': id,
            'doc_name': 'untitled'
        }

        for (var i = 0; i < userDocs.length; i++) {
            var checkDoc = userDocs[i];
            if (checkDoc['doc_id'] == id) {
                return;
            }
        }

        setUserDocs(prevDocs => [...prevDocs, newDoc])
    }

    const showSidebar = () => setSidebar(!sidebar)

    const modalHandler = async (id) => {
        setOpenModal(prevState => !prevState);
        await blankspace.updateDocAccess(id, selectedAccess);
    }

    const switchDocHandler = () => {
        setSwitchDoc(true);
    }

    const updateDocName = (id, docname) => {
        var updateDocs = [...userDocs];
        for (var i = 0 ; i < updateDocs.length ; i++) {
            var d = updateDocs[i];
            if (d['doc_id'] == id) {
                d['doc_name'] = docname
                break;
            }
        }
        setUserDocs([...updateDocs]);
    }

    React.useEffect(() => {
        if (switchDoc) {
            setTimeout(() => {
                setSwitchDoc(false);
            }, 50)
        }
    }, [switchDoc])

    const exportDocHandler = () => {
        setExportD(true);
    }

    React.useEffect(() => {
        if (exportD) {
            setTimeout(() => {
                setExportD(false);
            }, 1000)
        }
    }, [exportD])



    return (
    <>
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Redirect to={`/blankspace/${uuid()}`} />
                </Route>
                <Route path="/blankspace/:id" exact>
                    <>
                        {openModal == true ? <ShareModal selectedAccess={selectedAccess} setAccess={setAccess} modalHandler={modalHandler} docName={docName} /> : null}
                        <div>
                            {!switchDoc ? <TopBar updateDocName={updateDocName} exportDoc={exportDocHandler} showSidebar={showSidebar} docName={docName} setDocName={setDocName} docID={docID} modalHandler={modalHandler} /> : null}
                            {sidebar ? <SideBar docsLoaded={docsLoaded} deleteDoc={deleteDoc} switchDocHandler={switchDocHandler} docs={userDocs} /> : null}
                            {!switchDoc ? <TextEditor exportD={exportD} docName={docName} docID={docID} setDocID={setDocID} addDoc={addDoc} /> : null}
                        </div>
                    </>
                </Route>
            </Switch>
        </Router>
    </>
);
};

export default App;