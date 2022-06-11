import React, { useState, useEffect } from 'react';
import "./SideBar.css";
import { BrowserRouter as Router, Switch, Route, useParams, Link } from "react-router-dom";
import { blankspace } from '../../../declarations/blankspace/index';
import Child from './Child/Child';


export default function SideBar(props) {

    return (
        <>
            <div className="sideBarPos">
                <div className="navBar">

                    <div>Your Docs:</div>
                    <Link to="/">
                        <button className="newdocbtn" type="button">
                            <div style={{display: 'flex', paddingTop: '2px', paddingBottom: '2px'}}><img src="plus-line.png" style={{height: '10px', marginBottom: '4px'}}/>
                            <span style={{marginLeft: '5px'}}>New Document</span></div>
                        </button>
                        {/* <div style={{width: '50px', height: '50px', backgroundColor: 'black'}}></div> */}
                    </Link>
                    <ul>
                        {(props.docs).map(d => <div style={{ display: 'flex', marginBottom: '10px' }}><li className="doc-menu-item" onClick={props.switchDocHandler}><Link to={"/documents/" + d['doc_id']}>{d['doc_name']}</Link></li><img className="binimg" onClick={() => props.deleteDoc(d['doc_id'])} src="recycle-bin-line.png" /></div>)}
                    </ul>
                    {/* {docList} */}

                </div>

            </div>
        </>
    )
}