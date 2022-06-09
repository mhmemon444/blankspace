import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import { blankspace } from "../../../declarations/blankspace/index";
import Peer from "simple-peer";
import { uuid } from 'uuidv4';

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

export default function TextEditor(props) {
  const [quill, setQuill] = useState()
  const [delta, setDelta] = useState(null);
  const [connected, setConnected] = useState([]); 
  const [offered, setOffered] = useState([]); 
  const [connectedPeers, setConnectedPeers] = useState([]);

  // NOTE: this was my attempt at removing users from an active user, here when a user xs out they get disconnected 
  // although there should be another approach? maybe a button a user clicks on the front end to deactivate connected mode? 
  // Remove from current list on exit TODO
  window.addEventListener('beforeunload', async function (e) {
    for(let i = 0; i < connectedPeers.length; i++){ 
      connectedPeers[i].destroy(); 
    }
    await blankspace.removeFromActive(uniqueID, myPrincipal); 
  });

  const startuptext = "Welcome to blankspace... this is our welcome message, connecting you to any available peers...";
  // Pulling in user id from URL as a hash '#NAME'
  const myPrincipal = location.hash
  let uniqueID = "7410bc5d-b83a-4b65-8627-b874472c7731";

  // Sets up the wrapper (a div around the quill) for quill front end element
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement('div');
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })
    q.setContents({"ops": [{"insert": startuptext, "attributes": {"bold": true}}]})
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
        // see if there is a way to remove connected list (only maintain connectedPeers and myPeers)
        console.log("CONNECTED TO", this.recipient)
        setConnected(connected.push(this.recipient))
        setConnectedPeers((prevConnected) => [...prevConnected, this])
        const index = offered.indexOf(recipient)
        setOffered(offered.splice(index, 1))
      });
  
      this.peer.on('data', delta => {
        console.log('delta: ' + delta)
        setDelta(delta)
      })

      this.peer.on("error", (err) => {
        console.log("Error for Peer", this.recipient)
        var index = offered.indexOf(this.recipient)
        setOffered(offered.splice(index, 1))
        index = connected.indexOf(this.recipient)
        setConnected(connected.splice(index, 1))
        let rec = this.recipient
        setConnectedPeers(prevConnected => prevConnected.filter(function(e){ return e.recipient !== rec}))
      });
    }

    getPeer(){ 
      return this.peer;
    }
  
    setRecipient(recipient) {
      this.recipient = recipient;
    }
  }

  //TODO: Loop through connectedpeers to check if they're still connected -- double check that when a peer breaks( for whatever reason ) it is getting correctly removed from connectedPeers
  
  var myPeers = [] 

  useEffect(() => {
    //check if new doc (empty doc ID) -> later expand to react router url params
    // const uniqueID = uuid();
    // const uniqueID = "7410bc5d-b83a-4b65-8627-b874472c7731";
    const addNewDoc = async () => {
      if (props.docID == "") {
        props.setDocID(uniqueID);
        await blankspace.updateUsersDocs(myPrincipal, uniqueID);
      }
    }

    addNewDoc();
    

    async function activeUserUpdate(){ 
      // get active users from motoko
      console.log("Props.docID", uniqueID)
      var peersActive = await blankspace.getActiveUsers(uniqueID);
      var foundMe = false;  

      if (!peersActive.includes(myPrincipal)){ 
        await blankspace.addToCurrentUsers(uniqueID, myPrincipal); 
      }
      //add myself to the current users (if im not already added)
      


      console.log("ACTIVE PEERS", peersActive)

      // if there are peers which have also connected 
      if (peersActive.length != 0){
        for(let i = 0; i < peersActive.length; i++){

          //only create offers for users which come after me in the list 
          if(myPrincipal == peersActive[i]){
            foundMe = true; 
          }

          console.log("OFFERED", offered)     
          console.log("CONNECTED", connected)
          console.log("MY PEERS", myPeers)
    
          if(myPrincipal != peersActive[i] && foundMe == true){
            if(connected.indexOf(peersActive[i]) === -1 && offered.indexOf(peersActive[i]) === -1  ){
              // create an offer for this recipient 
              createOffer(peersActive[i])
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
      //get connections which have been sent for my principal  
      var request = await blankspace.getConnectionRequest(myPrincipal);

      if (request.length != 0) {
        //if the request is an offer, prepare to send an answer, otherwise if it is an answer, try to connect 
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
    // if recipient hasnt connected 
    if(connected.indexOf(recipient) === -1){
      //remove from offered and from myPeers to create a new offer 
      const index = offered.indexOf(recipient)
      setOffered(offered.splice(index, 1))

      //kill the peer first 
      let recipientPeer = myPeers.filter(function(e){ return e.recipient === recipient})
      recipientPeer[0].getPeer().destroy()
      myPeers = myPeers.filter(function(e){ return e.recipient !== recipient})
    }
  }

  // create an offer for a particular recipient 
  function createOffer(recipient){ 

    //only create offer is a peer/offer does not already exist for that recipient 
    var createdPeer = false 
    for (let i =0; i < myPeers.length; i++){
      if (recipient === myPeers[i].recipient){
        createdPeer = true
      }
    }
    if(offered.indexOf(recipient) === -1 && createdPeer === false){
      console.log('RECIPIENT BEING OFFERED', recipient)
      const p = new MyPeer(recipient, myPrincipal)
      myPeers.push(p)
      // create a 30 second wait to delete offer if no answer is recieved 
      setTimeout(() => { 
        clearOfferNA(recipient)
      }, 30000)
    }
  }

  // when an offer request is recieved from another peer, handle using this function, ensuring to remove a previous peer created from them
  function handleOffer(request){ 
    var recipient = request[0].initiator
    destroyPeer(recipient)
    // create a peer for this particular offer, add to myPeers list, and signal back 
    var jsonData = {"type":request[0].typeof, "sdp":request[0].sdp}
    var p = new MyPeer("", myPrincipal); 
    p.setRecipient(recipient)
    myPeers.push(p)
    p.peer.signal(jsonData)
  } 

  function destroyPeer(recipient){ 
    var createdPeer = false 
    for (let i =0; i < myPeers.length; i++){
      if (recipient === myPeers[i].recipient){
        createdPeer = true
      }
    }
    if(createdPeer){
      console.log('destroyed')
      var killPeer = myPeers.filter(function(e){ return e.recipient === recipient})
      killPeer[0].getPeer().destroy()
      myPeers = myPeers.filter(function(e){ return e.recipient !== recipient})
    }
  }

  // when an answer request is received from another peer, handle using this function
  function handleAnswer(request){ 
    // if its an answer, signal back that you have received the answer and connect (connection happens through the signal)
    var recipient = request[0].initiator; 
    console.log('ANSWER FROM RECIPIENT', recipient)
    var jsonData = {"type":request[0].typeof, "sdp":request[0].sdp}
    console.log('MYPEERS', myPeers)
    for(let i = 0; i < myPeers.length; i++){
      if(recipient == myPeers[i].recipient){
        myPeers[i].getPeer().signal(jsonData)
      }
    }
  }

  useEffect(() => { 
    const sendDoc = async () => { 
      var head = await blankspace.getFirst(uniqueID);  
      console.log('HEAD', head); 
      var delta = quill.getContents(); 
      console.log('DOC DELTA', delta)
      if(head == myPrincipal){ 
        for (let i = 0; i < connectedPeers.length; i++){ 
          connectedPeers[i].getPeer().send(JSON.stringify(delta))
        }
      }
    }
    sendDoc();
  }, [connectedPeers]); 

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
        connectedPeers[i].getPeer().send(JSON.stringify(delta))
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
    var json = JSON.parse(delta)
    var val = json.ops[0]
    console.log('JSON', json)
    console.log('json insert', json.ops[0])
    if(json.ops[0].hasOwnProperty('insert')){
      console.log('IN THE INSERT IF ')
      if(val.insert.length > 1){
        quill.setContents(JSON.parse(delta))
      } else { 
        quill.updateContents(JSON.parse(delta));
      }
    } else { 
      quill.updateContents(JSON.parse(delta));
    }

  }, [delta]);

  return (
    <div className="container" ref={wrapperRef}></div>
  );
}