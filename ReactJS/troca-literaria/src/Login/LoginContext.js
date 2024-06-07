import React, { createContext, useState } from 'react';

export const LoginContext = createContext()

export const AuthProvider  = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const authUser = JSON.parse(localStorage.getItem('user'))
        if (authUser) {
            return true
        }
        return false
    })
    const [User, setUser] = useState(() => {
        const authUser = JSON.parse(localStorage.getItem('user'))
        if (authUser) {
            return authUser
        }
        return null
    })

    const handleLogin = (Token, Id, Name, Img) => {
        localStorage.setItem('user', JSON.stringify({ Token, Id, Name, Img }))
        setIsLoggedIn(true)
        setUser({ Token, Id, Name, Img })
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        setUser(null)
    }

    return (
        <LoginContext.Provider value={{ isLoggedIn, User, handleLogin, handleLogout }}>
            {children}
        </LoginContext.Provider>
    )
}