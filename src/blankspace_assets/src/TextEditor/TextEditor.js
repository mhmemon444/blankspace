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
  const [connected, setConnected] = useState([]); 
  const [offered, setOffered] = useState([]); 
  const [connectedPeers, setConnectedPeers] = useState([]);
  const offeredRef = useRef([])
  const connectedRef = useRef([])


  useEffect(() => {
    offeredRef.current = offered;
  })

  useEffect(() => {
    connectedRef.current = connected;
  })


  // Remove from current list on exit TODO
  window.addEventListener('beforeunload', async function (e) {
    await blankspace.removeFromCurrent(myPrincipal);
  });

  // Pulling in user id from URL as a hash '#NAME'
  const myPrincipal = location.hash

  // Sets up the wrapper (a div around the quill) for quill front end element
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement('div');
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })
    setQuill(q);
    
  }, [])

  // class to wrap a simple peer object, maintains 
  class MyPeer {
    constructor(recipient, myPrincipal) {
      this.recipient = recipient;
      if (this.recipient.length > 0 ){ 
        setOffered(offered.push(this.recipient))
      }
      this.myPrincipal = myPrincipal;
  
      this.peer = new Peer({
        initiator: this.recipient.length > 0,
        trickle: false,
      });
  
      this.peer.on("signal", async (data) => {
        if (this.recipient.length > 0){
          console.log('SENDING to', this.recipient, data)
          await blankspace.updateCurrentPeers(this.myPrincipal, this.recipient, data.type, data.sdp);
        }
      });
  
      this.peer.on("connect", () => {
        console.log("CONNECTED TO", this.recipient)
        setConnected(connected.push(this.recipient))
        setConnectedPeers((prevconnectedPeers) => [...prevconnectedPeers, this.peer])
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
  }
  
  
  var myPeers = [] 

  useEffect(() => {
    async function activeUserUpdate(){ 
      var peersActive = await blankspace.getActiveUsers();
      var foundMe = false;  
      await blankspace.addToCurrentUsers(myPrincipal); 
      console.log("ACTIVE PEERS", peersActive)
      if (peersActive.length != 0){
        for(let i = 0; i < peersActive.length; i++){
          if(myPrincipal == peersActive[i]){
            foundMe = true; 
          }
          console.log("OFFERED", offered)     
          console.log("CONNECTED", connected)              
          if(myPrincipal != peersActive[i] && foundMe == true){
            if(connected.indexOf(peersActive[i]) === -1 && offered.indexOf(peersActive[i]) === -1  ){
              createOffer(peersActive[i])
              setTimeout(() => { 
                clearOfferNA(peersActive[i])
              }, 20000)
            }
          }
        } 
      }
    }
    const intervalOne = setInterval(activeUserUpdate, 5000);
    return () => clearInterval(intervalOne);
  }, []);


  useEffect(() => {
    async function connectionRequests() {
      var request = await blankspace.getConnectionRequest(myPrincipal);
      if (request.length != 0) {
        if (request[0].typeof == 'offer') {
          console.log('HANDLING OFFER', request)
          handleOffer(request)
        } else {
          console.log('HANDLING ANSWER', request)
          handleAnswer(request)
        }
      }
    }
    const intervalTwo = setInterval( connectionRequests, 2000);
    return () => clearInterval(intervalTwo);
  }, [])

  //if there is no response from an offer, destroy the peer, take back the offer and resend
  function clearOfferNA(recipient){ 
    if(connected.indexOf(recipient) === -1){
      setOffered(offered.filter(function(e) { return e !== recipient}))
      let recipientPeer = myPeers.filter(function(e){ return e.recipient === recipient})
      console.log('Recipient Peer', recipientPeer)
      recipientPeer.peer.destroy()
      myPeers = myPeers.filter(function(e){ return e.recipient !== recipient})
    }
  }

  //TODO: if you have received an offer and a new offer comes in from the same person which already has a peer waiting for it, destroy the current peer and set up a new one 



  // create an offer for a particular recipient 
  function createOffer(recipient){ 
    console.log('RECIPIENT BEING OFFERED', recipient)
    const p = new MyPeer(recipient, myPrincipal)
    myPeers.push(p)
  }

  // when an offer request is recieved from another peer, handle using this function
  function handleOffer(request){ 
    var recipient = request[0].initiator
    var jsonData = {"type":request[0].typeof, "sdp":request[0].sdp}
    var p = new MyPeer("", myPrincipal); 
    p.setRecipient(recipient)
    myPeers.push(p)
    p.peer.signal(jsonData)
  } 

  // when an answer request is received from another peer, handle using this function
  function handleAnswer(request){ 
    var recipient = request[0].initiator; 
    console.log('ANSWER FROM RECIPIENT', recipient)
    var jsonData = {"type":request[0].typeof, "sdp":request[0].sdp}
    console.log('MYPEERS', myPeers)
    for(let i = 0; i < myPeers.length; i++){
      if(recipient == myPeers[i].recipient){
        myPeers[i].peer.signal(jsonData)
      }
    }
  }


  // when text is updated, send to all connected peers
  useEffect(() => {
    if (quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') {
        return;
      }
      // //send delta to peer
      console.log("Connected PEERS", connectedPeers)
      for(let i = 0; i < connectedPeers.length; i++){
        connectedPeers[i].send(JSON.stringify(delta))
      }
      console.log("deltaaaa ", JSON.stringify(delta));

    }

    quill.on('text-change', handler)
    return () => {
      quill.off('text-change', handler)
    }
  }, [quill, connectedPeers]);

  useEffect(() => {
    if (quill == null || delta == null) return;
    quill.updateContents(JSON.parse(delta));
  }, [delta]);

  return (
    <div className="container" ref={wrapperRef}></div>
  );
}