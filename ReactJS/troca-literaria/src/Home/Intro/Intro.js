import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import "./Intro.css"
import IMG from '../../imagens/IntroBook.png'
function Intro(){


    return (
        <div className='I-Background'>
            <div className='I-Container-Itens'>
                <div className='I-Container-Left'>
                    <h1 style={{color: 'var(--accent)'}}>Anuncie Livros E Troque Por Outros!</h1>
                    
                    <span className='I-Left-Text' >Seu livro favorito pode ser o tesouro de outra pessoa.</span>
                    <span className='I-Left-Text'>Troque-o por outro e embarque em uma nova jornada literária.</span>
                    <span className='I-Left-Text'>É mais do que uma troca, é uma maneira de conectar pessoas através da leitura.</span>
                    <br/>
                    <br/>
                    <Link to={'/addbook'} className='I-Left-Link'>
                        <button className='I-Left-Button'>
                            Anuncie
                        </button>
                    </Link>

                </div>

                <div className='I-Container-Right'>
                    <div className='I-Right-Image-Container-All'>
                        <div className='I-Right-Image-Container'>
                            <img src={IMG} alt='imagem ilustrativa' className='I-Right-Image'/>
                        </div>

                        <div className='I-Right-Image-Background'/>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Intro
