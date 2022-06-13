import React, { useState, useEffect } from 'react';
import "./Avatar.css";
// import { blankspace } from '../../../declarations/blankspace/index';

export default function Avatar(props) {

    return (
        <img src={"ava-"+props.i+".png"} style={{height: '28px'}}/>
    )
}