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
    const [docName, setDocName] = React.useState("Untitled");
    const [docID, setDocID] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [sidebar, setSidebar] = React.useState(false);
    const [switchDoc, setSwitchDoc] = React.useState(false);
    const [userDocs, setUserDocs] = React.useState([]);
    const [exportD, setExportD] = React.useState(false);
    const [overallQuill, setOverallQuill] = React.useState();

    React.useEffect(() => {
        const getDocs = async () => {
            console.log('myPrincipal: ', myPrincipal);
            const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();

            const authenticatedCanister = createActor(canisterId, {
                agentOptions: {
                    identity
                },
            });
            const docs = await authenticatedCanister.getUsersDocs(myPrincipal);
            console.log('docssssssssssFromPRincipallllllllll: ', docs);
            const intermDocsArr = [];
            for (var i = 0; i < docs.length; i++) {
                const dnam = await blankspace.getDocName(docs[i]);
                console.log('dnam: ', dnam);
                intermDocsArr.push({
                    'doc_id': docs[i],
                    'doc_name': dnam
                })
                console.log('intermDocsArr: ', intermDocsArr);
            }
            setUserDocs(intermDocsArr);
        }
        // getDocs();
        const getDocsInterval = setInterval(getDocs, 5000);
        return () => clearInterval(getDocsInterval);
        // getDocs();
    }, []);


    React.useEffect(() => {
        console.log("userDocs : ", userDocs);
    }, [userDocs])

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
        await authenticatedCanister.removeUserDoc(myPrincipal, id);
    }

    async function addDoc(id) {
        const newDoc = {
            'doc_id': id,
            'doc_name': 'Untitled'
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

    const modalHandler = () => {
        setOpenModal(prevState => !prevState);
    }

    React.useEffect(() => {
        console.log("openModaL : ", openModal);
    }, [openModal])

    const switchDocHandler = () => {
        setSwitchDoc(true);
    }

    // const updateDocName = (id, docname) => {
    //     var updateDocs = [...userDocs];
    //     for (var i = 0 ; i < updateDocs.length ; i++) {
    //         var d = updateDocs[i];
    //         if (d['doc_id'] == id) {
    //             d['doc_name'] = docname
    //             break;
    //         }
    //     }
    //     setUserDocs([...updateDocs]);
    // }

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
                    <Redirect to={`/blankspace/${uuid()}`} />
                </Route>
                <Route path="/blankspace/:id" exact>
                    {/* <TextEditor /> */}
                    <>
                        {openModal == true ? <ShareModal modalHandler={modalHandler} /> : null}
                        <div>
                            {!switchDoc ? <TopBar exportDoc={exportDocHandler} showSidebar={showSidebar} docName={docName} setDocName={setDocName} docID={docID} modalHandler={modalHandler} /> : null}
                            {sidebar ? <SideBar deleteDoc={deleteDoc} switchDocHandler={switchDocHandler} docs={userDocs} /> : null}
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