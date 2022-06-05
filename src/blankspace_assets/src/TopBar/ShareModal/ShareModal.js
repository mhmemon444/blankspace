import React, { useState, useEffect } from 'react';
import "./ShareModal.css";
// import { blankspace } from '../../../declarations/blankspace/index';

export default function ShareModal(props) {

    return (
        <div className="shareModal">
            <div className="modal-main">
                Enter Principal:
                <div>
                    <input type="text" className="enterPrincipalInput"></input>
                </div>
                <div>
                <button onClick={props.modalHandler}>Confirm</button>
                    <button style={{marginLeft: '5px'}} onClick={props.modalHandler}>Close</button>
                </div>
                
            </div>
        </div>
    )
}