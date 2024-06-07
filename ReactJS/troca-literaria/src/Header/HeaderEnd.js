import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../Login/LoginContext'
import "./HeaderEnd.css"

function HeaderEnd() {
    const { isLoggedIn, User, handleLogout } = useContext(LoginContext)
    const [IsOpen, setIsOpen] = useState(false)
    const [Perfil, setPerfil] = useState(<></>)

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

    function PerfilLogin() {
        return (
            <>
            <div className='HE-Perfil-Open-Modal' onClick={()=>{setIsOpen(false)}} />

                <div className='HE-Perfil-Open-Container'>

                    <Link onClick={() => setIsOpen(false)} to={`/login`} >
                        <div className='HE-Perfil-Open-Item' style={{ paddingLeft: '0px' }}>
                            <h3 style={{ textAlign: 'center', color: 'var(--accent)' }}> Entrar </h3>
                        </div>
                    </Link>

                    <line style={{ borderBottom: '2px solid var(--background-3)' }} />

                    <Link onClick={() => setIsOpen(false)} to={`/createAccount`} >
                        <div className='HE-Perfil-Open-Item' style={{ paddingLeft: '0px' }}>
                            <h3 style={{ textAlign: 'center', color: 'var(--text)' }}> Criar Conta </h3>
                        </div>
                    </Link>

            </div>
            </>
        )
    }

    function PerfilOpen() {
        return (
            <>
            <div className='HE-Perfil-Open-Modal' onClick={()=>{setIsOpen(false)}} />

            <div className='HE-Perfil-Open-Container' onClick={()=>{setIsOpen(false)}}>
                <Link to={`/myAccount`} className='HE-Perfil-Open-Principal' style={{flexDirection: User.Name.length >= 25 ? 'column':''}}>
                    <div className='HE-Perfil-Image-container' style={{border: '0', width: '58px',height: '58px'}}>
                        {Perfil}
                    </div>

                    <div style={{width:'76%'}}>
                        <h3 style={{ wordWrap: 'break-word' }}> {User.Name} </h3>
                        <h5 style={{ opacity: '0.6', cursor: 'pointer', width: '65%' }}> Minha Conta <div className='HE-Perfil-Mark' /></h5>
                    </div>
                </Link>

                <line style={{ borderBottom: '1px solid var(--secondary)' }} />

                <Link to={`/AddBook`} style={{ textDecoration: 'none', paddingLeft: '0px'}} className='HE-Perfil-Open-Item-Anunciar-Container'>
                    <h3 className='HE-Perfil-Open-Item-Anunciar'> Anunciar </h3>
                </Link>

                <line style={{ borderBottom: '1px solid var(--secondary)' }} />
                
                <Link to={`/MyAccount/2`} style={{ textDecoration: 'none', paddingLeft: '0px'}}>
                    <div className='HE-Perfil-Open-Item'>
                        <h4> Meus Anúncios </h4>
                    </div>
                </Link>

                <Link to={`/MyAccount/3`} style={{ textDecoration: 'none', paddingLeft: '0px'}}>
                    <div className='HE-Perfil-Open-Item'>
                        <h4> Minhas Trocas </h4>
                    </div>
                </Link>

                <Link className='HE-Perfil-Open-Item' to={`/Login`} style={{ textDecoration: 'none', color: 'var(--text)' }}>
                    <h4 > Trocar De Conta </h4>
                </Link>

                <div className='HE-Perfil-Open-Exit-Container' onClick={() => handleLogout()}>
                    <h4 className='HE-Perfil-Open-Exit'> Sair </h4>
                </div>

            </div>
            </>
        )
    }


    return (
        <div className='H-End'>
            {
                isLoggedIn === false ?
                // nao logado
                <div className='HE-Perfil-Container' >
                    <div onClick={() => { setIsOpen(!IsOpen) }} className='HE-Perfil-Image-container' style={{ borderColor: IsOpen ? 'var(--accent)' : '' }}>
                        <div className='HE-profile-icon unknown'/> {/* perfil unknown */}
                    </div>

                    {IsOpen === true && <PerfilLogin />}
                </div>
                // <Link to={`/login`}> </Link>
                :
                // logado
                <div className='HE-Perfil-Container' >
                    <div className='HE-Perfil-Image-container' onClick={()=>{setIsOpen(!IsOpen)}}
                        style={{borderColor: IsOpen ? 'var(--accent)' : ''}} >
                        {Perfil}
                    </div>

                    {IsOpen === true && <PerfilOpen/>}
                </div>
            }
        </div>
    )
}

export default HeaderEnd
