import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactQuill from 'react-quill';
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import { blankspace } from "../../../declarations/blankspace/index";
import MyPeer from "./MyPeer";
import Peer from "simple-peer";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

export default function TextEditor() {
  
  const [quill, setQuill] = useState()
  const [peer, setPeer] = useState([]);
  const [delta, setDelta] = useState(null);


  const docID = "abcd1111";
  const myPrincipal = "hassan"
  var connected = false;

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement('div');
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })
    setQuill(q);
    
  }, [])

  //document onload:
  useEffect(async () => {

    const p = new Peer({
      initiator: location.hash === '#1',
      trickle: false
    })

    setPeer(p);

    //if initator, look for answers
    if (location.hash === '#1') {
      var i = setInterval(async () => {
        var s = await blankspace.getSignal(docID);
        if (s != "empty") {
          s = JSON.parse(s);
          if (s.type == "answer") {
            p.signal(s);
            clearInterval(i);
          }
        }
      }, 2000)
    }

    p.on('error', err => console.log('error', err))

    p.on('signal', async (data) => {
      console.log('SIGNAL', JSON.stringify(data))
      await blankspace.updateSignal(docID, JSON.stringify(data));
      const s = await blankspace.getSignal(docID);
      console.log("from MOTOKOOOOOO: ", s);
      // document.querySelector('#outgoing').textContent = JSON.stringify(data)
    })

    if (location.hash != '#1') {
      const s = await blankspace.getSignal(docID);
      if (s != "empty") p.signal(JSON.parse(s));
    }

    p.on('connect', () => {
      console.log('CONNECT')
      connected = true;
      console.log("connected p.on ", connected);
      // p.send('whatever' + Math.random())
    })

    p.on('data', delta => {
      console.log('delta: ' + delta)
      setDelta(delta)
    })
  }, []);

  useEffect(() => {
    if (quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') {
        return;
      }
      // //send delta to peer

      peer.send(JSON.stringify(delta));
      console.log("deltaaaa ", JSON.stringify(delta));

    }

    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [quill]);

  useEffect(() => {
    if (quill == null || delta == null) return;
    quill.updateContents(JSON.parse(delta));
  }, [delta]);

  return (
    <div className="container" ref={wrapperRef}></div>
  );
}