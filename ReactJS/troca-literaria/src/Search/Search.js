import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { _genre, _type, _lang, _book_condition } from '../DATA'

import { Link ,useParams } from 'react-router-dom'
import BookCardFull from '../Components/BookCardFull'

import Loading from '../Components/Loading/Loading'

import Header from '../Header/Header'
import "./Search.css"


import {ReactComponent as SVGSearch} from '../imagens/search.svg'
import {ReactComponent as SVGBook} from '../imagens/book.svg'
import {ReactComponent as SVGAuthor} from '../imagens/author.svg'
import ScoreInStar from '../Components/ScoreInStar/ScoreInStar';
import UserFeedback from '../Components/UserFeedback/UserFeedback';


function InputSearch( {handleChange, value, AreaSelected, setAreaSelected} ){
    const [scrollPosition, setScrollPosition] = useState(0)

    const [SelectionClicked, setSelectionClicked] = useState(false)
    const [Selection, setSelection] = useState(<SVGBook className='S-icon-SVG'/>)


    // Função para atualizar a posição de rolagem
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    }
  
    // Adiciona o event listener quando o componente é montado
    // Remove o event listener quando o componente é desmontado
    useEffect(() => {
      window.addEventListener('scroll', updateScrollPosition);
      return () => window.removeEventListener('scroll', updateScrollPosition);
    }, [])


    function User(){
        return(
            <div className='S-icon-container'>
                <div className='S-icon-user' />
            </div>
        )
    }

    return(
        <>
            <div className='S-left-modal' style={{display: SelectionClicked && 'block'}} onClick={()=>setSelectionClicked(false)}/>
            <div className='S-input-container-all' 
                style={{position: scrollPosition > 50 && 'fixed',
                boxShadow: scrollPosition > 50 && 'black 0px 0px 15px 2px'
            }}>
                <div className='S-input-slection-container'>
                    <div onClick={()=>setSelectionClicked(!SelectionClicked)} className='S-input-button-selector' >
                        {Selection}
                    </div>

                    {SelectionClicked &&
                        <div className='S-custom-select-dropdown' onClick={()=>setSelectionClicked(!SelectionClicked)} style={{top: '40px', fontWeight: 'bold'}}>
                            <div onClick={()=> {setSelection( <SVGBook className='S-icon-SVG'/> );setAreaSelected(1)} } className='S-custom-select-option'> Livros </div>
                            <div onClick={()=> {setSelection( <SVGAuthor className='S-icon-SVG'/> );setAreaSelected(2) }} className='S-custom-select-option'> Autor(es) </div>
                            <div onClick={()=> {setSelection( <User /> );setAreaSelected(3) }} className='S-custom-select-option'> Usuários </div>
                        </div>
                    }

                </div>
                <div className='S-input-container'>
                    <SVGSearch className='S-input-icon' style={{position: 'absolute', padding: '10px'}}/>
                    <input className="S-input"onChange={handleChange} value={value}
                    placeholder={
                        (AreaSelected === 1 && 'Pesquise Por Livros')
                        || 
                        (AreaSelected === 2 && 'Pesquise Por Autor(es)')
                        ||
                        (AreaSelected === 3 && 'Pesquise Por Usuários')
                    }
                    />
                </div>
            </div>
        </>
    )
}

