actor Document { 
  stable var text : Text = ""; 

  public func settext(update : Text) : async () { 
    text := update; 
  }; 

  public func gettext() : async Text { 
    return text; 
  };
  
}
