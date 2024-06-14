import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { LoginContext } from '../Login/LoginContext.js'

import Flickity from 'react-flickity-component'
import ScoreInStar from '../Components/ScoreInStar/ScoreInStar.js'

import axios from 'axios'
import { _genre } from '../DATA.js'
import Header from "../Header/Header"
import {ReactComponent as Whatsapp} from "../imagens/whatsapp.svg"
import {ReactComponent as SvgEdit} from "../imagens/edit.svg"

import "./ShowBook.css"
import '../Home/Showcase/flickity.css'

import BookCardFull from "../Components/BookCardFull.js"
import UserFeedback from '../Components/UserFeedback/UserFeedback.js'

function BookPage() {
    const { User } = useContext(LoginContext)

    const { id } = useParams()
    const [BookInfos, setBookInfos] = useState(null)
    const [BookImages, setBookImages] = useState([])
    const [UserInfos, setUserInfos] = useState(null)

    const [UserBooksEXTRA, setUserBooksEXTRA] = useState([])
    const [SimilarBooks, setSimilarBooks] = useState([])
    const [CategoryBooks, setCategoryBooks] = useState([])


    useEffect(()=>{
        if (id !== null) {
            const link = `http://localhost/bookloop/Book/GetBookByID.php?book_id=${id}`
            axios.get(link)
            .then(response => {
                const Book = response.data
                // console.log(Book)
                if (Object.keys(Book).length >=1){
                    setBookInfos(response.data)
                    setBookImages( JSON.parse(response.data.image_urls) )
                }
                else { return setBookInfos(404)}
            })
            .catch(error => {
                console.error('Erro ao buscar livro:', error)
                return setBookInfos(404)
            })
        }

    },[id])

    useEffect(()=>{
        if (BookInfos !== null && id !== null) {
            axios.post("http://localhost/bookloop/Account/GetUserByID.php", {
                user_id: BookInfos.user_id,
                isUser: false,
            })
            .then(response => {
                console.log('usuario encontado com sucesso:', response.data)
                setUserInfos(response.data)
            })
            .catch(error => {
                console.error('Erro ao logar:', error)
            })

            // // livros similares
            axios.get("http://localhost/bookloop/Book/GetBookSimilarByQuery.php", {
                params: {
                    title: BookInfos.title,
                    num_items: 8,
                    book_id: BookInfos.id
                }
            })
            .then(response => {
                console.log('livros similares econtrados:', response.data)
                setSimilarBooks(response.data)
            })
            .catch(error => {
                console.error('Erro ao logar:', error)
                setSimilarBooks(null)
            })

            // livros category
            console.log(BookInfos)
            axios.get("http://localhost/bookloop/Book/GetBookCategoryByGenres.php", {
                params: {
                    num_items: 8,
                    book_id: BookInfos.id
                }
            })
            .then(response => {
                console.log('livros category econtrados:', response.data)
                if (Array.isArray(response.data) ){
                    setCategoryBooks(response.data)
                }
            })
            .catch(error => {
                console.error('Erro ao logar:', error)
                setCategoryBooks([])
            })

        }
    // eslint-disable-next-line
    },[BookInfos])

    useEffect(()=>{
        function GetRandom_UserBooks(){
            // mais livros do usuario (EXTRA)
            axios.get("http://localhost/bookloop/Book/GetBooksRandomByUserID.php", {
                params: {
                    user_id: BookInfos.user_id,
                    num_items: 3,
                }
            })
            .then(response => {
                // console.log('livros randomicos :', response.data)
                const result = response.data
                const itensFilted =
                    result
                    .filter(book => parseFloat(book.id) !== parseFloat(id))
                    .map(book => {
                        book['user'] = { photo: UserInfos.photo, username: UserInfos.username }
                        return book
                    })
                // console.log('filtrados: ', itensFilted )
                setUserBooksEXTRA(itensFilted)
            })
            .catch(error => {
                console.error('Erro ao logar:', error)
            })
        }

        if (BookInfos !== null && (id !== null && UserInfos !== null)) {
            GetRandom_UserBooks()
        }
    // eslint-disable-next-line
    },[UserInfos])


    // function FormatPhone( phoneNumber ){
    //     const ddd = phoneNumber.slice(0, 2)
    //     const phone = phoneNumber.slice(2, 7) + "-" + phoneNumber.slice(7);

    //     const numeroFormatado = `(${ddd}) ${phone}`
    //     return numeroFormatado
    // }


    function CreateTrade(){
        if (User === null) {
            return window.location.href = '/CreateAccount'
        }
        axios.post('http://localhost/bookloop/Trade/CreateTrade.php?',
            {
                advertiser_id: BookInfos['user_id'], // anunciante
                interested_id: User.Id, // usuario interessado
                book_id: id,
            }
        )
    }

    function FormatDate(date, type) {
        const _Date = new Date(date)

        let day = _Date.getDate().toString().padStart(2, '0')
        let mouth = (_Date.getMonth() + 1).toString().padStart(2, '0') // Os meses começam do 0, então adicionamos 1
        let year = _Date.getFullYear()

        let hours = _Date.getHours().toString().padStart(2, '0')
        let minutes = _Date.getMinutes().toString().padStart(2, '0')
        let seconds = _Date.getSeconds().toString().padStart(2, '0')

        let dateFull = `${day}/${mouth}/${year} ${hours}:${minutes}:${seconds}`

        if (type === 'hours') {
            return `${hours}:${minutes}`
        }
        else if (type === 'date') {
            return `${day}/${mouth}/${year}`
        }
        else if (type === 'year'){
            return `${year}`
        }
        else if (type === 'full') {
            return dateFull
        }
    }

    function ShowImages(){
        const [ImageSelected, setImageSelected] = useState(0) // primeira imagem do array

        return(
            <>
                {BookImages.length >= 1 ?
                    <div className='SB-image-container'>
                        <div className='SB-image-item-container'>

                            {BookImages.map((item, i)=>{
                                return(
                                    <div className='SB-image-item-base' key={`${item}-${i}`}
                                        style={{border: (ImageSelected === i ) ? '2px solid var(--accent)' : '',
                                                opacity: (ImageSelected === i) ? '1' : ''
                                        }}
                                        onClick={()=>{setImageSelected(i)}} >

                                        <img  className='SB-image-item' src={ item } alt={`livro: ${i+1}`}/>
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{position: 'relative'}}>
                            <>
                                <div style={{width: '100%', height: '100%'}}>
                                    <img className='SB-imgs'
                                        src={BookImages[ImageSelected]} alt={`imagem do livro: ${BookInfos.title} ${ImageSelected+1}`} />

                                </div>
                            </>
                        </div>
                    </div>

                :
                    null
                }
            </>
        )
    }

    function SellerPerfil() {

        function DirectToWhatsApp() {
            let number = '55' + UserInfos['phone_number']
            let message  = `Troca Literária: ${BookInfos['title']}`
            let url = `https://wa.me/${number}?text=${encodeURIComponent(message )}`
            return url
        }

        function PhotoPerfil(){
            return(
            <Link to={`/user/${BookInfos.user_id}`}>
                {UserInfos['photo'].length >= 1 ?
                    <div className='SB-perfil'>
                        <img className="SB-perfil-photo"
                            src={UserInfos['photo']} alt="perfil" />
                    </div>
                :
                    <div className='SB-perfil'>
                        <div className="SB-profile-icon"/>
                    </div>

                }
            </Link>
            )
        }

        return (
            <div className='SB-seller'>
                <Link to={`/user/${BookInfos.user_id}`}>
                    <h3 style={{ color: 'var(--accent)', textAlign: 'center' }}> {UserInfos['username']} </h3>
                </Link>

                <div className='SB-seller-infos-container'>
                    <PhotoPerfil />
                    {UserInfos.average_score > 0 &&
                        <ScoreInStar score={UserInfos.average_score}/>
                    }
                    <UserFeedback feedback={UserInfos.feedbacks}/>
                </div>

                { parseInt(BookInfos.user_id) === parseInt(User?.Id ) ?
                    <>
                    <Link to={`/myAccount`}>
                        <button className='SB-seller-button'>
                            Minha Conta
                        </button>
                    </Link>

                    <h6 style={{opacity: '0.6'}}>Este é um anúncio seu</h6>
                    </>
                :
                    <>
                    <a onClick={()=> CreateTrade()} href={DirectToWhatsApp()} target="_blank" rel="noopener noreferrer"
                        style={{display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <div className='SB-seller-Whatsapp-container'>
                            <Whatsapp className='SB-seller-Whatsapp'/>
                        </div>

                        <button className='SB-seller-button'>
                            {/* {FormatPhone(UserInfos['phone_number'])} */}
                            Solicitar Troca
                        </button>
                    </a>

                    <h6 style={{opacity: '0.6'}}>Entre em contato com o anunciante</h6>
                    </>
                }

                <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />
                <h6 style={{ opacity: '0.6' }}>Na <span style={{ color: 'var(--accent)' }}>Troca Literária</span> desde {FormatDate(UserInfos['created_at'], 'year')}</h6>

                <Link to={`/user/${BookInfos.user_id}`}>
                    <h4 className='SB-seller-see-text' style={{userSelect: 'none'}}>Ver todos os anúncios</h4>
                </Link>
            </div>
        )
    }

    function UserBooks(){
        return(
            <>
                <h1 style={{color: 'var(--accent)', textAlign: 'center'}}>+</h1>

                <div style={{display: 'grid', justifyItems: 'center', gap: '20px'}}>
                    {UserBooksEXTRA.map((book, i)=>{
                        return <BookCardFull book={book} hideUser={true} key={i}/>
                    })}

                </div>
            </>
        )
    }

    function SellerPerfilTop() {

        function DirectToWhatsApp() {
            let numero = '55' + UserInfos['phone_number']
            let mensagem = `Troca Literária: ${BookInfos['title']}`
            let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
            return url
        }

        return (
            <>
                <div className='SB-seller-top'>
                    {parseInt(BookInfos.user_id) !== parseInt(User?.Id) &&
                        <div className='SB-seller-Whatsapp-fixed'>

                            <a onClick={() => CreateTrade()} href={DirectToWhatsApp()} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                <div className='SB-seller-Whatsapp-container'>
                                    <Whatsapp className='SB-seller-Whatsapp' />
                                </div>
                                <button className='SB-seller-button'>
                                    {/* {FormatPhone(UserInfos['phone_number'])} */}
                                    Solicitar Troca
                                </button>
                            </a>
                        </div>
                    } 

                    <div className='SB-seller-top-container'>
                        <Link to={`/user/${BookInfos.user_id}`} style={{textDecoration: 'none'}}>
                            <h3> 
                                <span style={{ color: 'var(--accent)' }}> {UserInfos['username']} </span>
                                
                                <span style={{ color: 'var(--text)', opacity: '0.6', fontSize: '16px' }}> 
                                {parseInt(BookInfos.user_id) !== parseInt(User?.Id) ? '(Anunciante)':'(Você)'}
                                </span>

                            </h3>
                        </Link>

                    </div>

                </div>
            </>
        )
    }

    function FlickitySliderSimilar(){

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
                {SimilarBooks.map((item, i) => {
                    const imageUrlsArray = JSON.parse(item.image_urls)

                    return (
                        <div className='flickity-card-withBooks' key={i}>
                            <div className='flickity-image-container' style={{width: '165px', height: '250px'}}>

                                <Link to={`/book/${item.id}`} target='_blank'>
                                    <img src={imageUrlsArray[0]} alt='livro imagem' className='flickity-image' />
                                </Link>
                            </div>

                        </div>
                    )
                })}
            </Flickity>
        )
    }

    function FlickitySliderCategory(){
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
                {CategoryBooks.map((item, i) => {
                    const imageUrlsArray = JSON.parse(item.image_urls)

                    return (
                        <div className='flickity-card-withBooks' key={i}>
                            <div className='flickity-image-container'>

                                <Link to={`/book/${item.id}`} target='_blank'>
                                    <img src={imageUrlsArray[0]} alt='livro imagem' className='flickity-image' />
                                </Link>
                            </div>

                        </div>
                    )
                })}
            </Flickity>
        )
    }


return (
        <>
            <Header/>
            <br/>
            {((BookInfos !== null && BookInfos !== 404) && UserInfos !== null) ?
                (
                    BookInfos?.isActive ? 
                        <div className='SB-main-container'>
                            <div className='SB-container-all'>

                                <div className='SB-left'>
                                    {parseInt(BookInfos.user_id) === parseInt(User?.Id) &&
                                        <Link to={`/addBook/${BookInfos.id}`}>
                                            <SvgEdit className='SB-left-SvgEdit' />
                                        </Link>
                                    }

                                    <h1 style={{ textAlign: 'center' }}> {BookInfos['title']} </h1>
                                    <h5 style={{ opacity: '0.6' }}>Publicado em: {FormatDate(BookInfos['created_at'], 'date')} as {FormatDate(BookInfos['created_at'], 'hours')}</h5>

                                    <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                                    <ShowImages />
                                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        {BookInfos['genres'].map((item, i) => {
                                            return (
                                                <Link to={`/search/genre/${item}`} className='SB-genre-item' key={i}>
                                                    {_genre[item]}
                                                </Link>
                                            )
                                        })}

                                    </div>

                                    <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                                    <h4>
                                        {BookInfos['description']}
                                    </h4>

                                    <br />
                                    <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                                    {BookInfos['user_description'].length >= 1 &&
                                        <>
                                            <h2>Comentário</h2>
                                            <h4 style={{ opacity: '0.6' }}>
                                                {BookInfos['user_description']}
                                            </h4>

                                            <br />
                                            <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />
                                        </>
                                    }

                                    <h2>
                                        Detalhes
                                    </h2>
                                    <div className='SB-details-container'>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            <h4 style={{ color: 'var(--text)' }}>Título: <span style={{ color: 'var(--accent)' }}>{BookInfos.title}</span></h4>
                                            <h4 style={{ color: 'var(--text)' }}>Autor(es): <span style={{ color: 'var(--accent)' }}>{BookInfos.author}</span></h4>
                                            <h4 style={{ color: 'var(--text)' }}>Condição Do Livro: <span style={{ color: 'var(--accent)' }}>{BookInfos.book_condition}</span></h4>
                                            <h4 style={{ color: 'var(--text)' }}>Idioma: <span style={{ color: 'var(--accent)' }}>{BookInfos.lang}</span></h4>
                                        </div>

                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            <h4 style={{ color: 'var(--text)' }}>Quantidade De Páginas: <span style={{ color: 'var(--accent)' }}>{BookInfos.pags}</span></h4>
                                            <h4 style={{ color: 'var(--text)' }}>Ano De Publicação: <span style={{ color: 'var(--accent)' }}>{BookInfos.year}</span></h4>
                                            <h4 style={{ color: 'var(--text)' }}>Tipo: <span style={{ color: 'var(--accent)' }}>{BookInfos.type}</span></h4>
                                            <h4 style={{ color: 'var(--text)' }}>Gêneros: <span style={{ color: 'var(--accent)' }}>{BookInfos.genres.map((item) => { return _genre[item] }).join(', ')}</span></h4>
                                        </div>
                                    </div>

                                    <br />

                                    {SimilarBooks.length >= 1 &&
                                        <>
                                            <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />
                                            <h2> Livros Semelhantes </h2>
                                            <FlickitySliderSimilar />

                                            <br />
                                        </>
                                    }
                                    {CategoryBooks.length >= 1 &&
                                        <>
                                            <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                                            <h2> Mesma Categoria </h2>
                                            <FlickitySliderCategory />

                                            <br />
                                        </>
                                    }

                                </div>

                                <div style={{ display: 'grid', justifyContent: 'center' }}>
                                    <div className='SB-right'>
                                        <SellerPerfil />
                                    </div>

                                    <div className='SB-moreBooksUser'>
                                        {UserBooksEXTRA.length >= 1 && (<UserBooks />)}
                                    </div>

                                </div>

                                <div className='SB-top'>
                                    <SellerPerfilTop />
                                </div>

                            </div>

                        </div>
                :
                    <div style={{ display: 'grid', gap: '10px' }}>
                        <h1 style={{ textAlign: 'center', color: 'var(--red)' }} >Livro Inativo</h1>
                        <h1 style={{ textAlign: 'center' }} >Este livro foi desativado pelo usuário</h1>
                    </div>
                )
                :
                BookInfos === 404 ?
                    <div style={{display: 'grid', gap: '10px'}}>
                        <h1 style={{textAlign: 'center', color: 'var(--red)'}} >ERRO 404</h1>
                        <h1 style={{textAlign: 'center'}} >Livro Não Encontrado</h1>
                    </div>
                    :
                    <div className='SB-main-container'>
                        <h1>Carregando...</h1>
                    </div>
            }

        <br/>
        <br/>
        <div className='SB-top-margin'/>

        </>
    )
}
export default BookPage
