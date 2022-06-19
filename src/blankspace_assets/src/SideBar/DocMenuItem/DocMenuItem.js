import React from 'react';
import { BrowserRouter as Router, Switch, Route, useParams, Link } from "react-router-dom";

export default function DocMenuItem(props) {

  const { id: documentId } = useParams();

  return (
      <div style={{ display: 'flex', marginTop: '10px', position: 'relative' }}>
        <img className="sideimg" src="paper.png" style={{height: '12px', marginRight: '10px'}}/>
        <span className="doc-menu-item" onClick={props.d['doc_id'] == documentId ? null : props.switchDocHandler}>{props.d['doc_id'] == documentId ? <strong>{props.d['doc_name']}</strong> : <Link to={"/documents/" + props.d['doc_id']}>{props.d['doc_name']}</Link>}</span>
        <img className="binimg sideimg" onClick={() => props.deleteDoc(d['doc_id'])} src="darkredbin.png" />
      </div>
  );
}