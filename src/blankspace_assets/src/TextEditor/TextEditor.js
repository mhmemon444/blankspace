import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import { blankspace } from "../../../declarations/blankspace/index";
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

  const [quill, setQuill] = useState()
  const [delta, setDelta] = useState(null);
  const [peers, setPeers] = useState([]); 
  const [connected, setConnected] = useState([]); 
  const [offered, setOffered] = useState([]);
  

  window.addEventListener('beforeunload', async function (e) {
    await blankspace.removeFromCurrent(myPrincipal);
  });

  const docID = "abcd1111";
  const myPrincipal = location.hash

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement('div');
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })
    setQuill(q);
    
  }, [])

  class MyPeer {
    constructor(recipient, myPrincipal) {
      this.recipient = recipient;
      this.myPrincipal = myPrincipal;
  
      this.peer = new Peer({
        initiator: this.recipient.length > 0,
        trickle: false,
      });
  
      this.peer.on("signal", async (data) => {
        if (this.recipient.length > 0){
          // console.log("SENDING", data, recipient)
          await blankspace.updateCurrentPeers(this.myPrincipal, this.recipient, data.type, data.sdp);
        }
      });
  
      this.peer.on("connect", () => {
        // console.log("CONNECTED TO", this.recipient);
        setConnected((prevConnected) => [...prevConnected, this.recipient])
      });
  
      this.peer.on('data', delta => {
        console.log('delta: ' + delta)
        setDelta(delta)
      })

      this.peer.on("error", (err) => console.log("error", err));
    }
  
    setRecipient(recipient) {
      this.recipient = recipient;
    }
  
    getPeer() {
      return this.peer;
    }
  
    sendDeltas(delta) {
      console.log('delta sending', delta)
      this.peer.send(delta);
    }
  }

  useEffect(() => {
    console.log('Offered to peer', offered)
  }, [offered]);
  
  // Once connected to a peer, add them to the connected list 
  useEffect(() => {
    console.log('Connected to peer', connected)
  }, [connected]);

  // Once you create a peer to represent another user, add them to the peers list 
  useEffect(() => {
    console.log('ADDING PEER', peers)
  }, [peers]);
  
  
  var myPeers = [] 
  //document onload:
  useEffect(async () => {
    var myOffered = [] 
    setInterval( async () => { 
      var peersActive = await blankspace.getActiveUsers();
      var foundMe = false;  
      await blankspace.addToCurrentUsers(myPrincipal); 
      // console.log("ACTIVE PEERS", peersActive)
      if (peersActive.length != 0){
        for(let i = 0; i < peersActive.length; i++){
          if(myPrincipal == peersActive[i]){
            foundMe = true; 
            // console.log('FOUND ME TRUE')
          }
          // console.log("OFFERED", offered)
          if(myPrincipal != peersActive[i] && foundMe == true && connected.indexOf(peersActive[i]) === -1 && myOffered.indexOf(peersActive[i]) === -1  ){
            // console.log('ADDING A USER')
            const p = new MyPeer(peersActive[i], myPrincipal)
            myOffered.push(peersActive[i])
            // setOffered((prevOffers) => [...prevOffers, peersActive[i]])
            setPeers((prevPeers) => [...prevPeers, p])
            myPeers.push(p)
          }
        }
      }
    }, 5000); 
  
    setInterval( async () => { 
      var request = await blankspace.getConnectionRequest(myPrincipal); 
      console.log("REQUEST", request)
      if (request.length != 0){ 
        if (request[0].typeof == 'offer'){
          // console.log('HANDLING OFFER', request)
          handleOffer(request)
        } else {
          // console.log('HANDLING ANSWER', request)
          handleAnswer(request)
        }
      }
    }, 1000);

  }, []);


  function handleOffer(request){ 
    var recipient = request[0].initiator
    var jsonData = {"type":request[0].typeof, "sdp":request[0].sdp}
    var p = new MyPeer("", myPrincipal); 
    p.setRecipient(recipient)
    setPeers((prevPeers) => [...prevPeers, p])
    myPeers.push(p)
    p.getPeer().signal(jsonData)
  } 

  function handleAnswer(request){ 
    var recipient = request[0].initiator; 
    // console.log('RECIPIENT', recipient)
    var jsonData = {"type":request[0].typeof, "sdp":request[0].sdp}
    // console.log('JSONDATA', jsonData)
    for(let i = 0; i < myPeers.length; i++){
      if(recipient == myPeers[i].recipient){
        myPeers[i].getPeer().signal(jsonData)
      }
    }
  }

  useEffect(() => {
    if (quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') {
        return;
      }
      // //send delta to peer
      console.log("PEERS", peers)
      for(let i = 0; i < peers.length; i++){
        peers[i].sendDeltas(JSON.stringify(delta))
      }
      console.log("deltaaaa ", JSON.stringify(delta));

    }

    quill.on('text-change', handler)
    return () => {
      quill.off('text-change', handler)
    }
  }, [quill, peers]);

  useEffect(() => {
    if (quill == null || delta == null) return;
    quill.updateContents(JSON.parse(delta));
  }, [delta]);

  return (
    <div className="container" ref={wrapperRef}></div>
  );
}