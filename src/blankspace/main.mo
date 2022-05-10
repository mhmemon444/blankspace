import Debug "mo:base/Debug"; 
import Nat "mo:base/Nat";
import Types "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";


actor { 
    public type ConnectionDetails = Types.ConnectionDetails; 
    var currentPeersOnDoc = HashMap.HashMap<Text, List.List<ConnectionDetails>>(1, Text.equal, Text.hash);

      public func getActiveUsers() : async [Text] { 
        // get the keys from the hashmap 
        var keyList : List.List<Text> = List.nil(); 
        for (x in currentPeersOnDoc.keys()){
          keyList := List.push(x, keyList);
        };
        return List.toArray<Text>(keyList); 
      };

      







  // stable var text : Text = ""; 

  // public func settext(update : Text) : async () { 
  //   text := update; 
  // }; 

  // public func gettext() : async Text { 
  //   return text; 
  // };
  
  // public type ConnectionDetails = Types.ConnectionDetails; 
  // var principalDocsHashmap = HashMap.HashMap<Principal, List.List<Text>>(1, Principal.equal, Principal.hash);
  // var docsPrincipalHashmap = HashMap.HashMap<Text, List.List<Principal>>(1, Text.equal, Text.hash);  
  // var docsContent = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);

  // var signalling = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  // // var signallingHashmap = HashMap.HashMap<Text, List.List<Principal>>(1, Text.equal, Text.hash); 

  // public func updateSignal(docID: Text, data: Text): async() {
  //   signalling.put(docID, data);
  // };

  //  public func updateUserSignal(user: Text, data: Text): async() {
  //   signalling.put(user, data);
  // };

  // public query func getSignal(docID: Text) : async Text {
  //       let data : Text = switch (signalling.get(docID)) {
  //           case null "empty";
  //           case (?result) result;
  //       };
        
  //       return data;
  //   };


  // //dictionary docID to list of peers
  // var currentPeersOnDoc = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);

  // public func addPeerOnDoc(docID: Text, peer: Text): async() {
  //   var curList : List.List<Text> = switch (currentPeersOnDoc.get(docID)) {
  //           case null List.nil<Text>();
  //           case (?result) result;
  //       };
  //       curList := List.push(peer, curList);
  //       currentPeersOnDoc.put(docID, curList);
  // };

  // public query func getCurrentPeersOnDoc(docID: Text) : async [Text] {
  //       let data : List.List<Text> = switch (currentPeersOnDoc.get(docID)) {
  //           case null List.nil<Text>();
  //           case (?result) result;
  //       };
  //       //persisteeeeee
  //       return (  List.toArray<Text>(data)  );
  //   };

      
  // var offerCandidates = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);
  // var answerCandidates = HashMap.HashMap<Text, List.List<Text>>(1, Text.equal, Text.hash);

  // public func addAnswerCandidate(localUser: Text, remotePeer: Text): async() {
  //   var curList : List.List<Text> = switch (answerCandidates.get(localUser)) {
  //           case null List.nil<Text>();
  //           case (?result) result;
  //       };
  //       curList := List.push(remotePeer, curList);
  //       answerCandidates.put(localUser, curList);
  // };

  // public query func getAnswerCandidates(localUser: Text) : async [Text] {
  //       let data : List.List<Text> = switch (answerCandidates.get(localUser)) {
  //           case null List.nil<Text>();
  //           case (?result) result;
  //       };
  //       //persisteeeeeeeeeeeeeeeeeeee
  //       //
  //       return (  List.toArray<Text>(data)  );
  //   };


  // public func addOfferCandidate(remotePeer: Text, localUser: Text): async() {
  //   var curList : List.List<Text> = switch (offerCandidates.get(remotePeer)) {
  //           case null List.nil<Text>();
  //           case (?result) result;
  //       };
  //       curList := List.push(localUser, curList);
  //       offerCandidates.put(remotePeer, curList);
  // };

  // public query func getOfferCandidates(remotePeer: Text) : async [Text] {
  //       let data : List.List<Text> = switch (offerCandidates.get(remotePeer)) {
  //           case null List.nil<Text>();
  //           case (?result) result;
  //       };
  //       //persisteeeeeee
  //       //
  //       return (  List.toArray<Text>(data)  );
  //   };

  




}
