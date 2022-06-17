import React, { useState, useEffect } from 'react';
import ReactTooltip from "react-tooltip";
import "./Avatar.css";
import myPrincipal from '../../constants/userid';
// import { blankspace } from '../../../declarations/blankspace/index';

export default function Avatar(props) {

    return (
        <>
            <img data-tip data-for={props.a + 'loot'} src={"ava-" + props.i + ".png"} style={{ height: '28px' }} />
            <ReactTooltip className="tooltipchecks" id={props.a + 'loot'} place="bottom" effect="solid">
                {"Anon-"+props.a} {myPrincipal == props.a ? "(You)" : null}
            </ReactTooltip>
        </>
    )
}