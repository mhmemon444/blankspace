import React, { useState, useEffect } from 'react';
import "./SideBar.css";
import { blankspace } from '../../../declarations/blankspace/index';

export default function SideBar(props) {
    var docList = (props.docs).map(d => <div style={{fontSize: '8px'}}>{d}</div>)

    return (
        <>
        <div className="navBar">
            <div>Your Docs:</div>
            {docList}
        </div>
        </>
    )
}