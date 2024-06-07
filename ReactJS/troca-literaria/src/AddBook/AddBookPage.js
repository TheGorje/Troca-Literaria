import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../Login/LoginContext'
import { useParams } from 'react-router-dom';

import axios from 'axios'
import Header from '../Header/Header'
import AddBook from './AddBook'

function AddBookPage() {
    const { isLoggedIn, User } = useContext(LoginContext)
    const { book_id } = useParams()

    const [BookEditable, setBookEditable] = useState(null)
    const [IsBookEditable, setIsBookEditable] = useState(null)


    useEffect(()=>{
        if (isLoggedIn === false) {
            window.location.href = '/login/addbook'
        }
    },[isLoggedIn])

    useEffect(()=>{
        if (book_id !== undefined && isLoggedIn === true) {
            axios.get(`http://localhost/bookloop/Book/GetBookByID.php?book_id=${book_id}`)
            .then(response => {
                const data = response.data
                if ( parseInt(data.user_id) === parseInt(User.Id) ) {
                    data['image_urls'] = JSON.parse(data.image_urls)
                    setBookEditable( data )
                    setIsBookEditable(true)
                }
                else {
                    setBookEditable( null )
                    setIsBookEditable( false )

                }
            })
            .catch(error => {
                console.error('Erro ao adicionar receita:', error)
            })
        } else { setIsBookEditable( false ) }
    },[book_id])

    return (
        <div>
            <Header />

            {(isLoggedIn && IsBookEditable !== null) &&
                <div>
                    <AddBook book_edit={BookEditable}/>

                </div>
            }
        </div>
    )
}
export default AddBookPage
