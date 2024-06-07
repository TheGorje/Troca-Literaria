import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios'
import Header from "../Header/Header"
import SearchBook from "../Components/SearchBook/SearchBook"
import "./ShowUser.css"
import UserFeedback from '../Components/UserFeedback/UserFeedback.js'
import ScoreInStar from '../Components/ScoreInStar/ScoreInStar.js'


function ShowUser() {
    const { id } = useParams()
    const [UserInfos, setUserInfos] = useState(null)
    const [Books, setBooks] = useState([])


    useEffect(()=>{
        if (id !== null) {
            // alert('pegando o usuario')
            axios.post("http://localhost/bookloop/Account/GetUserByID.php", {
                user_id: id,
                isUser: false,
            })
            .then(response => {
                console.log(response.data)

                setUserInfos(response.data)
            })
            .catch(error => {
                console.log(error)

                console.error('Erro ao pegar usuario:', error)
                setUserInfos(404)
            })
        }
    },[id])

    useEffect(()=>{
        if (UserInfos !== null) {
            const link = `http://localhost/bookloop/Book/GetUserBooksByID.php?user_id=${id}`
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

    function SellerPerfil() {

        function PhotoPerfil(){
            return(
            <>
                {UserInfos['photo'].length >= 1 ?
                    <div className='SU-perfil'>
                        <img className="SU-perfil-photo"
                            src={UserInfos['photo']} alt="perfil" />
                    </div>
                :
                    <div className='SU-perfil'>
                        <div className="SU-profile-icon"/>
                    </div>
                }

            </>
            )
        }

        return (
            <>
                <div className='SU-seller'>
                    <h3 style={{ color: 'var(--accent)' }}> {UserInfos['username']} </h3>
                    <div className='SU-seller-infos-container'>
                        <PhotoPerfil />
                        {UserInfos.average_score > 0 &&
                            <ScoreInStar score={UserInfos.average_score}/>
                        }
                        <UserFeedback feedback={UserInfos.feedbacks}/>
                    </div>

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

    return (
        <>
            <Header/>
            <br/>
            {
            (UserInfos !== null && UserInfos !== 404) ?
                (
                <div className='SU-main-container'>
                    <div className='SU-container-all'>

                        <div className='SU-left'>
                            <SellerPerfil />
                        </div>

                        { Books === 404 ?
                            <h1 style={{textAlign: 'center'}}> Usuário Não Tem Nenhum Anúncio </h1>
                        :
                            <div className='SU-right'>
                                <SearchBook Books={Books}/>
                            </div>
                        }
                       
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
                    <div className='SU-main-container'>
                        <h1> Carregando... </h1>
                    </div>
                )
            }
        <br/>
        <br/>
        </>
    )
}
export default ShowUser
