import Peer from "simple-peer"; 
import { blankspace } from "../../../declarations/blankspace/index";

// class to wrap a simple peer object, maintains functions for a Peer
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
        await blankspace.updateCurrentPeers(this.myPrincipal, this.recipient, data.type, data.sdp);
      }
    });

    this.peer.on("connect", () => {
      setConnected((prevConnected) => [...prevConnected, this.recipient])
    });

    this.peer.on('data', delta => {
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
    this.peer.send(delta);
  }
}

export default MyPeer;
