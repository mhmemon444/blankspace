import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import { blankspace, canisterId, createActor } from "../../../declarations/blankspace/index";
import Peer from "simple-peer";
import { uuid } from 'uuidv4';
import { useParams } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client"; //@dfinity/authentication and @dfinity/identity
import myPrincipal from "../constants/userid";
import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';

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
  const [quillLoaded, setQuillLoaded] = useState(false);

  window.addEventListener('beforeunload', async function (e) {
    for(let i = 0; i < connectedPeers.length; i++){ 
      connectedPeers[i].close(); 
    }
    await blankspace.removeFromActive(documentId, myPrincipal);
  });

  //Get URL params e.g. docID
  const { id: documentId } = useParams();

  const startuptext = "Welcome to your blank space..."; 
  // Pulling in user id from URL as a hash '#NAME'

  useEffect(() => {       
		//this will called when component is about to unmount  	
    return () => { 
       async function remove() {
        for(let i = 0; i < connectedPeers.length; i++){ 
          connectedPeers[i].close(); 
        }
        await blankspace.removeFromActive(documentId, myPrincipal);
      }
      remove();

    }
  }, []);

  useEffect(() => {
    if (props.exportD) {
      async function exportDoc() {
        const delt = quill.getContents(); // gets the Quill delta
        const pdfAsBlob = await pdfExporter.generatePdf(delt); // converts to PDF
        var docn = props.docName + '.pdf';
        saveAs(pdfAsBlob, docn); // downloads from the browser
      }
      exportDoc();
    }
  }, [props.exportD]);



  useEffect(() => {
    //this will called when component is about to unmount  	
    return () => {
      //clean up code  
      async function remove() {
        for (let i = 0; i < connectedPeers.length; i++) {
          connectedPeers[i].destroy();
        }
        await blankspace.removeFromActive(documentId, myPrincipal);
      }
      remove();

    }
  }, []);

  // Sets up the wrapper (a div around the quill) for quill front end element
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement('div');
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } })
    q.setContents({ "ops": [{ "insert": startuptext, "attributes": { "bold": true } }] })
    setQuill(q);
  }, [])

  // class to wrap a simple peer object, maintains 
  class MyPeer {
    constructor(recipient, myPrincipal) {
      this.recipient = recipient;
      if (this.recipient.length > 0) {
        setOffered(offered.push(this.recipient))
      }
      this.myPrincipal = myPrincipal;

      this.peer = new Peer({
        initiator: this.recipient.length > 0,
        trickle: false,
        config: {
          iceServers: [
            { urls: "stun:stun.blankspace.live:5349" },
            { urls: "turn:turn.blankspace.live:5349", username: 'danhass', credential: 'ourblankspace' }
          ]
        }
      });

      this.peer.on("signal", async (data) => {
        if (this.recipient.length > 0) {
          await blankspace.updateCurrentPeers(this.myPrincipal, this.recipient, data.type, data.sdp);
        }
      });

      this.peer.on("connect", () => {
        // see if there is a way to remove connected list (only maintain connectedPeers and myPeers)
        setConnected(connected.push(this.recipient))
        setConnectedPeers((prevConnected) => [...prevConnected, this])
        const index = offered.indexOf(recipient)
        setOffered(offered.splice(index, 1))
      });

      this.peer.on('data', delta => {
        setDelta(delta)
      })

      this.peer.on("close", () => { 
        var index = offered.indexOf(this.recipient)
        setOffered(offered.splice(index, 1))
        index = connected.indexOf(this.recipient)
        setConnected(connected.splice(index, 1))
        let rec = this.recipient
        setConnectedPeers(prevConnected => prevConnected.filter(function(e){ return e.recipient !== rec}))
      });

      this.peer.on("error", (err) => {
        var index = offered.indexOf(this.recipient)
        setOffered(offered.splice(index, 1))
        index = connected.indexOf(this.recipient)
        setConnected(connected.splice(index, 1))
        let rec = this.recipient
        setConnectedPeers(prevConnected => prevConnected.filter(function (e) { return e.recipient !== rec }))
      });
    }

    getPeer() {
      return this.peer;
    }

    setRecipient(recipient) {
      this.recipient = recipient;
    }
  }

  var myPeers = []

  useEffect(() => {
    async function initialRun() {
      var currentActive = await blankspace.getActiveUsers(documentId);
      if (!currentActive.includes(myPrincipal)) {
        await blankspace.addToCurrentUsers(documentId, myPrincipal);
      }
    }

    async function activeUserUpdate() {
      // get active users from motoko
      var peersActive = await blankspace.getActiveUsers(documentId);
      var foundMe = false;

      // if there are peers which have also connected 
      if (peersActive.length != 0) {
        for (let i = 0; i < peersActive.length; i++) {

          //only create offers for users which come after me in the list 
          if (myPrincipal == peersActive[i]) {
            foundMe = true;
          }

          if (myPrincipal != peersActive[i] && foundMe == true) {
            if (connected.indexOf(peersActive[i]) === -1 && offered.indexOf(peersActive[i]) === -1) {
              // create an offer for this recipient 
              createOffer(peersActive[i])
            }
          }
        }
      }
    }

    initialRun()
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
          handleOffer(request)
        } else {
          handleAnswer(request)
        }
      }
    }
    const intervalTwo = setInterval(connectionRequests, 2000);
    return () => clearInterval(intervalTwo);
  }, [])

  useEffect(() => {
    if (quill == null || quillLoaded == false) return;
    async function saveDocInterval() {
      await blankspace.updateDocContents(documentId, JSON.stringify(quill.getContents()))
    }
    const intervalSave = setInterval(saveDocInterval, 3000);
    return () => clearInterval(intervalSave);
  }, [quill, quillLoaded])



  //if there is no response from an offer, destroy the peer, take back the offer and resend
  function clearOfferNA(recipient) {
    // if recipient hasnt connected 
    if (connected.indexOf(recipient) === -1) {
      //remove from offered and from myPeers to create a new offer 
      const index = offered.indexOf(recipient)
      setOffered(offered.splice(index, 1))

      //kill the peer first 
      let recipientPeer = myPeers.filter(function (e) { return e.recipient === recipient })
      recipientPeer[0].getPeer().destroy()
      myPeers = myPeers.filter(function (e) { return e.recipient !== recipient })
    }
  }

  // create an offer for a particular recipient 
  function createOffer(recipient) {

    //only create offer is a peer/offer does not already exist for that recipient 
    var createdPeer = false
    for (let i = 0; i < myPeers.length; i++) {
      if (recipient === myPeers[i].recipient) {
        createdPeer = true
      }
    }
    if (offered.indexOf(recipient) === -1 && createdPeer === false) {
      const p = new MyPeer(recipient, myPrincipal)
      myPeers.push(p)
      // create a 30 second wait to delete offer if no answer is recieved 
      setTimeout(() => {
        clearOfferNA(recipient)
      }, 30000)
    }
  }

  // when an offer request is recieved from another peer, handle using this function, ensuring to remove a previous peer created from them
  function handleOffer(request) {
    var recipient = request[0].initiator
    destroyPeer(recipient)
    // create a peer for this particular offer, add to myPeers list, and signal back 
    var jsonData = { "type": request[0].typeof, "sdp": request[0].sdp }
    var p = new MyPeer("", myPrincipal);
    p.setRecipient(recipient)
    myPeers.push(p)
    p.peer.signal(jsonData)
  }

  function destroyPeer(recipient) {
    var createdPeer = false
    for (let i = 0; i < myPeers.length; i++) {
      if (recipient === myPeers[i].recipient) {
        createdPeer = true
      }
    }
    if (createdPeer) {
      var killPeer = myPeers.filter(function (e) { return e.recipient === recipient })
      killPeer[0].getPeer().destroy()
      myPeers = myPeers.filter(function (e) { return e.recipient !== recipient })
    }
  }

  // when an answer request is received from another peer, handle using this function
  function handleAnswer(request) {
    // if its an answer, signal back that you have received the answer and connect (connection happens through the signal)
    var recipient = request[0].initiator;
    var jsonData = { "type": request[0].typeof, "sdp": request[0].sdp }
    for (let i = 0; i < myPeers.length; i++) {
      if (recipient == myPeers[i].recipient) {
        myPeers[i].getPeer().signal(jsonData)
      }
    }
  }

  useEffect(() => {
    const sendDoc = async () => {
      var head = await blankspace.getFirst(documentId);
      var delta = quill.getContents();
      if (head[0] === myPrincipal) {
        for (let i = 0; i < connectedPeers.length; i++) {
          connectedPeers[i].getPeer().send(JSON.stringify(delta))
        }
      }
    }
    if (quillLoaded) {
      sendDoc();
    }
  }, [connectedPeers, quillLoaded]);

  // when text is updated, send to all connected peers
  useEffect(() => {
    if (quill == null) return;
    if (quillLoaded == false) { setQuillLoaded(true) }
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') {
        return;
      }
      // //send delta to peer
      for (let i = 0; i < connectedPeers.length; i++) {
        connectedPeers[i].getPeer().send(JSON.stringify(delta))
      }
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
    if (json.ops[0].hasOwnProperty('insert')) {
      if (val.insert.length > 1) {
        quill.setContents(JSON.parse(delta))
      } else {
        quill.updateContents(JSON.parse(delta));
      }
    } else {
      quill.updateContents(JSON.parse(delta));
    }

  }, [delta]);

  useEffect(() => {
    if (quillLoaded) {
      const retrieveDocContent = async () => {
        var docCon = await blankspace.getDocContents(documentId);
        var docContent = JSON.parse(docCon)
        if (docCon == "null") { //new document
          props.addDoc(documentId);
          const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();

            const authenticatedCanister = createActor(canisterId, {
                agentOptions: {
                    identity
                },
            });
          await authenticatedCanister.updateUsersDocs(documentId);
        } else {
          quill.setContents(docContent)
        }
        // quill.setText("Hello");
      }
      retrieveDocContent();
    }
  }, [quillLoaded])

  return (
    <div className="container" ref={wrapperRef}></div>
  );
}