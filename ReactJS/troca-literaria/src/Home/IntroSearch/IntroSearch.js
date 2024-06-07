import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Link } from 'react-router-dom'

import "./IntroSearch.css"
import IMG from "../../imagens/SearchBook.png"


function IntroSearch(){


    return (
        <div className='IS-Background'>
            <div className='IS-Container-Itens'>
                <div className='IS-Container-Left'>
                    <h1 style={{color: 'var(--text)'}}>Explore, pesquise e descubra seu novo livro favorito!</h1>

                    <span className='IS-Left-Text' >Seu próximo livro favorito pode estar a apenas uma pesquisa de distância</span>
                    <span className='IS-Left-Text'>Procurando por uma nova leitura?</span>
                    <span className='IS-Left-Text'>Descubra livros que irão te levar a novas jornadas literárias</span>
                    <span className='IS-Left-Text'>Comece sua busca agora!</span>

                    <br/>
                    <br/>
                    <Link to={'/search'} className='IS-Left-Link'>
                        <button className='IS-Left-Button'>
                            Explorar
                        </button>
                    </Link>

                </div>

                <div className='IS-Container-Right'>
                    <div className='IS-Right-Image-Container-All'>
                        <div className='IS-Right-Image-Container'>
                            <img src={IMG} alt='imagem ilustrativa' className='IS-Right-Image'/>
                        </div>

                        <div className='IS-Right-Image-Background'/>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default IntroSearch
