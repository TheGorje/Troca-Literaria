import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';

import Flickity from 'react-flickity-component'
import "./flickity.css";



import { Link } from 'react-router-dom'

import { _genre } from '../../DATA'

import "./Showcase.css"


function ShowCase(){
    const [Selected, setSelected] = useState(1)
    const [Books, setBooks]= useState([])
    const [RandomBooks, setRandomBooks]= useState([])
    const [RecomendationBooks, setRecomendationBooks]= useState([])


    useEffect(()=>{
        if (Selected === 1 && Books.length <=0) {
            axios.post(`http://localhost/bookloop/Book/GetLastBook.php?num_items=${8}`)
            .then(response => {
                console.log( response.data )
                setBooks(response.data)
            })
            .catch(error => {
                console.error('Erro ao buscar livros:', error)
                setBooks([])
            })
        }

        else if (Selected === 2 && RandomBooks.length <=0) {
            axios.post(`http://localhost/bookloop/Book/GetRandomBooks.php?num_items=${8}`)
            .then(response => {
                console.log( response.data )
                setRandomBooks(response.data)
            })
            .catch(error => {
                console.error('Erro ao buscar livros:', error)
                setRandomBooks([])
            })
        }
        
        else if (Selected === 3 && RecomendationBooks.length <=0) {
            axios.post(`http://localhost/bookloop/Book/GetRecomendationBooks.php?num_items=${8}`)
            .then(response => {
                console.log( response.data )
                setRecomendationBooks(response.data)
            })
            .catch(error => {
                console.error('Erro ao buscar livros:', error)
                setRecomendationBooks([])
            })
        }
    },[Selected])

    function TabSeletor(){
        return(
            <div className='S-Container-Tab'>
                <div >
                    <button className={`${Selected === 1 ? 'S-Tab-Button S-Tab-Actived' : 'S-Tab-Button '}`}
                        onClick={() => setSelected(1)}>
                        <span  > Mais Recentes </span>
                    </button>

                    <button className={`${Selected === 2 ? 'S-Tab-Button S-Tab-Actived' : 'S-Tab-Button '}`}
                        onClick={() => setSelected(2)}>
                        <span > Aleatórios </span>
                    </button>

                    <button className={`${Selected === 3 ? 'S-Tab-Button S-Tab-Actived' : 'S-Tab-Button '}`}
                        onClick={() => setSelected(3)}>
                        <span > Recomendados </span>
                    </button>

                </div>
            </div>
        )
    }

    function FlickitySlider(){
        let CurrentBooks
        switch (Selected) {
            case 1:
                CurrentBooks = Books
                break
            case 2:
                CurrentBooks = RandomBooks
                break
            case 3:
                CurrentBooks = RecomendationBooks
                break
            default:
                CurrentBooks = Books
                break
        }

        let itens = [1,2,3,4,5,6,7,8]
        if ( CurrentBooks.length >= 1) {
            itens = CurrentBooks
        }
        const flickityOptions = {
            initialIndex: 1
        }

        return (
            <Flickity
                className={'carousel'}
                elementType={'div'}
                options={flickityOptions}
                disableImagesLoaded
                reloadOnUpdate
                static
            >
                {itens.map((item, i) => {
                    let imageUrlsArray
                    if (CurrentBooks.length >= 1) {
                        imageUrlsArray = JSON.parse(item.image_urls)
                    }

                    return (
                        <div className={CurrentBooks.length >= 1 ? 'flickity-card-withBooks' : 'flickity-card' } key={i}>
                            {CurrentBooks.length >= 1 &&
                                // <BookCardCompact book={item} />
                                <div className='flickity-image-container'>
                                    <Link to={`/book/${item.id}`}>
                                        <img src={imageUrlsArray[0]} alt='livro imagem' className='flickity-image' />
                                    </Link>
                                </div>
                                
                            }

                        </div>
                    )
                })}
            </Flickity>
        )
    }

    return (
        <>
            <TabSeletor />
            <FlickitySlider/>
        </>
    )
}

export default ShowCase
