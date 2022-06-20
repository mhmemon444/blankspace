import React, { useState, useEffect } from 'react';
import "./SideBar.css";
import { BrowserRouter as Router, Switch, Route, useParams, Link } from "react-router-dom";
import DocMenuItem from './DocMenuItem/DocMenuItem';



export default function SideBar(props) {
    //Get URL params e.g. docID
  const { id: documentId } = useParams();

    return (
        <>
            <div className="sideBarPos">
                <div className="navBar">
                <Link to="/">
                        <button className="newdocbtn" type="button">
                            <div style={{display: 'flex', paddingTop: '2px', paddingBottom: '2px'}}><img src="plus-line.png" style={{height: '10px', marginBottom: '4px'}}/>
                            <span style={{marginLeft: '5px'}}>New Document</span></div>
                        </button>
                    </Link>
                    <div style={{fontSize: '16px', marginTop: '10px'}}>Recent Docs:</div>
                    

                        {(props.docs).map(d => <DocMenuItem d={d} switchDocHandler={props.switchDocHandler} deleteDoc={props.deleteDoc}/>)}
                        {props.docsLoaded ? null : <span id="docsloadingmsg" style={{fontSize: '12px'}}>Loading...</span>}

                </div>

            </div>
        </>
    )
}