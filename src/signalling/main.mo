import Text "mo:base/Text";
import Types "./types";
import Database "./database"; 


//actor used for sending signalling commmunications between a number of active peers 

actor Signalling { 

    public type ConnectionDetails = Types.ConnectionDetails; 
    var currentActivePeers = Database.Connections(); 

    public func getConnectionRequest(principal : Text) : async ?ConnectionDetails { 
        currentActivePeers.getConnectionRequest(principal);
    };

    //this can be changed to use shared(msg) when we move to principals. This will replace initiator
    public func addConnectionRequest(initiator : Text, recipient : Text, typeof : Text, sdp : Text) : async() {
        currentActivePeers.addConnectionRequest(initiator, recipient, typeof, sdp); 
    };

    public func addActiveUser(principal : Text) : async() { 
        currentActivePeers.addActiveUser(principal); 
    };

    public func getActiveUsers() : async [Text]{ 
        currentActivePeers.getActiveUsers();
    };

}