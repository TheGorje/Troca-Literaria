import React from 'react'

import "./ok.css"


function Ok( { font, size, text } ) {

    return (
        <>
        <div className='C-OK-container' style={{width: size, height: size}}>
            <div style={{fontSize: `${font}px`, lineHeight: `${font}px`}} className='C-OK-icon'>✔</div>
        </div>

        <h3 className='C-OK-text'> {text} </h3>
       </>
    )
}

export default Ok