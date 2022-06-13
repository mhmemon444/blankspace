import React, { useState, useEffect } from 'react';
import "./TopBar.css";
import { blankspace } from '../../../declarations/blankspace/index';
import { useParams } from 'react-router-dom';

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
            setActive(peersActive);
        }
        getDocName();
        const intervalp = setInterval(getActive, 2000);
        return () => clearInterval(intervalp);
    }, [])

    const handleDocNameChange = (event) => {
        props.setDocName(event.target.value)
    }

    const saveDocName = async () => {
        console.log("onBlur save hit")
        await blankspace.updateDocName(documentId, props.docName);
    }

    const shareBtnClickHandler = () => {
        props.modalHandler();
    }

    return (
        <div className="topBar">
            <div>
                <div style={{ display: 'flex' }}>
                    <img onClick={props.showSidebar} src="sidebar-icon-17.jpg" style={{ height: "20px", marginRight: "50px", cursor: "pointer" }} />
                    <input className="docNameInput" type="text" onChange={(e) => handleDocNameChange(e)} value={props.docName} onBlur={saveDocName} />
                </div>
                <div style={{ fontSize: '10px', marginLeft: '70px' }}>{documentId}</div>
            </div>
            <div>
                Active: {active}
            </div>
            <div className="shareBtnClass">
                <button className="shareBtn" onClick={shareBtnClickHandler}>Share</button>
            </div>
        </div>
    )
}