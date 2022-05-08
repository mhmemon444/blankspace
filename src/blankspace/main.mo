import Debug "mo:base/Debug"; 
import Nat "mo:base/Nat";
import Types "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";


actor { 
  // stable var text : Text = ""; 

  // public func settext(update : Text) : async () { 
  //   text := update; 
  // }; 

  // public func gettext() : async Text { 
  //   return text; 
  // };
  
  public type ConnectionDetails = Types.ConnectionDetails; 
  var principalDocsHashmap = HashMap.HashMap<Principal, List.List<Text>>(1, Principal.equal, Principal.hash);
  var docsPrincipalHashmap = HashMap.HashMap<Text, List.List<Principal>>(1, Text.equal, Text.hash);  
  var docsContent = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);

  var signalling = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  // var signallingHashmap = HashMap.HashMap<Text, List.List<Principal>>(1, Text.equal, Text.hash); 

  public func updateSignal(docID: Text, data: Text): async() {
    signalling.put(docID, data);
  };

  public query func getSignal(docID: Text) : async Text {
        let data : Text = switch (signalling.get(docID)) {
            case null "empty";
            case (?result) result;
        };
        
        return data;
    };


  //dictionary docID to list of peers
  var currentPeersOnDoc = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);

  public func addPeerOnDoc(docID: Text, peer: Text): async() {
    var curList : List.List<Text> = switch (currentPeersOnDoc.get(docID)) {
            case null List.nil<Text>();
            case (?result) result;
        };
        curList := List.push(peer, curList);
        currentPeersOnDoc.put(docID, curList);
    // let curList : ?List.List<Text> = currentPeersOnDoc.get(docID);
    // if (curList == null) {
    //   var newList : List.List<Text> = List.nil<Text>();
    //   // let text : Text = "sample";
    //   newList := List.push(peer, newList);
    //   var listSize : Nat = List.size(newList);
    //   // Debug.print(debug_show(listSize));   
    //   currentPeersOnDoc.put(docID, newList);
    //   // Debug.print(debug_show(currentPeersOnDoc));  
    // } else {
    //   var newList : List.List<Text> = List.nil<Text>();
    //    newList := List.push(peer, curList);
    //   currentPeersOnDoc.put(docID, newList);
    // };
    // Debug.print(debug_show(curList));    
  };

  public query func getCurrentPeersOnDoc(docID: Text) : async [Text] {
        let data : List.List<Text> = switch (currentPeersOnDoc.get(docID)) {
            case null List.nil<Text>();
            case (?result) result;
        };
        //persisteeee
        return (  List.toArray<Text>(data)  );
    };

      
  var offerCandidates = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);
  var answerCandidates = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);

  public func addAnswerCandidate(localUser: Text, remotePeer: Text): async() {
    var curList : List.List<Text> = switch (answerCandidates.get(localUser)) {
            case null List.nil<Text>();
            case (?result) result;
        };
        curList := List.push(remotePeer, curList);
        answerCandidates.put(localUser, curList);
  };

  public query func getAnswerCandidates(localUser: Text) : async [Text] {
        let data : List.List<Text> = switch (answerCandidates.get(localUser)) {
            case null List.nil<Text>();
            case (?result) result;
        };
        //persisteeeeeeee
        return (  List.toArray<Text>(data)  );
    };


  public func addOfferCandidate(remotePeer: Text, localUser: Text): async() {
    var curList : List.List<Text> = switch (offerCandidates.get(remotePeer)) {
            case null List.nil<Text>();
            case (?result) result;
        };
        curList := List.push(localUser, curList);
        offerCandidates.put(remotePeer, curList);
  };

  public query func getOfferCandidates(remotePeer: Text) : async [Text] {
        let data : List.List<Text> = switch (offerCandidates.get(remotePeer)) {
            case null List.nil<Text>();
            case (?result) result;
        };
        //persisteeee
        return (  List.toArray<Text>(data)  );
    };

  




}
