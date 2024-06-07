import React from 'react'

import "./Error.css"


function Error( { font, size, text } ) {

    return (
        <>
        <div className='C-Error-container' style={{width: size, height: size}}>
            <div style={{fontSize: `${font}px`, lineHeight: `${font - 4}px`}} className='C-Error-icon'>✖</div>
        </div>

        <h3 className='C-Error-text'> {text} </h3>
       </>
    )
}

export default Error