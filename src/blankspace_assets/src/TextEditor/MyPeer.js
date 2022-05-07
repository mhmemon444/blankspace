import Peer from "simple-peer"; 

class MyPeer {
  constructor(recipient, myPrincipal) {
    this.recipient = recipient;
    this.myPrincipal = myPrincipal;

    this.peer = new Peer({
      initiator: this.recipient.length > 0,
      trickle: false,
    });

    this.peer.on("signal", (data) => {
      console.log("this.peer.on.signal: ", data);
      if (this.recipient.length > 0)
        SignalSend(this.myPrincipal, this.recipient, data);
    });

    this.peer.on("connect", () => {
      console.log("connect");
      this.peer.send("Hello " + this.recipient);
    });

    this.peer.on("data", (data) => {
      console.log("data: ", data);
      var p = document.createElement("p");
      p.innerText = data;
      document.getElementById("log").appendChild(p);
    });

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
