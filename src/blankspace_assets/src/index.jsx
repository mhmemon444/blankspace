import * as React from "react";
import { render } from "react-dom";
import { blankspace } from "../../declarations/blankspace";

import TextEditor from "./TextEditor/TextEditor";
import "./index.css";

const MyHello = () => {


  return (
    <div>
      <TextEditor />
    </div>
  );
};

render(<MyHello />, document.getElementById("app"));
