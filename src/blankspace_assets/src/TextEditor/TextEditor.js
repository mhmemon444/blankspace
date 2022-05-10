import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactQuill from 'react-quill';
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import { blankspace } from "../../../declarations/blankspace/index";
import MyPeer from "./MyPeer";
import Peer from "simple-peer";
import { off } from "process";

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

  // var peers = [];
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

  const addPeer = (isInitiator, peer) => {
    const p = new Peer({
        initiator: isInitiator,
        trickle: false
      })
    
    // //if initator, look for answers
    // if (location.hash === '#1') {
    //   var i = setInterval(async () => {
    //     var s = await blankspace.getSignal(docID);
    //     if (s != "empty") {
    //       s = JSON.parse(s);
    //       if (s.type == "answer") {
    //         p.signal(s);
    //         // clearInterval(i);
    //       }
    //     }
    //   }, 2000)
    // }


    p.on('error', err => console.log('error', err))

    p.on('signal', async (data) => {
      console.log('SIGNAL', JSON.stringify(data))
      await blankspace.updateUserSignal(peer, JSON.stringify(data));
      const s = await blankspace.getSignal(peer);
      console.log("from MOTOKOOOOOO: ", s);
      // document.querySelector('#outgoing').textContent = JSON.stringify(data)
    })

    // if (location.hash != '#1') {
    //   const s = await blankspace.getSignal(docID);
    //   if (s != "empty") p.signal(JSON.parse(s));
    // }

    // p.on('connect', () => {
    //   console.log('CONNECT')
    //   connected = true;
    //   console.log("connected p.on ", connected);
    //   // p.send('whatever' + Math.random())
    // })

    // p.on('data', delta => {
    //   console.log('delta: ' + delta)
    //   setDelta(delta)
    //   // quill.updateContents(JSON.parse(delta));
    //   // console.log("quill: ", quill);
    //   // quill.updateContents(new Delta()
    //   //   .retain(6)                  // Keep 'Hello '
    //   //   .delete(5)                  // 'World' is deleted
    //   //   .insert('Quill')
    //   //   .retain(1, { bold: true })  // Apply bold to exclamation mark
    //   // );
    // })
  }
  //document onload:
  useEffect(async () => {
    console.log("curUsersOnDoc: ", await blankspace.getActiveUsers());














    // await blankspace.addPeerOnDoc(docID, location.hash);
    
    ///////////////////////////////////////CURR PROGRESS START
    // const x = await blankspace.getCurrentPeersOnDoc(docID); //["hassan"]
    // console.log(x);

    

    // console.log("start answerCandidates: ", await blankspace.getAnswerCandidates(localUser));

    // if (x.length > 0) { //if other peers on doc, you are an offerCandidate to them and they are answerCandidates to you
    //   for (var i = 0; i<x.length; i++) { //for each peer already on doc
    //     //add peer to your answerCandidates, and add yourself to their offerCandidates
    //     var remotePeer = x[i];
    //     await blankspace.addAnswerCandidate(localUser, remotePeer);
    //     await blankspace.addOfferCandidate(remotePeer, localUser);
    //   }
    // } else { //no other peers on doc (you are the first and only one currently on doc)
    //   await blankspace.addPeerOnDoc(docID, localUser);
    // }

    
    ///////////////////////////////////////CURR PROGRESS END



    //continuously poll for offer candidates
    // setInterval(async () => {
    //   const offerCandidates = await blankspace.getOfferCandidates(localUser);
    //   console.log("offerCandidates: ", offerCandidates);

    //   if (offerCandidates.length > 0) {  //if user has offer candidates, send offer to connect 
    //     for (var i = 0 ; i < offerCandidates.length ; i++) {
    //       addPeer(true, localUser)
    //     }
        
    //   }
      
    // }, 3000);

    // console.log("answerCandidates: ", await blankspace.getAnswerCandidates(localUser));


    //continuously poll currentPeersOnDoc - whenever new peer joins, addPeer (initiator: location.hash != newPeerHash)
    // setInterval(async () => {
    //   const x = await blankspace.getCurrentPeersOnDoc(docID);
    //   console.log("x: ", x);
    // }, 2000)
    // let peer = new MyPeer("", myPrincipal)

    // peers.push(peer)

    // setInterval(listenForRequests(docID), 1000);

    // const p = new Peer({
    //   initiator: location.hash === '#1',
    //   trickle: false
    // })

    // setPeer(p);

    // //if initator, look for answers
    // if (location.hash === '#1') {
    //   var i = setInterval(async () => {
    //     var s = await blankspace.getSignal(docID);
    //     if (s != "empty") {
    //       s = JSON.parse(s);
    //       if (s.type == "answer") {
    //         p.signal(s);
    //         clearInterval(i);
    //       }
    //     }
    //   }, 2000)
    // }


    // p.on('error', err => console.log('error', err))

    // p.on('signal', async (data) => {
    //   console.log('SIGNAL', JSON.stringify(data))
    //   await blankspace.updateSignal(docID, JSON.stringify(data));
    //   const s = await blankspace.getSignal(docID);
    //   console.log("from MOTOKOOOOOO: ", s);
    //   // document.querySelector('#outgoing').textContent = JSON.stringify(data)
    // })

    // if (location.hash != '#1') {
    //   const s = await blankspace.getSignal(docID);
    //   if (s != "empty") p.signal(JSON.parse(s));
    // }

    // p.on('connect', () => {
    //   console.log('CONNECT')
    //   connected = true;
    //   console.log("connected p.on ", connected);
    //   // p.send('whatever' + Math.random())
    // })

    // p.on('data', delta => {
    //   console.log('delta: ' + delta)
    //   setDelta(delta)
    //   // quill.updateContents(JSON.parse(delta));
    //   // console.log("quill: ", quill);
    //   // quill.updateContents(new Delta()
    //   //   .retain(6)                  // Keep 'Hello '
    //   //   .delete(5)                  // 'World' is deleted
    //   //   .insert('Quill')
    //   //   .retain(1, { bold: true })  // Apply bold to exclamation mark
    //   // );
    // })

    

  }, []);

  // const prevPeersRef = useRef();

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
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') {
        return;
      }
      // //send delta to peer

      // peer.send(JSON.stringify(delta));
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