import Nat "mo:base/Nat"; 
import Principal "mo:base/Principal";


module { 

    public type ConnectionDetails = { 
        typeof : Text; 
        sdp : Text; 
        initiator : Text; 
        recipient : Text; 
    };
}