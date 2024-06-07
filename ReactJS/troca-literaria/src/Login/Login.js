import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'

import { LoginContext } from './LoginContext'
import "./login.css"
import { ReactComponent as SVGlogo } from '../imagens/logo.svg'
import { ReactComponent as SVGcheckmark } from '../imagens/checkmark.svg'

function Login() {
    const [Result, setResult] = useState(null)

    const { direction } = useParams()
    const location  = useLocation()

    const { handleLogin } = useContext(LoginContext)

    const [AreaSelected, setAreaSelected] = useState(()=>{
        if (location.pathname.toLowerCase().includes('createaccount')) {
            return 1
        }
        else if (location.pathname.toLowerCase().includes('login')){
            return 2
        }
        else {return 2}
    })


    function FormatPhone( phoneNumber ){
        const ddd = phoneNumber.slice(0, 2)
        const phone = phoneNumber.slice(2, 7) + "-" + phoneNumber.slice(7);

        const numeroFormatado = `(${ddd}) ${phone}`
        return numeroFormatado
    }

    useEffect(() => {
        if (Result !== null) {
            console.log(Result)
            handleLogin(Result.token, Result.id, Result.username, Result.photo)
            switch (direction) { // direcionar após logar, para...
                case 'addbook':
                    window.location.href = '/addbook'
                    break
                case 'myAccount':
                    window.location.href = '/myAccount'
                    break
                default:
                    window.location.href = '/home'
            }
        }
    }, [Result])


    function AreaCreate() {
        const [IsConfirm, setIsConfirm] = useState(false)
        const [CreateForm, setLoginForm] = useState({
            "username": "",
            "email": "",
            "password": "",
            "phone_number": "",
        })

        const [CreateFormCHECK, setCreateFormCHECK] = useState({
            "username": {status:true, isUsed:true, value: 8},
            "email": {status:true, isUsed:true},
            "password": {status:true, value: 8},
            "phone_number": {status:true, value: 11, isUsed:true},
        })

        const validateEmail = (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(String(email).toLowerCase())
        }

        const handleChange = (e) => {
            // se for email checka
            if (e.target.name === 'email'){
                console.log(validateEmail(e.target.value))
            }
            if (e.target.name === 'phone_number'){
                console.log( FormatPhone(e.target.value) )
            }
            setLoginForm({
                ...CreateForm,
                [e.target.name]: e.target.value
            })
        }

        useEffect(()=>{
            if (IsConfirm) {
                setCreateFormCHECK(prevState => {
                    let dic = {...prevState}
                    dic.username.status = CreateForm.username.length >= dic.username.value
                    dic.email.status = validateEmail(CreateForm.email) // função validateEmail = check email
                    dic.password.status = CreateForm.password.length >= dic.password.value
                    dic.phone_number.status = CreateForm.phone_number.length >= dic.phone_number.value
                    return dic
                })
            }
        },[IsConfirm, CreateForm ])

        function handleSubmitCreate(){
            if (IsConfirm === false) {
                setIsConfirm(true)
            }
            // verifica os inputs
            const dic = {...CreateFormCHECK}
            dic.username.status = CreateForm.username.length >= dic.username.value
            dic.email.status = validateEmail(CreateForm.email) // função validateEmail = check email
            dic.password.status = CreateForm.password.length >= dic.password.value
            dic.phone_number.status = CreateForm.phone_number.length >= dic.phone_number.value

            let check = Object.keys(dic).every((item) => {
                return dic[item].status
            })
            console.log(check)
            if (check){
                //Faz uma solicitação POST para o script PHP para criar conta
                axios.post("http://localhost/bookloop/Account/CreateLogin.php", CreateForm)
                    .then(response => {
                        console.log('Login efetuado com sucesso:', response.data)
                        setResult(response.data)
                    })
                    .catch(error => {
                        console.error('Erro ao criar conta:', error)
                        console.log(error.response.status)
                        const dic = {...CreateFormCHECK}
                        if (error.response.status === 409) { // Usuario
                            dic.username.isUsed = false
                        } else { dic.username.isUsed = true }

                        if (error.response.status === 410) { // Email
                            dic.email.isUsed = false
                        } else { dic.email.isUsed = true }

                        if (error.response.status === 411) { // Telefone
                            dic.phone_number.isUsed = false
                        } else { dic.phone_number.isUsed = true }

                        setCreateFormCHECK(dic)
                    })
            }
        }

        function StyleCheck(item, tipo){
            if (tipo === 'isUsed') {
                return CreateFormCHECK[item].isUsed === false
            }
            else {
                return CreateFormCHECK[item].status === false
            }
        }

        return (
            <div className='L-Container-Login'>
                <div className='L-Container-Select'>
                    <h4 className={`${AreaSelected === 1 ? 'L-Select-Text-Actived' : 'L-Select-Text'}`}>
                        Criar Conta
                    </h4>
                    <h4 className={`${AreaSelected === 2 ? 'L-Select-Text-Actived' : 'L-Select-Text'}`}
                        onClick={() => setAreaSelected(2)} > Entrar </h4>
                </div>

                <div className='L-Container-Form'>

                    <div className='L-Form'>
                        <input type='text' name='username' autoComplete='off' value={CreateForm.username} onChange={handleChange}
                        style={{borderColor: StyleCheck('username') ? 'var(--red)' : ''}}/>
                        <label style={{ top: CreateForm.username.length >= 1 ? '-15px' : '',
                                color: StyleCheck('username') ? 'var(--red)':'' }} > Usuário </label>

                        <h4 style={{opacity: (StyleCheck('username') || StyleCheck('username', 'isUsed')) ? '1':'0'}}>
                            { StyleCheck('username', 'isUsed') ? 'Nome de usuário já está em uso' : 'Nome de usuário inválido' }
                        </h4>
                    </div>

                    <div className='L-Form'>
                        <input type='email' name='email' autoComplete='off' value={CreateForm.email} onChange={handleChange}
                        style={{borderColor: StyleCheck('email') ? 'var(--red)':''}}/>
                        <label style={{ top: CreateForm.email.length >= 1 ? '-15px' : '',
                                color: StyleCheck('email') ? 'var(--red)':''}}>Email</label>

                        <h4 style={{ opacity: (StyleCheck('email') || StyleCheck('email', 'isUsed')) ? '1' : '0' }}>
                        { StyleCheck('email', 'isUsed') ? 'Email já está em uso' : 'Email inválido' }
                        </h4>
                    </div>

                    <div className='L-Form'>
                        <input type='password' name='password' autoComplete='off' value={CreateForm.password} onChange={handleChange}
                        style={{borderColor: StyleCheck('password') ? 'var(--red)':''}}/>
                        <label style={{ top: CreateForm.password.length >= 1 ? '-15px' : '',
                                color: StyleCheck('password') ? 'var(--red)':''}} >Senha</label>

                        <h4 style={{opacity: (StyleCheck('password') || StyleCheck('password', 'isUsed')) ? '1':'0'}}>Mínimo 8 caracteres</h4>
                    </div>

                    <div className='L-Form'>
                        <input type='text' name='phone_number' autoComplete='off' value={CreateForm.phone_number} onChange={handleChange}
                        style={{borderColor: StyleCheck('phone_number') ? 'var(--red)':''}}/>
                        <label style={{ top: CreateForm.phone_number.length >= 1 ? '-15px' : '',
                                color: StyleCheck('phone_number') ? 'var(--red)':''}} >Telefone</label>

                        <h4 style={{opacity: (StyleCheck('phone_number') || StyleCheck('phone_number', 'isUsed')) ? '1':'0'}}>
                            { StyleCheck('phone_number', 'isUsed') ? 'Telefone já está em uso' : 'Digíte um número válido' }
                        </h4>
                    </div>

                    <button className="L-Form-Button" onClick={() => handleSubmitCreate()}> Criar Conta </button>
                </div>
            </div>
        )
    }

    function AreaLogin() {
        const [FormLogin, setLoginForm] = useState({
            "email": "",
            "password": "",
        })
        const [FormLoginCHECK, setLoginFormCHECK] = useState({
            "email": true,
            "password": true,
        })

        const handleChange = (e) => {
            setLoginForm({
                ...FormLogin,
                [e.target.name]: e.target.value
            })
        }

        const handleSubmitLogin = () => {
            // Faz uma solicitação POST para o script PHP para logar
            console.log(FormLogin)
            axios.post("http://localhost/bookloop/Account/Login.php", FormLogin)
                .then(response => {
                    console.log('Login efetuado com sucesso:', response.data)
                    setResult(response.data)
                })
                .catch(error => {
                    console.error('Erro ao logar:', error)
                    console.log(error.response.status)
                    if (error.response) {
                        if (error.response.status === 405) { // EMAIL errado
                            setLoginFormCHECK(prevState => {
                                let dic = { ...prevState }
                                dic.password = false
                                dic.email = true
                                return dic
                            })
                        }
                        if (error.response.status === 404) { // SENHA errado
                            setLoginFormCHECK(prevState => {
                                let dic = { ...prevState }
                                dic.email = false
                                dic.password = true
                                return dic
                            })
                        }
                        if (error.response.status === 400){
                            alert('nao digitou em nenhum campo')
                        }
                    }
                })
               
        }

        function StyleCheck(item) {
            return FormLoginCHECK[item] === false
        }

        return (
            <div className='L-Container-Login'>
                <div className='L-Container-Select'>
                    <h4 className={`${AreaSelected === 1 ? 'L-Select-Text-Actived' : 'L-Select-Text'}`}
                        onClick={() => setAreaSelected(1)} >Criar Conta</h4>
                    <h4 className={`${AreaSelected === 2 ? 'L-Select-Text-Actived' : 'L-Select-Text'}`}
                    >Entrar</h4>
                </div>

                <div className='L-Container-Form'>
                    <div className='L-Form'>
                        <input type='email' name='email' autoComplete='off' value={FormLogin.email} onChange={handleChange}
                            style={{borderColor: StyleCheck('email') === true ? 'var(--red)': ''}}/>
                        <label style={{ top: FormLogin.email.length >= 1 ? '-15px' : '',
                                color: StyleCheck('email') ? 'var(--red)':'' }} >Email</label>
                        <h4 style={{opacity: StyleCheck('email') ? '1':'0'}}>Email Inválido</h4>
                    </div>
                    
                    <div className='L-Form'>
                        <input type='password' name='password' autoComplete='off' value={FormLogin.password} onChange={handleChange}
                            style={{borderColor: StyleCheck('password') === true ? 'var(--red)': ''}}/>
                        <label style={{ top: FormLogin.password.length >= 1 ? '-15px' : '',
                                color: StyleCheck('password') ? 'var(--red)':'' }} >Senha</label>
                        <h4 style={{opacity: StyleCheck('password') ? '1':'0'}}>Senha Inválida</h4>
                        <h5 onClick={() => setAreaSelected(3)}>Esqueceu a senha?</h5>
                    </div>
                    <br/>
                    <br/>
                    <button className="L-Form-Button" onClick={() => handleSubmitLogin()}> Entrar </button>
                </div>
            </div>
        )
    }

    function AreaForgot() {
        const [EmailConfirmed, setEmailConfirmed] = useState(false)
        const [Email, SetEmail] = useState("")

        function Step1(){
            const [IsConfirm, setIsConfirm] = useState(false)
            const [ForgotEmail, setForgotEmail] = useState("")
            const [ForgotEmailCHECK, setForgotEmailCHECK] = useState(true)

            function StyleCheck() {
                return ForgotEmailCHECK === false
            }

            const validateEmail = (email) => {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(String(email).toLowerCase())
            }
            const handleChange = (e) => {
                setForgotEmail(e.target.value)
            }
    
            useEffect(()=>{
                if (IsConfirm) {
                    setForgotEmailCHECK(() => {
                        return validateEmail(ForgotEmail)
                    })
                }
            },[IsConfirm, ForgotEmail ])

            const EmailStep = () => {
                setIsConfirm(true)
                function SubmitToken(){
                    axios.post("http://localhost/bookloop/Account/ForgotPassword.php", {email: ForgotEmail})
                    .catch(error => {
                        console.error('Erro ao logar:', error)
                        console.log(error.response.status)
                    })
                }
                if (ForgotEmailCHECK === validateEmail(ForgotEmail) ){
                    SubmitToken()
                    SetEmail(ForgotEmail)
                    setEmailConfirmed(true)
                }

            }

            return(
                <div className='L-Container-Form'>
                    <div className='L-Form'>
                        <input type='email' name='email' autoComplete='off' value={ForgotEmail} onChange={handleChange}
                            style={{ borderColor: StyleCheck() === true ? 'var(--red)' : '' }} />
                        <label style={{
                            top: ForgotEmail.length >= 1 ? '-15px' : '',
                            color: StyleCheck() ? 'var(--red)' : ''
                        }} >Email</label>
                        <h4 style={{ opacity: StyleCheck() ? '1' : '0' }}>Email Inválido</h4>
                    </div>

                    <br />
                    <br />
                    <button className="L-Form-Button" onClick={() => EmailStep()}> Confirmar </button>
                </div>
            )
        }

        function Step2( {Email} ){
            const [ForgotCode, setForgotCode] = useState("")
            const [ForgotCodeCHECK, setForgotCodeCHECK] = useState(true)
            const [ForgotCodeExpire, setForgotCodeExpire] = useState(false)

            const [ForgotConfirmed, setForgotConfirmed] = useState(false)

            const handleChange = (e) => {
                setForgotCode(e.target.value)
            }

            function StyleCheck() {
                return ForgotCodeCHECK === false
            }

            const CodeStep = () => {
                if (ForgotCode.length <= 1){
                    setForgotCodeCHECK(false)
                    return
                }

                axios.post("http://localhost/bookloop/Account/ConfirmForgotPassword.php", {email: Email, code: ForgotCode})
                .then(response => {
                    console.log('Verificação: ', response.data)
                    setForgotCodeCHECK(response.data.success)
                    setForgotConfirmed(response.data.success)
                })
                .catch(error => {
                    console.error('Erro ao validar:', error)
                    console.log(error.response.status)
                    console.log(error.response.success)
                    if (error.response.status === 401) { // codigo expirado
                        setForgotCodeExpire(true)
                    }
                })
            }


            function ConfirmPassword(){
                const [ConfirmPassword, setConfirmPassword] = useState({Password: "", rePassword: ""})
                const [ConfirmPasswordCheck, setConfirmPasswordCheck] = useState({Password: true, rePassword: true})
                const [IsConfirm, setIsConfirm] = useState(false)
                const [ChangedPassword, setChangePassword] = useState(false)

                const handleChange = (e) => {
                    setConfirmPassword({
                        ...ConfirmPassword,
                        [e.target.name]: e.target.value
                    })
                }

                useEffect(()=>{
                    if (IsConfirm) {
                        setConfirmPasswordCheck(prevState => {
                            let dic = {...prevState}
                            dic.Password = ConfirmPassword.Password.length >= 8
                            dic.rePassword = ConfirmPassword.rePassword === ConfirmPassword.Password
                            return dic
                        })
                    }
                },[IsConfirm, ConfirmPassword ])

                function handleSubmitPasswordChange(){
                    if (IsConfirm === false) {
                        setIsConfirm(true)
                    }
                    // verifica os inputs
                    const dic = {...ConfirmPasswordCheck}
                    dic.Password = ConfirmPassword.Password.length >= 8
                    dic.rePassword = ConfirmPassword.rePassword === ConfirmPassword.Password

                    let check = Object.keys(dic).every((item) => {
                        return dic[item]
                    })
                    if (check){
                        //Faz uma solicitação POST para o script PHP para trocar a senha
                        axios.post("http://localhost/bookloop/Account/ChangePassword.php", 
                        {email: Email, password: ConfirmPassword.Password })
                        .then(response => {
                            console.log('Senha redefinida com sucesso:', response.data)
                            setChangePassword(response.data.success)
                        })
                        .catch(error => {
                            console.error('Erro ao redifinir senha:', error)
                        })
                    }
                }

                function StyleCheck(item) {
                    return ConfirmPasswordCheck[item] === false
                }

                return (
                    <>
                        {ChangedPassword === true ?
                            <div style={{display: 'grid', justifyItems: 'center', gap: '20px'}}>
                                <h1 style={{textAlign: 'center'}}>Senha trocada com sucesso</h1>
                                <SVGcheckmark style={{ fill: 'var(--accent)', width: 'auto', height: '80px' }} />
                                <br/>
                                <br/>
                                <button className='L-Form-Button' onClick={() => window.location.href = '/home'}>Logar</button>
                            </div>

                            :
                            <>
                                <h3>{Email}</h3>
                                <br />
                                <div className='L-Form'>
                                    <input type='password' name='Password' autoComplete='off' value={ConfirmPassword.Password} onChange={handleChange}
                                        style={{ borderColor: StyleCheck('Password') ? 'var(--red)' : '' }} />
                                    <label style={{
                                        top: ConfirmPassword.Password.length >= 1 ? '-15px' : '',
                                        color: StyleCheck('Password') ? 'var(--red)' : ''
                                    }} >Nova Senha</label>
                                    <h4 style={{ opacity: StyleCheck('Password') ? '1' : '0' }}>Mínimo 8 caracteres</h4>
                                </div>

                                <div className='L-Form'>
                                    <input type='password' name='rePassword' autoComplete='off' value={ConfirmPassword.rePassword} onChange={handleChange}
                                        style={{ borderColor: StyleCheck('rePassword') ? 'var(--red)' : '' }} />
                                    <label style={{
                                        top: ConfirmPassword.rePassword.length >= 1 ? '-15px' : '',
                                        color: StyleCheck('rePassword') ? 'var(--red)' : ''
                                    }} >Repetir Nova Senha</label>
                                    <h4 style={{ opacity: StyleCheck('rePassword') ? '1' : '0' }}>A Senha não confere</h4>
                                </div>

                                <br />
                                <br />
                                <button className="L-Form-Button" onClick={() => handleSubmitPasswordChange()}> Confirmar </button>
                            </>
                        }
                    </>
                )
            }
            return (
                <div className='L-Container-Form'>
                    {ForgotConfirmed === false ?
                        <>
                        <h3>{Email}</h3>
                        <br />
                        <div className='L-Form'>
                            <input type='code' name='code' autoComplete='off' value={ForgotCode} onChange={handleChange}
                                style={{ borderColor: StyleCheck() === true ? 'var(--red)' : '' }} />
                            <label style={{
                                top: ForgotCode.length >= 1 ? '-15px' : '',
                                color: StyleCheck() ? 'var(--red)' : ''
                            }}> Código De Verificação </label>
                            <h4 style={{ display: ForgotCodeExpire === true ? 'block' : 'none' }}>Código expirou</h4>
                            <h4 style={{ opacity: StyleCheck() ? '1' : '0' }}>Código ou email inválido</h4>
                        </div>

                        <br />
                        <br />
                        <button className="L-Form-Button" onClick={() => CodeStep()}> Confirmar </button>
                        </>
                        :
                        <ConfirmPassword />
                    }

                </div>
            )
        }

        return (
            <div className='L-Container-Login'>
                <div className='L-Container-Select'>
                    <h4 className={`${AreaSelected === 1 ? 'L-Select-Text-Actived' : 'L-Select-Text'}`}
                     onClick={() => setAreaSelected(1)} >Criar Conta</h4>
                    <h4 className={`${AreaSelected === 2 ? 'L-Select-Text-Actived' : 'L-Select-Text'}`}
                     onClick={() => setAreaSelected(2)} >Entrar</h4>
                </div>
                {
                    EmailConfirmed === false ?
                    <Step1 /> // por email
                    :
                    <Step2 Email={Email}/> // por codigo
                }
            </div>
        )
    }

    return (
        <div className='L-Container-All'>
            <div className='L-Side-Image-Container' >
                <SVGlogo className='L-Side-Image'/>
            </div>

            {AreaSelected === 1 &&
                <AreaCreate />
            }
            {AreaSelected === 2 &&
                <AreaLogin />
            }
            {AreaSelected === 3 &&
                <AreaForgot />
            }
        </div>
    )
}

export default Login;