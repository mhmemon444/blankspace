import React, { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";

export default function TextEditor() {
  const [value, setValue] = useState('');

  return (
      <div className="container">
          <ReactQuill theme="snow" value={value} onChange={setValue} style={{
              'width': '8.5in',
              'padding': '1in',
              'margin': '1rem',
              }}>
            </ReactQuill>
      </div>
    
  );
}