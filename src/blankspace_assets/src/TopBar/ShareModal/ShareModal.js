import React, { useState, useEffect } from 'react';
import "./ShareModal.css";
import { blankspace } from '../../../../declarations/blankspace/index';
import { BrowserRouter as Router, Switch, Route, useParams, Link } from "react-router-dom";
// import { blankspace } from '../../../declarations/blankspace/index';

const ACCESS = {
    'Anyone': 'Anyone with the link can view/edit',
    'Restricted': 'Only specified Principals can access (coming soon!)'
}

export default function ShareModal(props) {
    const [copy, setCopy] = useState(false);

    const { id: documentId } = useParams();

    useEffect(() => {
        async function getAccess() {
            var access = await blankspace.getDocAccess(documentId);
            props.setAccess(access);
        }
        getAccess();
    }, [])

    const selectChangeHandler = (e) => {
        props.setAccess(e.target.value)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.toString());
        setCopy(true);
    }

    const doneHandler = async (id) => {
        props.modalHandler(id);
    }

    return (
        <div className="shareModal">
            <div className="modal-main">
                Share '{props.docName}'
                <div>
                    <input type="text" style={{border: '1px solid gray'}} className="enterPrincipalInput" placeholder="Enter Principal"></input>
                </div>
                <div className="accessRes">
                    Access Settings
                    <div style={{marginTop: '5px', marginBottom: '5px'}}>
                    <select name="access" id="access" style={{border: '1px solid gray'}} onChange={selectChangeHandler} value={props.selectedAccess}>
                        <option value="Anyone">Anyone</option>
                        <option value="Restricted">Restricted</option>
                    </select>
                    <div style={{fontSize: '12px', color: 'grey', marginTop: '10px'}}>{ACCESS[props.selectedAccess]}</div>
                    
                    </div>
                </div>
                <div style={{marginTop: '50px', display: 'flex'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <button className="copylinkbtn" onClick={copyToClipboard}>Copy Link</button>
                        {copy ? <div className="copiedMsg">Copied to clipboard!</div> : null}
                    </div>
                    
                    <button className="donebtn" onClick={() => doneHandler(documentId)}>Done</button>
                </div>

            </div>
        </div>
    )
}