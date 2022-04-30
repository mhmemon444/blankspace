import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import { blankspace } from "../../../declarations/blankspace/index";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

export default function TextEditor() {
  const [value, setValue] = useState('');
  const isMounted = useRef(false);

  

  async function set() {
      await blankspace.settext(value);
      console.log(value);
  }

  async function get() {
      var t = await blankspace.gettext();
      console.log("text: ", t);
      setValue(t);
      return t;
  }

  useEffect(() => {
    // get();
    setInterval(get, 1000); //polling
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      set();
    } else {
      isMounted.current = true;
    }
  }, [value]);

  

  return (
      <div className="container">
          <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats} >
            </ReactQuill>
      </div>
    
  );
}