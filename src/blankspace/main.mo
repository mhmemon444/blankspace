import Debug "mo:base/Debug"; 
import Nat "mo:base/Nat";
import Types "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Signalling "canister:signalling";


actor Blankspace { 

  

  // all the additional document content 
  var principalDocsHashmap = HashMap.HashMap<Principal, List.List<Text>>(1, Principal.equal, Principal.hash);
  var docsPrincipalHashmap = HashMap.HashMap<Text, List.List<Principal>>(1, Text.equal, Text.hash);  
  var docsContent = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);










  // functions for connecting peers which are active on the same document 
  public type ConnectionDetails = Types.ConnectionDetails; 

  public func updateCurrentPeers(initiator : Text, recipient : Text, typeof : Text, sdp : Text) : async() {
    await Signalling.addConnectionRequest(initiator, recipient, typeof, sdp); 
  };

  public func getActiveUsers() : async [Text]{ 
    let activeUsers = await Signalling.getActiveUsers(); 
    return activeUsers; 
  };

  //this can be changed to shared(msg)
  public func addToCurrentUsers(principal : Text) : async() { 
    await Signalling.addActiveUser(principal); 
  };

  //this can be changed to shared(msg)
  public func getConnectionRequest(principal : Text) : async ?ConnectionDetails { 
    let connectionRequest = await Signalling.getConnectionRequest(principal); 
  };
  
  // //this can be changed to shared(msg)
  // public func removeFromCurrent(principal : Text) : async () { 
  //   await Signalling.removeActiveUser(principal);
  // };




}
