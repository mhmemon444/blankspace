import React, { useState, useEffect } from 'react';
import "./TopBar.css";
import { blankspace } from '../../../declarations/blankspace/index';

export default function TopBar(props) {
    const handleDocNameChange = (event) => {
        props.setDocName(event.target.value)
    }

    const saveDocName = async () => {
        console.log("onBlur save hit")
        await blankspace.updateDocName(props.docID, props.docName);
    }

    const shareBtnClickHandler = () => {
        props.modalHandler();
    }

    return (
        <div className="topBar">
            <div>
                <div style={{display: 'flex'}}>
                <img onClick={props.showSidebar} src="sidebar-icon-17.jpg" style={{height: "20px", marginRight: "50px", cursor: "pointer"}}/>
                <input className="docNameInput" type="text" onChange={(e) => handleDocNameChange(e)} value={props.docName} onBlur={saveDocName} />
                </div>
                <div style={{fontSize: '10px', marginLeft: '70px'}}>{props.docID}</div>
            </div>
            <div className="shareBtnClass">
                <button className="shareBtn" onClick={shareBtnClickHandler}>Share</button>
            </div>
        </div>
    )
}