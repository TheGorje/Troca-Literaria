import React from 'react'


import Header from '../Header/Header'
import Login from './Login'


function LoginPage( ) {

    return (
        <div style={{display: 'grid', justifyContent: 'center', gap: '20px'}}>
            <Header />
            <Login />
        </div>
    )
}

export default LoginPage