import React from 'react'
import './Loading.css'

const Loading = ({ border, size }) => (
    <div className="C-loading"
        style={{
            height: `${size}px`, width: `${size}px`,
            border: `${border}px solid var(--background-3)`,
            borderTop: `${border}px solid var(--accent)`,
        }} />
)

export default Loading
