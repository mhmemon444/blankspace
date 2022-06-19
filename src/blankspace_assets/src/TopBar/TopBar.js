import React, { useState, useEffect } from 'react';
import "./TopBar.css";
import { blankspace } from '../../../declarations/blankspace/index';
import { useParams } from 'react-router-dom';
import Avatar from './Avatar/Avatar';

export default function TopBar(props) {
    const [active, setActive] = React.useState([]);

    const { id: documentId } = useParams();

    useEffect(() => {
        const getDocName = async () => {
            const dn = await blankspace.getDocName(documentId);
            props.setDocName(dn);
        }
        const getActive = async () => {
            var peersActive = await blankspace.getActiveUsers(documentId);
            peersActive.reverse();
            setActive(peersActive);
        }
        getDocName();
        const intervalp = setInterval(getActive, 10000);
        return () => clearInterval(intervalp);
    }, [])

    const handleDocNameChange = (event) => {
        props.setDocName(event.target.value);
    }

    const saveDocName = async () => {
        console.log("onBlur save hit")
        props.updateDocName(documentId, props.docName);
        await blankspace.updateDocName(documentId, props.docName);
    }

    const shareBtnClickHandler = () => {
        props.modalHandler();
    }

    return (
        <div className="topBar">
            <div>
                <div style={{ display: 'flex' }}>
                    <img onClick={props.showSidebar} src="edit-document.png" style={{ height: "35px", marginRight: "30px", cursor: "pointer" }} />
                    <div style={{ display: 'flex' }}>
                        <input className="docNameInput" type="text" onChange={(e) => handleDocNameChange(e)} value={props.docName} onBlur={saveDocName} />
                    </div>
                </div>
            </div>
            <div className="shareBtnClass">
                <div className="activeee">
                    <span style={{fontSize: '15px', display: 'flex', alignItems: 'center', marginRight: '8px'}}>Active Users:</span> <div style={{display: 'flex', fontSize: '12px', alignItems: 'center'}}>{active.length == 0 ? "Connecting..." : active.map((a, i) => <Avatar a={a} i={i+1}/>)}</div>
                </div>
                <div >
                    <button className="shareBtn" onClick={shareBtnClickHandler}>Share</button>
                    <button className="exportBtn" style={{marginLeft: '5px'}} onClick={props.exportDoc}>Export</button>
                </div>
            </div>

        </div>
    )
}