function Filters( {Params, setParams, isFilterActive, handleChangeParams} ){


    function CustomSelect({ options, label, _Param, _setParam, Key }) {
        const [isOpen, setIsOpen] = useState(false)

        const handleOptionClick = (value) => {
            console.log( Key, value)
            _setParam({
                ...Params,
                [Key]: value
            })
            setIsOpen(false)
        }

        return (
            <>
            <div className='S-left-modal' onClick={() => setIsOpen(false)}
                style={{display: isOpen &&'block'}}/>

            <div className='S-custom-select-container' onClick={() => setIsOpen(!isOpen)}
                style={{
                backgroundColor: isOpen && 'var(--accent)',
                filter: (!isOpen && !_Param) && 'brightness(0.7)',
                zIndex: isOpen && '20'}}>

                <div className='S-custom-select-label'>
                    {label}: {_Param || 'Todos'}
                </div>

                {isOpen && (
                    <div className='S-custom-select-dropdown'>
                        <div  className='S-custom-select-option' onClick={() => handleOptionClick('')}>Todos</div>
                        {options.map((option, i) => (
                            <div className='S-custom-select-option' onClick={() => handleOptionClick(option)}
                                style={{backgroundColor: _Param === option && 'var(--accent)'}} key={i}>
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </>
        )
    }

    return (
        <div className='S-filter-container' style={{borderColor: isFilterActive && 'var(--accent)'}}>
            <CustomSelect options={Object.values(_type)} label="Tipo" _Param={Params.type} _setParam={setParams} Key={'type'} />
            <CustomSelect options={Object.values(_book_condition)} label="Condição" _Param={Params.book_condition} _setParam={setParams} Key={'book_condition'} />
            <CustomSelect options={Object.values(_lang)} label="Linguagem" _Param={Params.lang} _setParam={setParams} Key={'lang'} />
            
            <line style={{width: '100%', height: '2px', backgroundColor: 'var(--background-2)'}}/>

            <div className='S-filter-input-container'
                style={{filter: (Params.min_pags > 0 || Params.max_pags > 0)  && 'brightness(1)'}}>

                <div style={{fontSize: '18px'}}> Páginas: </div>
                <input className='S-filter-input S-filter-min-max' placeholder='Min' type='number'
                    onChange={(e)=>handleChangeParams('min_pags',e.currentTarget.value)} value={Params.min_pags}/>

                <vertical style={{height: '21px', width: '2px', backgroundColor: 'var(--text)'}}/>

                <input className='S-filter-input S-filter-min-max' placeholder='Max' type='number'
                    onChange={(e)=>handleChangeParams('max_pags',e.currentTarget.value)} value={Params.max_pags}/>
            </div>

            <div className='S-filter-input-container'
                style={{filter: Params.year > 0  && 'brightness(1)'}}>
                <div style={{fontSize: '18px'}}> Ano: </div>
                <input className='S-filter-input S-filter-year' placeholder='Ano' type='number'
                    onChange={(e)=>handleChangeParams('year',e.currentTarget.value)} value={Params.year}/>
            </div>
            <button className='S-filter-reset-button' onClick={()=>{
                const COPY = {...Params}
                COPY.year = ''
                COPY.min_pags = ''
                COPY.max_pags = ''
                COPY.type = ''
                COPY.lang = ''
                COPY.book_condition = ''
                setParams(COPY)
            }}>
                Redefinir
            </button>
        </div>
    )
}

function OrderBy({ handleChangeParams, Params }) {
    const orderBy = [{text: 'Página', param: 'pags'}, {text: 'Ano', param: 'year'}, {text: 'Título', param: 'title'}, {text: 'Condição', param: 'book_condition'}, {text: 'Data', param: 'created_at'}]
    const orderByObj = Object.fromEntries(orderBy.map(item => [item.param, item.text]))

    const order = [{text: 'Crescente', param: 'asc'}, {text: 'Decrescente', param: 'desc'}]
    const orderObj = Object.fromEntries(order.map(item => [item.param, item.text]))

    function ButonComponent({arr, func, label, Default, _key, value}){
        const [SelectionClicked, setSelectionClicked] = useState(false)
        const [Selection, setSelection] = useState(()=>{return value ? value : 'Nenhum'})


        return(
            <>
            <div className='S-left-modal' style={{ display: SelectionClicked && 'block' }} onClick={() => setSelectionClicked(false)} />
            <div style={{display: 'grid', justifyItems: 'center', gap: '2px'}}>

                <div style={{fontWeight: 'bold'}}> {label} </div>

                <div className='S-custom-select-container' onClick={() => setSelectionClicked(!SelectionClicked)} 
                    style={{backgroundColor: SelectionClicked && 'var(--accent)'}} >

                    <div className='S-custom-select-label' >
                        {(Default.length >= 1  && Selection === 'Nenhum') ? Default : Selection }
                    </div>

                    {SelectionClicked &&
                        <div className='S-custom-select-dropdown' onClick={() => setSelectionClicked(!SelectionClicked)} style={{ fontWeight: 'bold' }}>
                            {_key === 'orderBy' &&
                                <div onClick={() => { func(_key, ''); setSelection('Nenhum') }} className='S-custom-select-option'> Nenhum </div>
                            }

                            {arr.map((item)=>{
                                return <div key={item} onClick={() => { func(_key, item.param); setSelection(item.text) }} className='S-custom-select-option'> {item.text} </div>

                            })}
                        </div>
                    }
                </div>
            </div>
            </>
        )
    }


    return (
        <>
            <ButonComponent
                arr={orderBy}
                func={handleChangeParams}
                _key={'orderBy'} label={'Ordernar Por'}
                Default=""
                value={orderByObj[Params.orderBy]}
            />

            <ButonComponent
                arr={order}
                func={handleChangeParams}
                _key={'order'} label={'Ordem'}
                Default={'Decrescente'}
                value={orderObj[Params.order]}
            />

        </>
    )
}

function Search() {
    const [AreaSelected, setAreaSelected] = useState(1)
    const { query, genreId, typeId  } = useParams()
    const [Books, SetBooks] = useState([])
    const [Users, setUsers] = useState(null)

    const [AllGenres, setAllGenres] = useState([])

    const [timerId, setTimerId] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)

    const [Query, setQuery] = useState("")
    const [Params, setParams] = useState(
        {
            year: '',
            min_pags: '',
            max_pags: '',
            type: '',
            lang: '',
            book_condition: '',
            genres: [],
            orderBy: '',
            order: 'desc'
        }
    )
    const [isFilterActive, setIsFilterActive] = useState(false)

    useEffect(() => {
        const isAnyFilterActive = Object.keys(Params).some(key => {
            if (key === 'order') return false // Ignorar o filtro 'order'
            if (key === 'orderBy') return false // Ignorar o filtro 'orderBy'
            if (key === 'query') return false // Ignorar o filtro 'query'
            if (key === 'genres') return false // Ignorar o filtro 'genres'

            return Params[key] !== ""
        })
        setIsFilterActive(isAnyFilterActive)
    }, [Params])

    useEffect(() => {
        if (timerId) {
            clearTimeout(timerId)
        }
        // Define um novo timer
        const newTimerId = setTimeout(() => {
            if (AreaSelected !== null) {
                if (AreaSelected === 3 ){
                    GetUsers()
                    setIsLoading(false)
                }
                else if ( AreaSelected === 1 || AreaSelected === 2) {
                    GetBooks()
                    setIsLoading(false)
                }
            }

        }, 800)

        setTimerId(newTimerId)
        setIsLoading(true)

        return () => {
            clearTimeout(newTimerId)
        }
    }, [Params, Query, AreaSelected])

    useEffect(()=>{
        if (query){
            setQuery(query)
        }
    },[query])

    useEffect(()=>{
        if (genreId){
            handleChangeGenres(parseInt(genreId))
        }
    },[genreId])

    useEffect(()=>{
        if (typeId && Object.values(_type).includes(typeId)){
            handleChangeParams('type', typeId)
        }
    },[typeId])


    useEffect(()=>{
        if (AreaSelected === 1 || AreaSelected === 2  || AreaSelected === 3){
            setQuery('')
        }
    },[AreaSelected])


    function handleChangeQuery(e) {
        setQuery(e.target.value)
    }

    function handleChangeParams(param, value) {
        if (param === 'min_pags' || param === 'max_pags' || param === 'year') {
            if (value === undefined || isNaN(value) ){
                return value = '' // Se o valor for negativo, defina-o como 0
            }
            if (parseInt(value, 10) === 0) {
                value = ''
            }
            else if (parseInt(value, 10) < 0) {
                value = '' // Se o valor for negativo, defina-o como 0
            }
        }

        if (param === 'genres'){
            const index = Params['genres'].indexOf(value)
            if (index !== -1) {
                Params['genres'].splice(index, 1)
            } else {
                Params['genres'].push(value)
            }
            value = Params.genres
            console.log(value)
        }

        setParams({
            ...Params,
            [param]: value
        })
    }

    function handleChangeGenres(value) {
        const ArrCopy = [...Params.genres]
        const index = ArrCopy.indexOf(value)

        if (index !== -1) {
            ArrCopy.splice(index, 1)
        }
        else {
            ArrCopy.push( parseInt(value) )
        }
        value = Params.genres
    

        setParams({
            ...Params,
            ['genres']: ArrCopy
        })
    }


    function GetBooks() {
        const COPY = {...Params}

        if (AreaSelected === 1){
            COPY['query'] = Query
        }
        else if (AreaSelected === 2){
            COPY['author'] = Query
            COPY['query'] = ''
        }
        console.log(COPY)

        axios.get('http://localhost/bookloop/Search/GetBooks.php', {params: COPY})
        .then(response => {
            const Books = response.data
            // console.log(response.data)
            if (Object.keys(Books).length >= 1){
                SetBooks(response.data)
                GetOrganizeGenres()
                console.log(response.data)
            }
            else { return SetBooks(404) }
        })
        .catch(error => {
            console.error('Erro:', error)
            SetBooks(404)
            GetOrganizeGenres()
        })
    }
    function GetUsers() {
        axios.get('http://localhost/bookloop/Search/GetUsers.php', {params: {user_query: Query} } )
        .then(response => {
            const Users = response.data
            console.log(response.data)
            if (Object.keys(Users).length >= 1){
                setUsers(response.data)
                console.log(response.data)
            }
            else { return setUsers(404) }
        })
        .catch(error => {
            console.error('Erro:', error)
            setUsers(404)
        })
    }

    function GetOrganizeGenres() {
        const COPY = {...Params}

        if (AreaSelected === 1){
            COPY['query'] = Query
        }
        else if (AreaSelected === 2){
            COPY['author'] = Query
            COPY['query'] = ''
        }
        console.log(COPY)

        axios.get('http://localhost/bookloop/Search/GetOrganizeGenres.php', {params: COPY})
        .then(response => {
            const Books = response.data
            // console.log(response.data)
            if (Object.keys(Books).length >= 1){
                console.log(response.data)
                setAllGenres(response.data)
            }
            else { return setAllGenres(404) }
        })
        .catch(error => {
            console.error('Erro:', error)
            console.log(error)
        })
    }


    function CardUser( {UserInfos} ){
        const BookStatus = UserInfos?.books

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

        function PhotoPerfil() {
            return (
                <>
                    {UserInfos['photo'].length >= 1 ?
                        <div className='MA-perfil'>
                            <img className="MA-perfil-photo"
                                src={UserInfos['photo']} alt="perfil" />
                        </div>
                        :
                        <div className='MA-perfil'>
                            <div className="MA-profile-icon" />
                        </div>
                    }

                </>
            )
        }

        return (
            <div className='MA-myPerfil' style={{backgroundColor: 'var(--background-2)', padding: '10px', borderRadius: '10px'}}>
                <Link to={`/user/${UserInfos.id}`} target='_blank'>
                    <h3 style={{ color: 'var(--accent)' }}> {UserInfos['username']} </h3>
                </Link>

                <Link to={`/user/${UserInfos.id}`} target='_blank'>
                    <PhotoPerfil />
                </Link>
                {UserInfos.average_score > 0 &&
                    <ScoreInStar score={UserInfos.average_score}/>
                }
                <UserFeedback feedback={UserInfos.feedbacks} />
                <h5 style={{ opacity: '0.6' }}>Na <span style={{ color: 'var(--accent)' }}>Troca Literária</span> desde {FormatDate(UserInfos['created_at'], 'year')}</h5>
                <h4>
                    <span style={{ color: 'var(--accent)' }}> {BookStatus.isActive} </span> de
                    <span style={{ color: 'var(--accent)' }}> {BookStatus.total} </span> Anúncios Ativos
                </h4>
                
                <Link to={`/user/${UserInfos.id}`} target='_blank' className='S-user-button'>
                    <h3>Mostrar Perfil</h3>
                </Link>
            </div>
        )
    }


    return (
        <>
        <Header />
        <div className='S-container-all'>
            <InputSearch handleChange={handleChangeQuery} value={Query} AreaSelected={AreaSelected} setAreaSelected={setAreaSelected}/>

            <div className='S-container'>
                {AreaSelected === 3 ? // Pesquiar por Livros e Autores
                    Users !== null &&
                        <div className="S-container-right">
                            {IsLoading ?
                                <div style={{ display: 'grid', justifyContent: 'center', padding: '20px' }}>
                                    <Loading border={15} size={50} key={'Loading 1'}/>
                                </div>
                                :
                                <div className='S-itens-container' style={{justifyContent: 'center', gridTemplateColumns: 'repeat(auto-fill, 220px)'}}>
                                    {Users?.length >= 1 &&
                                        Users.map((item, i) => {
                                            return <CardUser UserInfos={item} key={i}/>
                                        })
                                    }
                                </div>
                            }
                            {Users === 404 &&
                                <div style={{ display: 'grid', justifyContent: 'center', padding: '20px' }}>
                                    Nenhum Usuário Encontrado
                                </div>
                            }
                        </div>
                : // Pesquiar por usuarios
                    <>
                    <div className='S-container-left'>
                        <div className='S-left-text' style={{backgroundColor: isFilterActive && 'var(--accent)'}}>Filtros</div>
                        <Filters Params={Params} setParams={setParams} handleChangeParams={handleChangeParams} isFilterActive={isFilterActive}/>
                    </div>

                    <div className='S-container-right'>
                        <div className='S-genres-container-all'>
                            <div className='S-genres-label'>
                                <h3> Gêneros </h3>
                            </div>

                            <div className='S-genres-itens-container'>
                                {AllGenres.map((item, i) => {
                                    return (
                                        <div className='S-genres-item' onClick={() => handleChangeGenres(parseInt(item))}
                                            style={{ backgroundColor: Params.genres.includes(parseInt(item)) && 'var(--accent)' }} key={i}>
                                            {_genre[parseInt(item)]}
                                        </div>
                                    )
                                })}
                            </div>

                        </div>

                        <line style={{width: '100%', height: '2px', backgroundColor: 'var(--background-2)'}}/>

                        <div className='S-aplied-filters-and-orderBy'>
                            <div className='S-aplied-filters-container'
                                style={{display: (Query.length >= 1 || Params.genres.length >= 1) && 'grid'}}>
                                {Query.length >= 1 &&
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <SVGSearch className='S-icon-SVG' />
                                        {Query}
                                    </div>
                                }

                                {Params.genres.length >= 1 &&
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        {Params.genres.map((item, i)=>{
                                            return <div className='S-aplied-filter' key={i}> { _genre[item] }</div>
                                        })}
                                    </div>
                                }
                            </div>

                            <div className='S-orderBy-container-all'>
                                <OrderBy handleChangeParams={handleChangeParams} Params={Params} />
                            </div>
                        </div>

                        <line style={{width: '100%', height: '2px', backgroundColor: 'var(--background-2)'}}/>

                        {IsLoading ?
                            <div style={{ display: 'grid', justifyContent: 'center', padding: '20px' }}>
                                <Loading border={15} size={50} />
                            </div>
                            :
                            <div className='S-itens-container'>
                                {Books?.length >= 1 &&
                                    Books.map((item, i) => {
                                        return <BookCardFull book={item} hideUser={false} key={i}/>
                                    })
                                }
                            </div>
                        }
                        {Books === 404 &&
                            <div style={{ display: 'grid', justifyContent: 'center', padding: '20px' }}>
                                Nenhum livro Encontrado
                            </div>
                        }
                    </div>
                    </>
                }
            </div>

        </div>
        </>
    )
}

export default Search

