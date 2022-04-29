actor Document { 
  stable var text : Text = ""; 

  public func settext(update : Text) : async () { 
    text := update; 
  }; 

  public query func gettext() : async Text { 
    return text; 
  };
  
}
