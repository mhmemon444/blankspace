import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Types "./types";

module { 

    public class Connections() { 

        public type ConnectionDetails = Types.ConnectionDetails;  
        let connectionsMap = HashMap.HashMap<Text, List.List<ConnectionDetails>>(1, Text.equal, Text.hash);

        public func addActiveUser(principal : Text){ 
            // add a new key (principal name) with an empty list 
            connectionsMap.put(principal, List.nil());
        };

        public func removeActiveUser(principal : Text){ 
            let removed = connectionsMap.remove(principal); 
        };

        public func addConnectionRequest(initiator : Text, recipient : Text, typeof : Text, sdp : Text){
            // find the recipient in the hashmap
            // add connectionDetails to the list.
            var connectionRequests : List.List<ConnectionDetails> = switch(connectionsMap.get(recipient)){
                case null List.nil<ConnectionDetails>(); 
                case (?result) result;
            }; 
            connectionRequests := List.push({typeof = typeof; sdp = sdp; initiator = initiator; recipient = recipient;}, connectionRequests);
            connectionsMap.put(recipient, connectionRequests); 
        };

        public func getConnectionRequest(principal : Text) : ?ConnectionDetails { 
            // find key for the principal 
            // pop a connectionRequest from the list 
            let connectionRequests : List.List<ConnectionDetails> = switch(connectionsMap.get(principal)){
                case null List.nil<ConnectionDetails>(); 
                case (?result) result; 
            };
            let (connectionRequest, poppedList) = List.pop(connectionRequests);
            connectionsMap.put(principal, poppedList); 
            return connectionRequest;
        };

        // NOTE: this should be handled in BLANKSPACE as it has more to do with implementation of the active users on blankspace
        public func getActiveUsers(): [Text]{ 
            // get the keys from the hashmap 
            var keyList : List.List<Text> = List.nil(); 
            for (x in connectionsMap.keys()){
                keyList := List.push(x, keyList);
            };
            return ( List.toArray<Text>(keyList) ); 
        };



    }
}