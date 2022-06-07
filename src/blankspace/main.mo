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

  var activeDocsPrincipalHashmap = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);

  /** 

      CONNECTING PEERS 

  **/ 

  public type ConnectionDetails = Types.ConnectionDetails; 

  public func updateCurrentPeers(initiator : Text, recipient : Text, typeof : Text, sdp : Text) : async() {
    await Signalling.addConnectionRequest(initiator, recipient, typeof, sdp); 
  };

  // NOTE: this should be handled here without calling to signalling, signalling should only know about specific users and their connections 
  // not the logic behind WHO is on a specific doc and is active for a particular user 
  public func getActiveUsers(documentID : Text) : async [Text]{ 
    var activeUsers : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    Debug.print(debug_show(documentID));
    return ( List.toArray<Text>(activeUsers) ); 
  };

  //this can be changed to shared(msg)
  public func addToCurrentUsers(documentID : Text, principal : Text) : async() { 
    var currentDoc : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 

    currentDoc := List.push(principal, currentDoc);
    activeDocsPrincipalHashmap.put(documentID, currentDoc); 
  };

  // NOTE: this can be changed to shared(msg) so we no longer require princicpal 
  // NOTE: it should be ok to use ConnectionDetails here (despite it being duplicated code) 
  // as it is a necessary part of the implementation for signalling. 
  public func getConnectionRequest(principal : Text) : async ?ConnectionDetails { 
    let connectionRequest = await Signalling.getConnectionRequest(principal); 
  };
  

  public func removeFromActive(documentID : Text, principal : Text ) : async () {
    Debug.print(debug_show(principal));
    Debug.print(debug_show("DELETING FROM ACTIVE"));

    var currentDoc : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    currentDoc := List.filter(currentDoc, func (user : Text) : Bool {
        user != principal
    });
    activeDocsPrincipalHashmap.put(documentID, currentDoc); 
  };

  // //this can be changed to shared(msg)
  // public func removeFromCurrent(documentID : Text, principal : Text) : async () { 
  //   await Signalling.removeActiveUser(principal);
  // };




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
