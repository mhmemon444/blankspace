import React, { useState, useEffect } from 'react';
import "./ShareModal.css";
// import { blankspace } from '../../../declarations/blankspace/index';

const ACCESS = {
    'Anyone': 'Anyone with the link can view/edit',
    'Restricted': 'Only specified Principals can access'
}

export default function ShareModal(props) {
    const [selectedAccess, setAccess] = useState('Anyone');

    const selectChangeHandler = (e) => {
        setAccess(e.target.value)
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
                    <select name="access" id="access" style={{border: '1px solid gray'}} onChange={selectChangeHandler}>
                        <option value="Anyone">Anyone</option>
                        <option value="Restricted">Restricted</option>
                    </select>
                    <div style={{fontSize: '12px', color: 'grey', marginTop: '10px'}}>{ACCESS[selectedAccess]}</div>
                    
                    </div>
                </div>
                <div style={{marginTop: '50px', display: 'flex'}}>
                    <button className="copylinkbtn" onClick={props.modalHandler}>Copy Link</button>
                    <button className="donebtn" onClick={props.modalHandler}>Done</button>
                </div>

            </div>
        </div>
    )
}