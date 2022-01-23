import React from 'react';
import Editor from 'react-simple-code-editor';
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';

export default function SimpleEditor(props) {
    return (
        <Editor
            value={props.code}
            onValueChange={code => {props.setCode(code)}}
            highlight={code => hljs.highlightAuto(code).value}
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                backgroundColor: 'white'
            }}
        />
    )
}
