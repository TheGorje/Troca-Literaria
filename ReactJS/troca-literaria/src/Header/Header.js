import React from 'react'
import { Link } from 'react-router-dom'


import { ReactComponent as SVGlogo } from '../imagens/logo.svg'
import "./Header.css"
import HeaderEnd from "./HeaderEnd.js"
import HeaderStart from "./HeaderStart.js"

function Header() {
    return (
        <>
            <div className='H-container'>
                <HeaderStart />

                <div className='H-Center'>
                    <Link to={`/home`} className='H-Center-Container'>
                        <SVGlogo className='H-Center-Logo' />
                        <h2 className='H-Center-Text-Name'>Troca Literária</h2>
                    </Link>

                </div>

                <HeaderEnd />
            </div>

            <div style={{ marginTop: '60px' }} />
        </>
    )
}

export default Header;
