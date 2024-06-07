import React, { useEffect, useState } from 'react'

import Axios from 'axios'

import './Home.css'

import Header from '../Header/Header'
import Intro from './Intro/Intro'
import GenrePresentation from './GenrePresentation/GenrePresentation'
import ShowCase from './Showcase/Showcase'
import IntroSearch from './IntroSearch/IntroSearch'

function Home() {
    const [BooksByGenre, setBooksByGenre] = useState([])

    useEffect(() => {
        if (BooksByGenre.length >= 1) {return}
        // Faz uma solicitação HTTP para o script PHP para buscar livros
        Axios.get("http://localhost/bookloop/Book/GetGenreRandom.php?random=3&num_items=5")
            .then(response => {
                const BooksByGenre = response.data
                if (Array.isArray(BooksByGenre)) {
                    setBooksByGenre(response.data)
                }
                console.log('request', BooksByGenre.length >= 1)
            })
            .catch(error => {
                console.error('Erro ao buscar generos:', error)
            })
    }, [BooksByGenre])

    return (
        <div>
            <Header />
            <Intro />

            <div className='H-Container-All'>
                <ShowCase />
                <br/>
            </div>
            <IntroSearch />

            <div className='H-Container-All'>
                <div className='GP-Genre-Container'>
                    {BooksByGenre.map((item, i) => (
                        <GenrePresentation key={`${item['genre_id']}-${i}`}
                            Genre={item['genre_id']} Arr={item['items']} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Home