import React, { useContext, useEffect, useState } from 'react';
import './HeaderStart.css';

import { LoginContext } from '../Login/LoginContext'


import {ReactComponent as Logo} from '../imagens/logo.svg'

import {_type, _genre} from "../DATA"
import { Link } from 'react-router-dom';

function HeaderStart(){
    const { isLoggedIn, User, handleLogout } = useContext(LoginContext)
    const [Perfil, setPerfil] = useState(<></>)


    const [IsOpen, setIsOpen] = useState(false)
    const [ShowTypes, setShowTypes] = useState(false)
    const [ShowGenres, setShowGenres] = useState(false)

    const [BookTypes] = useState(Object.values(_type))
    const [BookGenres] = useState(Object.values(_genre))

    useEffect(() => {
        if (ShowTypes && ShowGenres) {
            setShowGenres(false)
        }
    }, [ShowTypes])

    useEffect(() => {
        if (ShowGenres && ShowTypes) {
            setShowTypes(false)
        }
    }, [ShowGenres])


    useEffect(()=>{
        if (User?.Img) {
            setPerfil(
                <img style={{ border: '0' }} className='HE-Perfil-Image' src={User.Img} alt='perfil' />
            )
        }
        else {
            setPerfil(
                <div className='HE-profile-icon'/>
            )
        }
    },[])


    function UserPerfil() {

        return (
            <div onClick={() => { setIsOpen(false) }}>

                {isLoggedIn ?
                    <>
                        <Link to={`/myAccount`} className='HS-perfil-container' style={{ flexDirection: User?.Name.length >= 25 ? 'column' : '' }}>
                            <div className='HE-Perfil-Image-container' style={{ border: '0' }}>
                                {Perfil}
                            </div>

                            <div style={{ width: '76%' }}>
                                <h3 style={{ wordWrap: 'break-word' }}> {User?.Name} </h3>
                                <h5 style={{ opacity: '0.6', cursor: 'pointer', width: '65%' }}> Minha Conta
                                    <div className='HE-Perfil-Mark' /></h5>
                            </div>

                        </Link>

                        <div className='HS-perfil-buttonLogout' onClick={() => handleLogout()}>
                            <h4 className='HE-Perfil-Open-Exit'> Sair </h4>
                        </div>
                    </>
                    :
                    <>
                    <Link to={`/login`} >
                        <div className='HS-perfil-button-account' style={{color: 'var(--accent)'}}>
                            Entrar
                        </div>
                    </Link>

                    <Link to={'/createAccount'}>
                        <div className='HS-perfil-button-account'>
                            Criar Conta
                        </div>
                    </Link>
                    </>
                }

            </div>
        )
    }




    return (
        <>
            {IsOpen && <div className='HS-modal-close' onClick={()=> setIsOpen(!IsOpen)}/>}

            <div className='H-Start' onClick={()=>setIsOpen(!IsOpen)}>
                <div className='HS-Hamburger-container'>
                    <div className='HS-Hamburger' />
                    <div className='HS-Hamburger' />
                    <div className='HS-Hamburger' />
                </div>
            </div>

            {(BookTypes !== null && BookGenres !== null) &&
                <div className={`HS-sidebar ${IsOpen ? 'open' : ''}`}>
                    <div style={{width: '280px'}}>
                        <div className='HS-logo-container'>
                            <Link to={'/home'} onClick={()=> setIsOpen(false)}>
                                <Logo className='HS-SVGlogo' />
                            </Link>
                            <div className='HS-button-close' onClick={()=>setIsOpen(!IsOpen)} > X </div>
                        </div>

                        <Link to={'/addbook'} onClick={() => setIsOpen(false)}>
                            <div className='HS-select'>
                                <button className='HS-sidebar-announcement'>
                                    Anunciar
                                </button>
                            </div>
                        </Link>

                        <Link to={'/search'} onClick={() => setIsOpen(false)}>
                            <div className='HS-select'>
                                <button className='HS-sidebar-explore'>
                                    Explorar
                                </button>
                            </div>
                        </Link>

                        <div className='HS-select'  style={{width: '300px'}}>
                            <button className='HS-sidebar-button' onClick={() => { setShowTypes(!ShowTypes) }}
                                style={{backgroundColor: ShowTypes && 'var(--background-3)'}}>
                                Tipos
                            </button>

                            {ShowTypes && (
                                <ul>
                                    {BookTypes.map((type, index) => (
                                        <Link to={`/search/type/${(type)}`}>
                                            <li key={index} onClick={()=> setIsOpen(false)}>{type}</li>
                                        </Link>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className='HS-select'  style={{width: '300px'}}>
                            <button className='HS-sidebar-button' onClick={()=>{setShowGenres(!ShowGenres)}}
                                style={{backgroundColor: ShowGenres && 'var(--background-3)'}}>
                                Gêneros
                            </button>

                                {ShowGenres && (
                                    <ul >
                                        {BookGenres.map((type, index) => (
                                            <Link to={`/search/genre/${(index + 1)}`}>
                                                <li key={index} onClick={()=> setIsOpen(false)}> {type} </li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                        </div>

                    </div>

                    <UserPerfil />
                </div>
            }
        </>
    )
}

export default HeaderStart