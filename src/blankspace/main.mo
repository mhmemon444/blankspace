import Debug "mo:base/Debug"; 
import Nat "mo:base/Nat";
import Types "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";


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



}
