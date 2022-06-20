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

  public func getActiveUsers(documentID : Text) : async [Text]{ 
    var activeUsers : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    return ( List.toArray<Text>(activeUsers) ); 
  };

  public func getFirst(documentID : Text) : async ?Text { 
    var activeUsers : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    return List.last(activeUsers);
  };

  public func addToCurrentUsers(documentID : Text, principal : Text) : async() { 
    var currentDoc : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 

    currentDoc := List.push(principal, currentDoc);
    activeDocsPrincipalHashmap.put(documentID, currentDoc); 
  };

  public func getConnectionRequest(principal : Text) : async ?ConnectionDetails { 
    let connectionRequest = await Signalling.getConnectionRequest(principal); 
  };
  

  public func removeFromActive(documentID : Text, principal : Text ) : async () {
    var currentDoc : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    currentDoc := List.filter(currentDoc, func (user : Text) : Bool {
        user != principal
    });
    activeDocsPrincipalHashmap.put(documentID, currentDoc); 
  };




  //MULTI DOCS

  //Hashmap of users (note: currently text later expand to Principal type) to docs (array of docIDs)
  //---------Keeping track of which documents belong to which users
  stable var usersDocsEntries : [(Text, List.List<Text>)] = [];
  var usersDocs = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);
  public shared(msg) func updateUsersDocs(docID: Text) : async () {
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    var docsList : List.List<Text> = switch(usersDocs.get(principalText)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };

    //if list already contains docID, do not add docID to list again
    var arr = List.toArray<Text>(docsList);
    for (x in arr.vals()) {
      if (x == docID) {
        return;
      };
    };


    docsList := List.push(docID, docsList);
    usersDocs.put(principalText, docsList);
  };

  public shared(msg) func getUsersDocs() : async [Text] {
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    var docsList : List.List<Text> = switch(usersDocs.get(principalText)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };
    return ( List.toArray<Text>(docsList) ); 
  };

  public shared(msg) func removeUserDoc(docID: Text) : async () {
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    var docsList : List.List<Text> = switch(usersDocs.get(principalText)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };

    docsList := List.filter(docsList, func(val: Text) : Bool { docID != val });
    usersDocs.put(principalText, docsList);
  };




  //Hashmap of docIDs to docNames
  stable var docNamesEntries : [(Text, Text)] = [];
  var docNames = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  public func updateDocName(docID: Text, docName: Text) : async () {
    docNames.put(docID, docName);
  };

  public query func getDocName(docID: Text) : async Text {
    var docname : Text = switch(docNames.get(docID)){
      case null "untitled"; 
      case (?result) result; 
    };
    return docname; 
    //comment
  };


  //Hashmap of docIDs to doc contents
  stable var docContentsEntries : [(Text, Text)] = [];
  var docContents = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  public func updateDocContents(docID: Text, contents: Text) : async () {
    docContents.put(docID, contents);
  };

  public query func getDocContents(docID: Text) : async Text {
    var contents : Text = switch(docContents.get(docID)){
      case null "null"; 
      case (?result) result; 
    };
    return contents; 
  };

  //Hashmap of docIDs to access settings
  var docAccess = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  public func updateDocAccess(docID: Text, access: Text) : async () {
    docAccess.put(docID, access);
  };

  public query func getDocAccess(docID: Text) : async Text {
    var contents : Text = switch(docAccess.get(docID)){
      case null "Anyone"; 
      case (?result) result; 
    };
    return contents; 
  };


  system func preupgrade() {
    docContentsEntries := Iter.toArray(docContents.entries());
    docNamesEntries := Iter.toArray(docNames.entries());
    usersDocsEntries := Iter.toArray(usersDocs.entries());
  };

  system func postupgrade() {
    docContents := HashMap.fromIter<Text, Text>(docContentsEntries.vals(), 1, Text.equal, Text.hash);
    docNames := HashMap.fromIter<Text, Text>(docNamesEntries.vals(), 1, Text.equal, Text.hash);
    usersDocs := HashMap.fromIter<Text, List.List<Text>>(usersDocsEntries.vals(), 1, Text.equal, Text.hash);
  };

}
