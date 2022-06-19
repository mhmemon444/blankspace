import React, { useState, useEffect } from 'react';
import "./SideBar.css";
import { BrowserRouter as Router, Switch, Route, useParams, Link } from "react-router-dom";
import DocMenuItem from './DocMenuItem/DocMenuItem';
import { blankspace } from '../../../declarations/blankspace/index';
import Child from './DocMenuItem/DocMenuItem';


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
                        {/* <div style={{width: '50px', height: '50px', backgroundColor: 'black'}}></div> */}
                    </Link>
                    <div style={{fontSize: '16px', marginTop: '10px'}}>Recent Docs:</div>
                    

                        {/* {(props.docs).map(d => <div style={{ display: 'flex', marginBottom: '10px' }}><span className="doc-menu-item" onClick={d['doc_id'] == documentId ? null : props.switchDocHandler}>{d['doc_id'] == documentId ? <strong>{d['doc_name']}</strong> : <Link to={"/documents/" + d['doc_id']}>{d['doc_name']}</Link>}</span><img className="binimg" onClick={() => props.deleteDoc(d['doc_id'])} src="recycle-bin-line.png" /></div>)} */}
                        {(props.docs).map(d => <DocMenuItem d={d} switchDocHandler={props.switchDocHandler} deleteDoc={props.deleteDoc}/>)}
                    {/* {docList} */}

                </div>

            </div>
        </>
    )
}