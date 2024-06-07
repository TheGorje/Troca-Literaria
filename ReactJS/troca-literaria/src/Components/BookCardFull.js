import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import "./BookCardFull.css"
import { Link } from 'react-router-dom';
import { LoginContext } from '../Login/LoginContext'

import { ReactComponent as Pags } from "../imagens/card/pags.svg"
import { ReactComponent as Calendar } from "../imagens/card/calendar.svg"
// import { ReactComponent as Clock } from "../imagens/card/clock.svg"
import { ReactComponent as Type } from "../imagens/card/type.svg"

import { ReactComponent as Book } from "../imagens/card/book.svg"

import { ReactComponent as BookUsado } from "../imagens/card/book.svg"
import { ReactComponent as BookDesgastado } from "../imagens/card/book desgastado.svg"
import { ReactComponent as BookBemDesgastado } from "../imagens/card/book bem-desgastado.svg"
import { ReactComponent as Shine } from "../imagens/card/shine.svg"

import { ReactComponent as Edit } from "../imagens/edit.svg"
import { ReactComponent as Trash } from "../imagens/trash.svg"
import Ok from './Signals/Ok/ok';
import Error from './Signals/Error/Error';

function BookCardFull({ book, hideUser }) {
    const imageUrlsArray = JSON.parse(`${book.image_urls}`)
    const { User, isLoggedIn } = useContext(LoginContext)
    const [bookStatus, setBookStatus] = useState('default')
    const [bookStatusText, setbookStatusText] = useState('')

    const [isActive, setisActive] = useState(book.isActive)


    const Condition = ({ book_condition }) => {
        switch (book_condition) {

            case 'Lacrado':
                return (
                <div className='C-BCF-icon-lacrado'>
                    <Book className='C-BCF-icon' />
                </div>
                )

            case 'Novo':
                return (
                <div style={{position: 'relative'}}>
                    <Shine className='C-BCF-icon-star' style={{left: '10px', top: '1px', animation: 'star-1 6s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '10px', top: '11px', animation: 'star-2 8s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '4px', top: '2px', animation: 'star-3 5s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '2px', top: '7px', animation: 'star-2 4s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '8px', top: '7px', animation: 'star-1 5s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '12px', top: '15px', animation: 'star-2 5s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '5px', top: '13px', animation: 'star-3 6s infinite'}}/>
                    <Shine className='C-BCF-icon-star' style={{left: '13px', top: '6px', animation: 'star-1 4s infinite'}}/>
                    <Book className='C-BCF-icon' />
                </div>
                )
            case 'Usado':
                return <BookUsado className='C-BCF-icon' />
            case 'Desgastado':
                return <BookDesgastado className='C-BCF-icon' />
            case 'Bem Desgastado':
                return <BookBemDesgastado className='C-BCF-icon' />
            default:
                return null;
        }
    }

    const renderImage = () => {
        function ImageChanger({ images }) {
            const [Index, setIndex] = useState(0)
            const [Hovering, setHovering] = useState(false)
        
            useEffect(() => {
                let timer
                if (Hovering && Index < images.length - 1) {
                    timer = setTimeout(() => {
                        setIndex(Index + 1)
                    }, 800)
                }
                return () => clearTimeout(timer)
            }, [Hovering, Index, images.length])
        
            return (
                <img
                    className='C-BCF-card-img'
                    src={images[Index]}
                    onMouseOver={() => setHovering(true)}
                    onMouseOut={() => {
                        setHovering(false)
                        setIndex(0)
                    }}
                    alt="Imagem dinâmica"
                />
            );
        }

        const style = {
            display: 'flex',
            height: '200px',
            gap: '10px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }

        if (bookStatus === 'default') {
            return (
                <Link to={`/book/${book.id}`} >
                    <div className='C-BCF-card-img-container'>
                        <ImageChanger images={imageUrlsArray}/>
                        {/* <img className='C-BCF-card-img' src={imageUrlsArray[0]} alt={book.title} /> */}
                    </div>
                </Link>
            )
        }
        else if (bookStatus === 'ok') {
            return (
                <div style={style}>
                    <Ok size={ 50 } font={ 58 } text={bookStatusText}/>
                </div>
            )
        }
        else if (bookStatus === 'error') {
            return (
                <div style={style}>
                    <Error size={ 50 } font={ 58 } text={bookStatusText} />
                </div>
            )
        }
    }

    function UserBook() {
        const [isDeleteClicked, setDeleteClicked] = useState(false)
        const [count, setCount] = useState(5)

        const DeleteBook = () =>{
            axios.post("http://localhost/bookloop/Book/DeleteBookByID.php", {book_id: book.id, token: User.Token, user_id: User.Id})
            .then(response => {
                console.log(response.data)
                if (response.data.success === true){
                    setBookStatus('ok')
                    setbookStatusText('Anúncio Deletado')
                }
                else {
                    setBookStatus('error')
                    setbookStatusText('Erro Ao Deletar Anúncio')
                }

            })
            .catch(error => {
                console.error('Erro ao deletar livro:', error)
                setBookStatus('error')
                setbookStatusText('Erro Ao Deletar Anúncio')
            })
        }
        const handleDeleteClick = () => {
            setDeleteClicked(true)
        }
        const handleCancelClick = () => {
            setDeleteClicked(false)
            setCount(5) // Reset the count when cancel is clicked
        }

        const handleActiveClick = () =>{
            axios.post("http://localhost/bookloop/Book/SetBookIsActive.php", {isActive: 1,book_id: book.id, token: User.Token, user_id: User.Id})
            .then(response => {
                console.log(response.data)
                if (response.data.success === true){
                    setisActive(1)
                    setBookStatus('ok')
                    setbookStatusText('Anúncio Ativado')
                } else {
                    setisActive(0)
                    setBookStatus('error')
                    setbookStatusText('Erro Ao Ativar Anúncio')
                }

            })
            .catch(error => {
                console.error('Erro ao ativar livro:', error)
                setBookStatus('error')
                setbookStatusText('Erro Ao Ativar Anúncio')
            })
        }

        useEffect(() => {
            if (isDeleteClicked && count > 0) {
                const timerId = setTimeout(() => {
                    setCount(count - 1)
                }, 1000)
                return () => clearTimeout(timerId)
            }
        }, [isDeleteClicked, count])

        return (
            <div style={{display: 'flex', gap: '10px'}}>
                {(!isDeleteClicked && isActive )? (
                    <>
                        <Link className='C-CBF-card-edit' to={`/addbook/${book.id}`} target="_blank">
                            <Edit style={{height: '22px', width: '22px', fill: 'var(--accent)'}}/>
                            <h4 style={{padding: '4px'}} >Editar </h4>
                        </Link>

                        <div  className='C-CBF-card-delete' onClick={handleDeleteClick}>
                            <Trash style={{height: '18px', width: '18px', fill: 'var(--red)'}}/>
                            <h4 style={{padding: '4px'}} > Deletar </h4>
                        </div>
                    </>
                )
                :
                (!isActive ?
                    <>
                        <div  className='C-CBF-card-active' onClick={handleActiveClick}>
                            <h4 style={{padding: '4px'}} > Ativar </h4>
                        </div>
                    </>
                    :
                    <>
                        <button className='C-CBF-card-delete' onClick={()=>DeleteBook()}
                            disabled={ count >= 1 } style={{border: count >= 1 && '0', backgroundColor: count >= 1 && 'var(--background-2)'}}>

                            <Trash style={{height: '18px', width: '18px', fill: 'var(--red)'}}/>
                            <h4 style={{padding: '4px', minWidth: '30px'}} > {count >= 1 ? count : 'Confirmar'} </h4>

                        </button>

                        <h4 onClick={handleCancelClick} className='C-CBF-card-edit'> Cancelar </h4>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className={`C-BCF-card-container ${!isActive && 'C-BCF-card-container-inative'}`} >
            <div style={{display: 'grid', justifyItems: 'center'}}>
                <h6 className='C-BCF-text-opacity' style={{ marginBottom: '5px', textAlign: 'center' }}> 
                    {(book.author.length >= 50) ? book.author.substring(0, 40) + "..." : book.author }
                </h6>
                {renderImage()}

            </div>

            <Link to={`/book/${book.id}`}>
                <h4 className='C-BCF-card-title'> {(book.title.length >= 50) ? book.title.substring(0, 50) + "..." : book.title } </h4>
            </Link>

            <div className='C-BCF-details-container'>
                <div style={{ display: 'grid', gap: '10px', width: '55px' }}>
                    <div className="C-BCF-icon-container">
                            <Pags className='C-BCF-icon' />
                            <h5 className='C-BCF-text-opacity' > {book.pags} </h5>
                    </div>

                    <div className="C-BCF-icon-container" >
                        <Calendar className='C-BCF-icon' />
                        <h5 className='C-BCF-text-opacity' > {book.year} </h5>
                    </div>

                </div>

                <horizontal className="C-BCF-horizontal" />

                <div style={{ display: 'grid', gap: '10px', width: '65px' }}>

                    <div className="C-BCF-icon-container" >
                        <Condition book_condition={book.book_condition} />
                        <h5 className='C-BCF-text-opacity' > {book.book_condition} </h5>
                    </div>

                    <div className="C-BCF-icon-container" >
                        <Type className='C-BCF-icon' style={{ width: '18px', height: '18px', rotate: '90deg' }} />
                        <h5 className='C-BCF-text-opacity' style={{ whiteSpace: 'nowrap' }}> {book.type} </h5>
                    </div>

                </div>
            </div>

            <line style={{ width: '110%', height: '2px', backgroundColor: 'var(--background)' }} />

            {((isLoggedIn && User !== null) && ( parseInt(User.Id) === parseInt(book.user_id) )) ?
                <UserBook />
            :
                hideUser === true ?
                    <>
                    </>
                :
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to={`/user/${book.user_id}`} className='C-CBF-perfil-container'>
                            {book['user']['photo'].length >= 1 ?
                                <img className='C-CBF-perfil' src={book.user.photo} alt="foto de perfil do usuario" />
                                :
                                <div className='C-CBF-perfil-unknown' />
                            }
                        </Link>
                        
                        <Link to={`/user/${book.user_id}`}>
                            <h5 className='C-BCF-text-username'> {book.user.username} </h5>
                        </Link>
                    </div>
                
            }


        </div>
    )
}

export default BookCardFull
