import React, { useState, useEffect } from "react";
import Loader from 'react-loader-spinner';
//import { css } from "@emotion/core";

function CustomLoader(props) {
    const [type, setType]       = useState("ThreeDots");
    const [color, setColor]     = useState("#00BFFF");
    const [height, setHeight]   = useState(100);
    const [width, setWidth]     = useState(100);
    const [timeout, setTimeout] = useState(20000);

    useEffect(() => {
        if(props && props.type){
            setType(props.type);
        }
        if(props && props.color){
            setColor(props.color);
        }
        if(props && props.height){
            setHeight(props.height);
        }
        if(props && props.width){
            setWidth(props.width);
        }
        if(props && props.timeout){
            setTimeout(props.timeout);
        }       
    },[]);
    return (
        <div>
            <Loader
                type={type}
                color={color}
                height={height}
                width={width}
                timeout={timeout} //3 secs
           />
        </div>
    );
}

export default CustomLoader;