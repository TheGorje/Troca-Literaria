import React, { useEffect, useState } from 'react';

import Flickity from 'react-flickity-component'
import "../Showcase/flickity.css";


import { Link } from 'react-router-dom';

import { _genre } from '../../DATA'

import BookCardFull from '../../Components/BookCardFull'

import "./GenrePresentation.css"

function GenrePresentation({ Genre, Arr }){
    return (
        <>
        <div>
            <Link to={`/search/genre/${Genre}`} style={{textAlign: 'center'}}>
                <h2 className='GP-genre-text'>
                    {_genre[Genre]} 
                </h2>
            </Link>

            <Flickity
                className={'carousel'}
                elementType={'div'}
                options={{ initialIndex: 1 }}
                disableImagesLoaded
                reloadOnUpdate
                static
            >
                {Arr.map((values, i) => (
                    <div className={'flickity-card-withBooks'} key={i}>
                        <BookCardFull key={`${values.author} ${i}`} book={values} hideUser={false} />
                    </div>

                ))}

                <Link to={`/search/genre/${Genre}`} style={{ alignSelf: 'center' }}>
                    <div className='GP-Card-VerMais'>
                        +
                    </div>
                </Link>
            </Flickity>
        </div>

        <line style={{width: '100%', height: '5px', backgroundColor: 'var(--background-2)'}}/>
        </>
    )
}

export default GenrePresentation
