import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import "./BookCardFull.css"
import { Link } from 'react-router-dom';
import { LoginContext } from '../Login/LoginContext'

import Ok from './Signals/Ok/ok';
import Error from './Signals/Error/Error';

function BookCardCompact({ book }) {
    const imageUrlsArray = JSON.parse(book.image_urls)

    const [bookStatus, setBookStatus] = useState('default')
    const [bookStatusText, setbookStatusText] = useState('')

    console.log(book)


    return (
        <div className='C-BCF-card-container' style={{width: '190px', padding: '5px', borderRadius: '5px', gap: '5px'}} >
            <div>
                <h6 className='C-BCF-text-opacity' style={{ marginBottom: '5px', textAlign: 'center' }}> {book.author} </h6>

                <Link to={`/book/${book.id}`} >
                    <div className='C-BCF-card-img-container' 
                        style={{width: '170px', height: '270px' }}>
                        <img className='C-BCF-card-img' src={imageUrlsArray[0]} alt={book.title} />
                    </div>
                </Link>

            </div>

            <Link to={`/book/${book.id}`}>
                <h4 className='C-BCF-card-title'> {book.title} </h4>
            </Link>
        </div>
    )
}

export default BookCardCompact
