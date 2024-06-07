import React, { useEffect, useState, useContext } from 'react'
import { LoginContext } from '../Login/LoginContext.js'
import { Link, useParams } from 'react-router-dom';

import axios from 'axios'
import { _feedbacks } from '../DATA.js'

import Header from "../Header/Header"
import SearchBook from "../Components/SearchBook/SearchBook"
import "./MyAccount.css"

import Ok from '../Components/Signals/Ok/ok.js'
import Error from '../Components/Signals/Error/Error.js'

import { ReactComponent as Warning } from '../imagens/warning.svg'
import UserFeedback from '../Components/UserFeedback/UserFeedback.js'
import ScoreInStar from '../Components/ScoreInStar/ScoreInStar.js'

function MyAccount() {
    const { area } = useParams()

    const { User, handleLogin, handleLogout } = useContext(LoginContext)
    const [UserInfos, setUserInfos] = useState(null)
    const [Books, setBooks] = useState([])

    const [AreaSelected, setAreaSelected] = useState(1)

    useEffect(()=>{
        switch (area) {
            case '1':
                setAreaSelected(1)
                break;
            case '2':
                setAreaSelected(2)
                break;
            case '3':
                setAreaSelected(3)
                break;
            default:
                setAreaSelected(1)
                break;
        }
    },[area])

    useEffect(()=>{
        if (User === null) {return window.location.href = '/login/myAccount'}
        if (User.Id !== null ) {
            axios.post("http://localhost/bookloop/Account/GetUserByID.php", {
                user_id: User.Id,
                isUser: true,
                token: User.Token,
            })
            .then(response => {
                setUserInfos(response.data)
            })
            .catch(error => {
                console.error('Erro ao pegar usuario:', error)
                setUserInfos(404)
            })
        }
    },[User])

    useEffect(()=>{
        if (UserInfos !== null) {
            const link = `http://localhost/bookloop/Book/GetUserBooksByID.php?user_id=${User.Id}`
            axios.get(link)
            .then(response => {
                const Book = response.data
                if (Object.keys(Book).length >= 1){
                    setBooks(response.data)
                }
                else { return setBooks(404)}
            })
            .catch(error => {
                console.error('Erro ao buscar livros:', error)
                return setBooks(404)
            })
        }

    },[UserInfos])


    function FormatDate(date, type) {
        const _Date = new Date(date)

        let day = _Date.getDate().toString().padStart(2, '0')
        let mouth = (_Date.getMonth() + 1).toString().padStart(2, '0') // Os meses começam do 0, então adicionamos 1
        let year = _Date.getFullYear()

        let hours = _Date.getHours().toString().padStart(2, '0')
        let minutes = _Date.getMinutes().toString().padStart(2, '0')
        let seconds = _Date.getSeconds().toString().padStart(2, '0')

        let dateFull = `${day}/${mouth}/${year} ${hours}:${minutes}:${seconds}`
        let dateFullCompact = `${day}/${mouth}/${year} ás ${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM':'AM'}`

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
        else if (type === 'full compact') {
            return dateFullCompact
        }
    }

    function FormatPhone( phoneNumber ){
        const ddd = phoneNumber.slice(0, 2)
        const phone = phoneNumber.slice(2, 7) + "-" + phoneNumber.slice(7);

        const numeroFormatado = `(${ddd}) ${phone}`
        return numeroFormatado
    }

    function Perfil() {
        function PhotoPerfil(){
            return(
            <>
                {UserInfos['photo'].length >= 1 ?
                    <div className='MA-perfil'>
                        <img className="MA-perfil-photo"
                            src={UserInfos['photo']} alt="perfil" />
                    </div>
                :
                    <div className='MA-perfil'>
                        <div className="MA-profile-icon"/>
                    </div>
                }

            </>
            )
        }

        return (
            <>
                <div className='MA-myPerfil'>
                    <h3 style={{ color: 'var(--accent)' }}> {UserInfos['username']} </h3>
                    <PhotoPerfil />
                    {UserInfos.average_score > 0 &&
                        <ScoreInStar score={UserInfos.average_score} />
                    }
                    <UserFeedback feedback={UserInfos.feedbacks} />

                    <h5 style={{ opacity: '0.6' }}>Na <span style={{ color: 'var(--accent)' }}>Troca Literária</span> desde {FormatDate(UserInfos['created_at'], 'year')}</h5>
                    {
                        Books.length >=1 ?
                        <h4>
                            <span style={{ color: 'var(--accent)' }}> {Books?.filter((item) => item.isActive === 1).length} </span> de
                            <span style={{ color: 'var(--accent)' }}> {Books?.length} </span>Anúncios Ativos
                        </h4>
                        :
                        <></>
                    }
                </div>
            </>
        )
    }

    function MyCadastre(){
        const [editing, setEditing] = useState('')

        const validateEmail = (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(String(email).toLowerCase())
        }

        function isValidUrl(string) {
            try {
                new URL(string)
            } catch (_) {
                return false
            }
            return true
        }

        function isImageUrl(url) {
            return new Promise((resolve) => {
                if (!isValidUrl(url)) {
                    resolve(false)
                } else {
                    var img = new Image();
                    img.onload = () => resolve(true)
                    img.onerror = () => resolve(false)
                    img.src = url
                }
            })
        }

        function Infos({ text, DBvalue, data, minChars, checkValidity, PlaceHolder, type }) {
            const isEditing = editing === text
            const [inputValue, setInputValue] = useState('')
            const [inputConfirm, setinputConfirm] = useState('')
            const [error, setError] = useState('')

            const handleEdit = () => {
                setEditing(isEditing ? '' : text)
            }

            const handleCancel = () => {
                setInputValue('')
                setError('')
                setEditing('')
            }

            const handleConfirm = async () => {
                let cleanInputValue = ''
                if (DBvalue === 'phone_number') {
                    cleanInputValue = inputValue.replace(/\D/g, '')
                }
                const updateData = {
                    id: User.Id,
                    token: User.Token,
                    [DBvalue]:
                        DBvalue === 'phone_number' ?
                            cleanInputValue // numero formatado
                        :
                            inputValue // valor normal do input
                }
                if (inputValue.length < minChars) {
                    setError(`Mínimo ${minChars} caracteres`)
                    return
                } else if (cleanInputValue.length < minChars && DBvalue === 'phone_number') {
                    setError(`Mínimo ${minChars} caracteres`)
                    return
                }

                if (checkValidity && !checkValidity(inputValue) && DBvalue === 'email') {
                    setError('Email inválido')
                    return
                }
                if (DBvalue === 'photo') {
                    const isValid = await checkValidity(inputValue)
                    if (!isValid) {
                        setError('URL de foto inválida')
                        return
                    }
                }
                if (type === 'password') {
                    if (inputConfirm !== inputValue) {
                        setError("As senhas não correspondem")
                        return
                    }
                }

                try {
                    axios.post("http://localhost/bookloop/Account/ChangeAccount.php", updateData)
                    .then(response => {
                        console.log( response.data )
                        if (response.data) {
                            if (response.data.success === true){
                                console.log( response.data.success )
                                function Finish(){
                                    setInputValue('')
                                    setinputConfirm('')
                                    setError('')
                                    setEditing('')
                                    handleEdit()
                                }
                                if (DBvalue === 'username' || DBvalue === 'photo') {
                                    handleLogin(
                                        User.Token,
                                        User.Id,
                                        DBvalue === 'username' ? inputValue : User.Name,
                                        DBvalue === 'photo'? inputValue : User.Img,
                                    )
                                    Finish()
                                }
                                else {
                                    Finish()
                                    window.location.reload()
                                }

 

                            } else if (response.data.success === false) {
                                setError(response.data.message)
                                alert( 'já exsite' )
                            }
                            else if (response.data.error){
                                alert( 'algum erro' )
                                setError(response.data.message)
                                console.log( response.data )
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error)
                    })
                } catch (err) {
                    setError('Erro ao atualizar')
                }
            }

            const handleInputChange = (e) => {
                let input = e.target.value

                if (DBvalue === "phone_number") {
                    input = input.replace(/\D/g, '') // Remove todos os caracteres não numéricos
                    input = input.slice(0, 11) // Limita a 11 dígitos
                    let formattedInput = '('
                    for (let i = 0; i < input.length; i++) {
                        if (i === 2) {
                            formattedInput += ') '
                        } else if (i === 7) {
                            formattedInput += '-'
                        }
                        formattedInput += input[i]
                    }
                    setInputValue(formattedInput)
                } else {
                    setInputValue(input)
                }
            }

            return (
                <div style={{opacity: editing === '' || editing === text ? 1 : 0.2 }}>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', userSelect: 'none'}}>
                        <h3> {text} </h3>
                        <h5 className='MA-cadastre-change' onClick={handleEdit}
                            style={{ opacity: editing === text ? 1 : '' }}> Alterar </h5>
                    </div>

                    {isEditing ? (
                        <div style={{display: 'grid', maxWidth: '360px', gap: '10px'}}>
                            {error && <h4 style={{color: 'var(--red)'}}>*{error}</h4>}

                            {type === 'password' ?
                            <>
                                <input type='password' style={{borderBottomColor: error.length >= 1 && 'var(--red)'}}
                                className="MA-cadastre-input" value={inputValue} placeholder={PlaceHolder}
                                onChange={(e)=>setInputValue(e.target.value)} />

                                <input type='password' style={{borderBottomColor: error.length >= 1 && 'var(--red)'}}
                                className="MA-cadastre-input" value={inputConfirm} placeholder={'Confirme a senha'}
                                onChange={(e)=>setinputConfirm(e.target.value)} />
                            </>
                            :
                                <input className="MA-cadastre-input"  style={{borderBottomColor: error.length >= 1 && 'var(--red)'}}
                                value={inputValue} placeholder={PlaceHolder}
                                onChange={handleInputChange} />
                            }

                            <div style={{display: 'flex', gap: '10px'}}>
                                <button className="MA-cadastre-button-confirm" onClick={handleConfirm}> Confirmar </button>
                                <button className="MA-cadastre-button-cancel" onClick={handleCancel}> Cancelar </button>
                            </div>

                        </div>
                    )
                    :
                    (
                        DBvalue === 'photo' ?
                            data.length >= 1 ? 
                                <a href={data} target="_blank" rel="noreferrer" style={{color: 'var(--accent)', cursor: 'pointer', display: 'block', width: '105px'}} >
                                    <h4 style={{ color: 'var(--secondary)' }}> Abrir Imagem</h4>
                                </a>
                            :
                                <h4 style={{ opacity: '0.6' }}> Imagem Padrão </h4>
                        :
                            <h4 style={{ opacity: '0.6' }}> {data} </h4>

                        
                    )}
                </div>
            )
        }

        function DeleteAccount(){
            const [Clicked, setClicked] = useState(false)
    
            function DeletedTimer() {
                const [count, setCount] = useState(5)
    
                const handleDelete = () => {
                    axios.post("http://localhost/bookloop/Account/DeleteAccount.php", {
                        user_id: User.Id,
                        token: User.Token,
                    })
                    .then(response => {
                        console.log(response.data)
                        handleLogout()
                    })
                    .catch(error => {
                        console.error('Erro ao pegar usuario:', error)
                    })
                }
    
                useEffect(() => {
                    if (count > 0) {
                        const timerId = setTimeout(() => {
                            setCount(count - 1)
                        }, 1000)
                        return () => clearTimeout(timerId)
                    }
                }, [count])
    
                function isCountNonZero() {
                    return (count !== 0)
                }
                return (
                    <div style={{ display: 'grid', gap: '10px', textAlign: 'center' }}>
                        <h4>
                            Você Tem Certeza?
                        </h4>

                        <button onClick={handleDelete} className='MA-cadastre-button-cancel'
                            style={{ cursor: isCountNonZero() ? 'not-allowed' : 'pointer', opacity: isCountNonZero() ? '0.6' : '1' }}
                            disabled={isCountNonZero() ? true : false} > {isCountNonZero() ? count : 'Sim'} </button>
    
                        <button onClick={()=>setClicked(false)} className='MA-cadastre-button-confirm'
                            style={{ }}
                            > Não </button>
                    </div>
                )
            }

            return(
                <div className='MA-DeleteAccount-container'>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Warning className='MA-DeleteAccount-warning'/>
                        <div>
                            <h2>Deletar Perfil</h2>
    
                            <h4 style={{opacity: '0.6'}}>Seu perfil será deletado e anúncios excluídos.</h4>
                        </div>
                        
                    </div>
    
                    {Clicked ? 
                        <DeletedTimer />
                    :
                        <button onClick={()=>setClicked(true)} className='MA-cadastre-button-cancel'> Deletar Conta </button>
                    }
                </div>
            )
        }


        return(
            <>
            <h1 style={{opacity: '0.6'}}> Meu Cadastro </h1>
            <div className='MA-cadastre-container'>
                <h2> Dados Da Conta </h2>

                <Infos text={"Foto De Perfil"}
                DBvalue="photo"
                data={UserInfos.photo}
                PlaceHolder={'Insira um link da nova foto de perfil'}
                checkValidity={isImageUrl} 
                />

                <Infos text={"Usuário"}
                DBvalue="username"
                data={UserInfos.username}
                minChars={8}
                PlaceHolder={UserInfos.username} 
                />

                <Infos text={"Email"}
                DBvalue="email"
                data={UserInfos.email}
                PlaceHolder={UserInfos.email}
                checkValidity={validateEmail}
                />

                <Infos text={"Senha"}
                DBvalue="password"
                data={'∗∗∗∗∗∗∗∗'}
                minChars={8}
                PlaceHolder="Insira a nova senha"
                type={'password'}
                />

                <Infos text={"Telefone"}
                DBvalue="phone_number"
                data={FormatPhone(UserInfos.phone_number)}
                minChars={11} // sem formatar
                PlaceHolder={FormatPhone(UserInfos.phone_number)}
                />

                <h5 style={{color: 'var(--secondary)'}}> Conta Criada: {FormatDate(UserInfos.created_at, 'full compact')} </h5>
            </div>

            <DeleteAccount />
            </>
        )
    }

    function MyListings(){
        return(
            Books.length >= 1 ?
                <SearchBook Books={Books}/>
            :
            <>
                <h2 style={{textAlign: 'center'}}> Você não tem anuncios </h2>
                <Link to={'/addbook'} className='I-Left-Link'>
                    <button className='I-Left-Button'>
                        Anuncie
                    </button>
                </Link> 
            </>
        )
    }

    function MyTrades(){
        const [AreaSelected, setAreaSelected] = useState(1)

        const [TradeBooks_Advertiser, setTradeBooks_Advertiser] = useState(null)
        const [TradeBooks_Interested, setTradeBooks_Interested] = useState(null)

        useEffect(()=>{
            if (AreaSelected === 1){
                if (TradeBooks_Advertiser !== null) {return}

                axios.post("http://localhost/bookloop/Trade/GetTradeByUserID_Advertiser.php", {advertiser_id: User.Id})
                .then(response => {
                    if (response.data) {
                        console.log(response.data.length)
                        if (response.data.length <= 0) {
                            setTradeBooks_Advertiser(null)
                        } else {
                            setTradeBooks_Advertiser(response.data)
                        }
                    }
                    else { setTradeBooks_Advertiser(null) }
                })
                .catch(error => {
                    console.error('Erro ao retornar trades de Advertiser:', error)
                })
            }
            if (AreaSelected === 2){
                if (TradeBooks_Interested !== null) {return}
                axios.post("http://localhost/bookloop/Trade/GetTradeByUserID_Interested.php", {interested_id: User.Id})
                .then(response => {
                    if (response.data) {
                        if (response.data.length <= 0) {
                            setTradeBooks_Interested(null)
                        } else {
                            setTradeBooks_Interested(response.data)
                        }
                    }
                    else { setTradeBooks_Interested(null) }
                })
                .catch(error => {
                    console.error('Erro ao retornar trades de Advertiser:', error)
                })
            }

        },[AreaSelected])




        function TradeCard( { info, type } ){
            const [IsFinish, setIsFinish] = useState(false)
            const [Finish, setFinish] = useState(null) // {bool: true, text: 'Avaliação Enviada!'}
            const [inReview, setinReview] = useState(false)

            const isAdvertiser = type === 'Advertiser'
            const isInterested = type === 'Interested'

            const book_imagens = JSON.parse(`${info.book.image_urls}`)

            function UpdateTradeStatus(tradei_id, staus) {
                axios.post("http://localhost/bookloop/Trade/UpdateTradeStatus.php", { trade_id: tradei_id, new_status: staus })
                .then(response => {
                    console.log(response.data)
                    if (response.data) {
                        console.log(response.data)
                        setFinish({bool: true, text: ''})
                    }
                }).catch(erro => {
                    console.log(erro)
                    setFinish({bool: false, text: 'Erro'})
                })
            }

            useEffect(()=>{
                if (Finish !== null) {
                    setIsFinish(true)
                }

            },[Finish])


            function Card() {
                return (
                    <div className='MA-card-container-all'>
                        <div style={{ display: 'grid', padding: '5px', textAlign: 'center' }}>
                            {
                                ((isAdvertiser && info.status === "pending")
                                    ||
                                    (isInterested && info.status === "pending_confirmation")) &&
                                <h3> Você Trocou? </h3>
                            }

                            <Link to={`/book/${info.book_id}`} target="_blank" >
                                <h3 style={{ color: 'var(--accent)', fontSize: info.book.title.length >= 55 && '16px' }}>
                                    {info.book.title}
                                </h3>
                            </Link>
                        </div>

                        <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                        <div className='MA-card-container'>
                            <div>
                                <Link to={`/book/${info.book_id}`} target="_blank">
                                    <div className='MA-card-img-container'>
                                        <img className='MA-card-img' src={book_imagens[0]} alt={''} />
                                    </div>
                                </Link>
                            </div>
                            {isAdvertiser && <h1>{'←'}</h1>}
                            {isInterested && <h1>{'→'}</h1>}


                            <div className='MA-details-container'>
                                <div style={{ display: 'grid', gap: '5px' }}>
                                    <Link to={`/user/${info.otherUser.id}`} target="_blank" className='MA-user-img-container'>
                                        {info.otherUser.photo.length >= 1 ?
                                            <img className='MA-user-img' src={info.otherUser.photo} alt='foto do interessado' />

                                            :
                                            <div className="MA-profile-icon" style={{ borderRadius: '8px', backgroundColor: 'var(--background)' }} />
                                        }

                                    </Link>

                                    <Link to={`/user/${info.otherUser.id}`} target="_blank" >
                                        <h4 className='MA-user-name'> {info.otherUser.username} </h4>
                                    </Link>
                                    <h5 style={{ opacity: '0.6' }}> {FormatPhone(info.otherUser.phone_number)} </h5>
                                </div>

                            </div>

                        </div>

                        <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            {isAdvertiser && info.status === "pending" && // é anunciante e o usuario conversou com ele
                                <>
                                    <div className='MA-selection-yes' onClick={() => UpdateTradeStatus(info.id, 'pending_confirmation')}>
                                        <h3> Sim </h3>
                                    </div>

                                    <div className='MA-selection-no' onClick={() => UpdateTradeStatus(info.id, 'cancelled')}>
                                        <h3> Não </h3>
                                    </div>
                                </>
                            }
                            {isAdvertiser && info.status === "pending_confirmation" && // é anunciante e o pedido está em espera do interessado
                                <div className='MA-selection-yes' style={{ backgroundColor: 'var(--secondary)', width: '100%', cursor: 'default' }}>
                                    <h3> Esperando confirmação </h3>
                                </div>
                            }

                            {isInterested && info.status === "pending_confirmation" && //é o interessado e está confirmando uma troca do enunciante
                                <>
                                    <div className='MA-selection-yes' onClick={() => setinReview(true)}>
                                        <h3> Sim </h3>
                                    </div>

                                    <div className='MA-selection-no' onClick={() => UpdateTradeStatus(info.id, 'cancelled')}>
                                        <h3> Não </h3>
                                    </div>
                                </>
                            }

                            {(isInterested || isAdvertiser) && info.status === "completed" &&
                                <div className='MA-selection-yes' style={{ backgroundColor: 'var(--accent)', width: '100%', cursor: 'default' }}>
                                    <h3> Troca Concluída </h3>
                                </div>
                            }

                            {(isInterested || isAdvertiser) && info.status === "cancelled" &&
                                <div className='MA-selection-yes' style={{ backgroundColor: 'var(--red)', width: '100%', cursor: 'default' }}>
                                    <h3> Troca Cancelada </h3>
                                </div>
                            }

                        </div>
                    </div>
                )
            }

            function UserReview(){
                const [Feedbacks, setFeedbacks] =useState([])
                const [Score, setScore] = useState(0)
                const [HoverScore, setHoverScore] = useState(0)
                const [isSending, setIsSending] = useState(false)


                const totalStars = 5

                function SendReview(){
                    if (isSending) {return}
                    setIsSending(true)

                    UpdateTradeStatus(info.id, 'completed')

                    axios.post("http://localhost/bookloop/Trade/CreateReview.php", {
                        user_id: info.advertiser_id,
                        score: Score,
                        feedbacks: Feedbacks,
                    })
                    .then(response => {
                        console.log( response.data )
                        setFinish({bool: true, text: 'Avaliação Enviada!'})
                    })
                    .catch(error => {
                        console.error('Erro ao adicionar livro:', error)
                        setFinish({bool: false, text: 'Erro Ao Enviar Avaliação!'})
                    })
                }

                const handleStarClick = (selectedRating) => {
                    setScore(selectedRating)
                }

                const handleStarHover = (hoveredValue) => {
                    setHoverScore(hoveredValue)
                }

                function handleFeedback(feed){
                    const ArrCopy = [...Feedbacks]
                    const index = ArrCopy.indexOf(feed)
            
                    if (index !== -1) {
                        ArrCopy.splice(index, 1)
                    }
                    else {
                        ArrCopy.push( parseInt(feed) )
                    }
                    feed = Feedbacks
                
            
                    setFeedbacks(ArrCopy)
                }


                return(
                    <div className='MA-card-container-all' style={{backgroundColor: 'var(--background-3)'}}>
                        <div style={{ display: 'grid', padding: '5px', textAlign: 'center' }}>
                            <h3>
                                Avaliação
                            </h3>
                        </div>

                        <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />


                        <div style={{ display: 'grid', padding: '5px', textAlign: 'center' }}>
                            <Link to={`/user/${info.otherUser.id}`} target="_blank" >
                                <h3 style={{ color: 'var(--accent)', fontSize: info.book.title.length >= 55 && '16px' }}>
                                    {info.otherUser.username}
                                </h3>
                            </Link>
                        </div>

                        <div className='MA-card-container' style={{ flexDirection: 'column' }}>
                            <Link to={`/user/${info.otherUser.id}`} target="_blank"
                                style={{ display: 'grid', borderRadius: '12px', border: '2px solid var(--accent)' }}>

                                <div className='MA-user-img-container' style={{opacity: '1'}}>
                                    {info.otherUser.photo.length >= 1 ?
                                        <img className='MA-user-img' src={info.otherUser.photo} alt='foto do interessado' />

                                        :
                                        <div className="MA-profile-icon" style={{ borderRadius: '8px', backgroundColor: 'var(--background)' }} />
                                    }
                                </div>
                            </Link>

                            <div className="MA-star-rating">
                                {[...Array(totalStars)].map((_, index) => {
                                    const starValue = index + 1
                                    return (
                                        <span
                                            key={index}
                                            className={`MA-star ${starValue <= (HoverScore || Score) ? 'selected' : ''}`}
                                            onClick={() => handleStarClick(starValue)}
                                            onMouseEnter={() => handleStarHover(starValue)}
                                            onMouseLeave={() => handleStarHover(0)}
                                        >
                                            ★
                                        </span>
                                    )
                                })}
                            </div>


                            <div className='MA-card-review-feedback-container'>
                                {Object.values(_feedbacks).map((item, i)=>{
                                    return(
                                        <div className='MA-card-review-feedback' onClick={()=>{handleFeedback( (i+1) )}}
                                            style={{backgroundColor: Feedbacks.includes(i+1) && 'var(--accent)'}} key={i}>
                                            {item}
                                        </div>
                                    )
                                })}
                            </div>

                        </div>


                        <line style={{ width: '100%', height: '2px', backgroundColor: 'var(--background)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                            <div className='MA-selection-yes' onClick={() => SendReview()}>
                                <h3> Enviar </h3>
                            </div>

                            <div className='MA-selection-no' onClick={() => setinReview(false)}>
                                <h3> Voltar </h3>
                            </div>

                        </div>
                    </div>
                )
            }

            function FinishStatus(){

                return(
                    <div className='MA-card-container-all'
                        style={{height: '250px', justifyItems: 'center', alignContent: 'center', gap: '20px'}}>

                        {Finish.bool === true && <Ok font={50} size={50} text={Finish.text}/>}
                        {Finish.bool === false && <Error font={50} size={50} text={Finish.text}/>}

                    </div>
                )
            }


            return(
                <>
                {IsFinish ?
                    <FinishStatus />
                :
                    (inReview && isInterested && info.status === "pending_confirmation") ?
                        <UserReview />

                    :
                        <Card />
                }
                </>
            )
        }


        return(
            <>
                <h1 > Minhas Trocas </h1>
                <h4 style={{ opacity: '0.8' }}>
                    Trocas Completadas: <span style={{ color: 'var(--accent)' }}> {UserInfos.completed_trades} </span>
                </h4>
                <h4 style={{ opacity: '0.8' }}>
                    Pendentes: <span style={{ color: 'var(--accent)' }}> {UserInfos.pending_trades} </span>
                </h4>

                <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
                    <div className='MA-left-select' style={{backgroundColor: AreaSelected === 1 && 'var(--accent)'}}
                        onClick={()=>{setAreaSelected(1)}}>
                        <h2> Anunciados </h2>
                    </div>

                    <div className='MA-left-select' style={{backgroundColor: AreaSelected === 2 && 'var(--accent)'}}
                        onClick={()=>{setAreaSelected(2)}}>
                        <h2> Solicitações </h2>
                    </div>
                </div>

                
                    {AreaSelected === 1 && (
                        TradeBooks_Advertiser !== null ? (
                            <div className='MA-tradeCard-container'>
                                {TradeBooks_Advertiser.map((item, i) => <TradeCard info={item} type={'Advertiser'} key={i} />)}
                            </div>
                        ) :
                            (
                                <h3 style={{textAlign: 'center'}} >Nenhum usuário trocou com você ainda</h3>
                            )
                        )}
                    {AreaSelected === 2 && (
                        TradeBooks_Interested !== null ? (
                            <div className='MA-tradeCard-container'>
                                {TradeBooks_Interested.map((item, i) => <TradeCard info={item} type={'Interested'} key={i}/>)}
                            </div>
                        ) :
                        (
                            <h3 style={{textAlign: 'center'}}>Você não tem nenhuma troca ainda</h3>
                        )
                    )}
                
            </>
        )
    }

    return (
        <>
            <Header/>
            <br/>
            {
            (UserInfos !== null && UserInfos !== 404) ?
                (
                <div className='MA-main-container'>
                    <div className='MA-container-all'>

                        <div style={{display: 'grid', gap: '20px'}}> 
                            <div className='MA-left'>
                                <Perfil />
                            </div>

                            <div className='MA-left-select-container'>
                                <div className='MA-left-select' style={{backgroundColor: AreaSelected === 1 ? 'var(--accent)':''}}
                                    onClick={()=>setAreaSelected(1)}>
                                    <h2> Meu Cadastro </h2>
                                </div>

                                <div className='MA-left-select' style={{backgroundColor: AreaSelected === 2 ? 'var(--accent)':''}}
                                    onClick={()=>setAreaSelected(2)}>
                                    <h2> Meus Anuncios </h2>
                                </div>

                                <div className='MA-left-select' style={{backgroundColor: AreaSelected === 3 ? 'var(--accent)':''}}
                                    onClick={()=>setAreaSelected(3)}>
                                    <h2> Minhas Trocas </h2>
                                </div>
                            </div>

                        </div>
                        
                        <div className='MA-right'>
                            {AreaSelected === 1 && (
                                <>
                                    <MyCadastre />
                                </>
                            ) }
                            {AreaSelected === 2 && (
                                <>
                                    <MyListings />
                                </>
                            ) }
                            {AreaSelected === 3 && (
                                <>
                                    <MyTrades />
                                </>
                            ) }
                        </div>

                    </div>

                </div>
                )
                :
                (
                UserInfos === 404 ?
                    <div style={{display: 'grid', gap: '10px'}}>
                        <h1 style={{textAlign: 'center', color: 'var(--red)'}} > ERRO 404 </h1>
                        <h1 style={{textAlign: 'center'}} > Usuário Não Existe </h1>
                    </div>
                    :
                    <div className='MA-main-container'>
                        <h1> Carregando... </h1>
                    </div>
                )
            }
        <br/>
        <br/>
        </>
    )
}
export default MyAccount