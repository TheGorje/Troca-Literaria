import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './Login/LoginContext'

import Home from './Home/Home'
import ShowBook from './ShowBook/ShowBook'
import ShowUser from './ShowUser/ShowUser'

import LoginPage from './Login/LoginPage'
import AddBookPage from './AddBook/AddBookPage'
import Search from './Search/Search'
import MyAccount from './MyAccount/MyAccount'

function App() {
    return (
        <AuthProvider> {/* passa as informações de login em toda as rotas*/}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />

                    <Route path="/book/:id" element={<ShowBook />} />
                    <Route path="/user/:id" element={<ShowUser/>} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login/:direction" element={<LoginPage />} />

                    <Route path="/createAccount" element={<LoginPage />} />
                    <Route path="/createAccount/:direction" element={<LoginPage />} />

                    <Route path="/myAccount/" element={<MyAccount />} />
                    <Route path="/myAccount/:area" element={<MyAccount />} />

                    <Route path="/addbook" element={<AddBookPage />} />
                    <Route path="/addbook/:book_id" element={<AddBookPage />} />

                    <Route path="/search/" element={<Search />} />
                    <Route path="/search/:query" element={<Search />} />
                    <Route path="/search/genre/:genreId" element={<Search />} />
                    <Route path="/search/type/:typeId" element={<Search />} />


                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
