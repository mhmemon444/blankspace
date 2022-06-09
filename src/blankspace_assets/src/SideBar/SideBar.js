import React, { useState, useEffect } from 'react';
import "./SideBar.css";
import { BrowserRouter as Router, Switch, Route, useParams, Link } from "react-router-dom";
import { blankspace } from '../../../declarations/blankspace/index';
import Child from './Child/Child';


export default function SideBar(props) {
    const [userDocs, setUserDocs] = React.useState([]);
    
    var docList = (props.docs).map(d => <div style={{display: 'flex', marginBottom: '10px'}}><li className="doc-menu-item" onClick={props.switchDocHandler}><Link to={"/documents/"+d['doc_id']}>{d['doc_name']}</Link></li><img className="binimg" src="recycle-bin-line.png"/></div>)

    return (
        <>
            <div className="sideBarPos">
                <div className="navBar">
                    <div>Your Docs:</div>
                    <ul>
                        {docList}
                    </ul>
                    {/* {docList} */}
                    
                </div>
                
            </div>
        </>
    )
}