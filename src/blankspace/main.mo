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

  public shared(msg) func updateCurrentPeers(recipient : Text, typeof : Text, sdp : Text) : async() {
    var init : Principal = msg.caller;
    var initiatorText : Text = Principal.toText(init);
    await Signalling.addConnectionRequest(initiatorText, recipient, typeof, sdp); 
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

  public func getFirst(documentID : Text) : async ?Text { 
    var activeUsers : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    return List.last(activeUsers);
  };

  //this can be changed to shared(msg)
  public shared(msg) func addToCurrentUsers(documentID : Text) : async() { 
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    var currentDoc : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 

    currentDoc := List.push(principalText, currentDoc);
    activeDocsPrincipalHashmap.put(documentID, currentDoc); 
  };

  // NOTE: this can be changed to shared(msg) so we no longer require princicpal 
  // NOTE: it should be ok to use ConnectionDetails here (despite it being duplicated code) 
  // as it is a necessary part of the implementation for signalling. 
  public shared(msg) func getConnectionRequest() : async ?ConnectionDetails { 
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    let connectionRequest = await Signalling.getConnectionRequest(principalText); 
  };
  
// func query params REMOVE:: principal
  public shared(msg) func removeFromActive(documentID : Text, principal : Text ) : async () {
    Debug.print(debug_show(principal));
    Debug.print(debug_show("DELETING FROM ACTIVE"));
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);

    var currentDoc : List.List<Text> = switch(activeDocsPrincipalHashmap.get(documentID)){
        case null List.nil<Text>(); 
        case (?result) result;
    }; 
    currentDoc := List.filter(currentDoc, func (user : Text) : Bool {
        user != principalText;
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
  // func query params REMOVE:: principal
  public shared(msg) func updateUsersDocs(principal: Text, docID: Text) : async () {
    Debug.print(debug_show(principal));
    Debug.print(debug_show(docID));
     var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    var docsList : List.List<Text> = switch(usersDocs.get(principalText)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };

    //TODO: if list already contains docID, do not add docID to list again
    var arr = List.toArray<Text>(docsList);
    for (x in arr.vals()) {
      if (x == docID) {
        return;
      };
    };


    docsList := List.push(docID, docsList);
    usersDocs.put(principalText, docsList);
  };

// func query params REMOVE:: principal
  public shared(msg) func getUsersDocs(principal: Text) : async [Text] {
    var prin : Principal = msg.caller;
    var principalText : Text = Principal.toText(prin);
    var docsList : List.List<Text> = switch(usersDocs.get(principalText)){
      case null List.nil<Text>(); 
      case (?result) result; 
    };
    return ( List.toArray<Text>(docsList) ); 
  };

// func query params REMOVE:: principal
  public shared(msg) func removeUserDoc(principal: Text, docID: Text) : async () {
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
  };


  //Hashmap of docIDs to doc contents
  var docContents = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  public func updateDocContents(docID: Text, contents: Text) : async () {
    Debug.print(debug_show(docID));
    Debug.print(debug_show(contents));
    docContents.put(docID, contents);
  };

  public query func getDocContents(docID: Text) : async Text {
    var contents : Text = switch(docContents.get(docID)){
      case null "null"; 
      case (?result) result; 
    };
    return contents; 
    //commentssssssssssss
  }




}
