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

export default function TextEditor() {

  // var peers = [];
  const [quill, setQuill] = useState()
  const [peer, setPeer] = useState()


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
  useEffect( async () => {
    // let peer = new MyPeer("", myPrincipal)
    // peers.push(peer)
    // setInterval(listenForRequests(docID), 1000);
    const p = new Peer({
      initiator: location.hash === '#1',
      trickle: false
    })

    setPeer(p);

    //if initator, look for answers
    if (location.hash === '#1') {
      var i = setInterval( async () => {
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
      quill.updateContents(delta);
    })

  }, []);


  // async function SignalReceive(documentID) {
  //   try {
  //     var connectionDetails = await blankspace.getConnectionDetails(documentID)
  //     console.log("In signal receive checking data", data)
  //     var jsonData = {"type":connectionDetails[0].typeof, "sdp":connectionDetails[0].sdp}
  //     return {initiator: connectionDetails[0].initiator, connectionDetails: jsonData};
  //   } catch(e) {
  //     return null;
  //   }
  // }

  // async function listenForRequests(documentID){
  //   let request = await SignalReceive(documentID)
  //   recipient = request.initiator; 
  //   peers[peers.length - 1].setRecipient(recipient)
  //   if(recipient != null) { 
  //     peers[peers.length - 1].getPeer().signal(message.connectionDetails);
  //     peer = new MyPeer("", username)
  //     peers.push(peer)
  //   }
  // }

  useEffect(() => {
    if (quill == null) return;
    // const handler = (delta, oldDelta, source) => {
    //   if (source !== 'user') {
    //     return;
    //   }
    //   //send delta to peer
    //   p.send(delta);
    // }

    const handler = (delta, oldDelta, source) => {
      // if (source !== 'user') {
      //   return;
      // }
      // //send delta to peer
      peer.send(delta);
      console.log("deltaaaa ", delta);
      
    }

    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
    // quill.on('text-change', handler)
  }, [quill]);

  // useEffect(() => {
  //   if (quill == null) return;
  //   const handler = delta => {
  //     quill.updateContents(delta)
  //   }

  //   //receive changes from peers
  // }, [quill]);



  // async function set() {
  //     await blankspace.settext(value);
  //     console.log(value);
  // }

  // async function get() {
  //     var t = await blankspace.gettext();
  //     console.log("text: ", t);
  //     setValue(t);
  //     return t;
  // }



  // useEffect(() => {
  //   if (isMounted.current) {
  //     set();
  //   } else {
  //     isMounted.current = true;
  //   }
  // }, [value]);



  return (
    <div className="container" ref={wrapperRef}></div>
  );
}