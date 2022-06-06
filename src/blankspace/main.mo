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




  //MULTI DOCS

  //Hashmap of users (note: currently text later expand to Principal type) to docs (array of docIDs)
  //---------Keeping track of which documents belong to which users
  var usersDocs = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);
  public func updateUsersDocs(principal: Text, docID: Text) : async () {
    Debug.print(debug_show(principal));
    Debug.print(debug_show(docID));
    var docsList : List.List<Text> = switch(usersDocs.get(principal)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };
    //TODO: if list already contains docID, do not add docID to list again
    docsList := List.push(docID, docsList);
    usersDocs.put(principal, docsList);
  };

  public query func getUsersDocs(principal: Text) : async [Text] {
    var docsList : List.List<Text> = switch(usersDocs.get(principal)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };
    return ( List.toArray<Text>(docsList) ); 
  };


  //Hashmap of docIDs to docNames
  var docNames = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  public func updateDocName(docID: Text, docName: Text) : async () {
    Debug.print(debug_show(docName));
    Debug.print(debug_show(docID));
    docNames.put(docID, docName);
  };

  public query func getDocName(docID: Text) : async Text {
    var docname : Text = switch(docNames.get(docID)){
      case null "Untitled"; 
      case (?result) result; 
    };
    return docname; 
    //comment
  }




}
