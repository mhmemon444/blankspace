import Debug "mo:base/Debug"; 
import Nat "mo:base/Nat";
import Types "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";


actor { 

  

  var principalDocsHashmap = HashMap.HashMap<Principal, List.List<Text>>(1, Principal.equal, Principal.hash);
  var docsPrincipalHashmap = HashMap.HashMap<Text, List.List<Principal>>(1, Text.equal, Text.hash);  
  var docsContent = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);



  public type ConnectionDetails = Types.ConnectionDetails; 
  var currentPeersOnDoc = HashMap.HashMap<Text, List.List<ConnectionDetails>>(1, Text.equal, Text.hash);


  public func updateCurrentPeers(initiator : Text, recipient : Text, typeof : Text, sdp : Text) : async() {
    // find the recipient in the hashmap
    // add connectionDetails to the list.
    var connectionRequests : List.List<ConnectionDetails> = switch(currentPeersOnDoc.get(recipient)){
      case null List.nil<ConnectionDetails>(); 
      case (?result) result;
    }; 
    connectionRequests := List.push({typeof = typeof; sdp = sdp; initiator = initiator; recipient = recipient;}, connectionRequests);
    currentPeersOnDoc.put(recipient, connectionRequests); 
  };

  public func getActiveUsers() : async [Text]{ 
    // get the keys from the hashmap 
    var keyList : List.List<Text> = List.nil(); 
    for (x in currentPeersOnDoc.keys()){
      keyList := List.push(x, keyList);
    };
    return ( List.toArray<Text>(keyList) ); 
  };

  public func addToCurrentUsers(principal : Text) : async() { 
    // add a new key (principal name) with an empty list 
    currentPeersOnDoc.put(principal, List.nil());
  };

  public func getConnectionRequest(principal : Text) : async ?ConnectionDetails { 
    // find key for the principal 
    // pop a connectionRequest from the list 
    let connectionRequests : List.List<ConnectionDetails> = switch(currentPeersOnDoc.get(principal)){
      case null List.nil<ConnectionDetails>(); 
      case (?result) result; 
    };
    let (connectionRequest, poppedList) = List.pop(connectionRequests);
    currentPeersOnDoc.put(principal, poppedList); 
    return connectionRequest;
  };
  

  public func removeFromCurrent(principal : Text) : async () { 
    let removed = currentPeersOnDoc.remove(principal); 
  };




}
