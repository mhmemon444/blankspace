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
                <input className="docNameInput" type="text" onChange={(e) => handleDocNameChange(e)} value={props.docName} onBlur={saveDocName} />
                <div style={{fontSize: '10px', marginLeft: '2px'}}>{props.docID}</div>
            </div>
            <div className="shareBtnClass">
                <button className="shareBtn" onClick={shareBtnClickHandler}>Share</button>
            </div>
        </div>
    )
}