import React, { useContext, useEffect, useState, useCallback } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { LoginContext } from '../Login/LoginContext.js'

import axios from 'axios'
import { _genre, _type, _lang } from "../DATA.js"

import Ok from "../Components/Signals/Ok/ok.js"
import Error from "../Components/Signals/Error/Error.js"
import Loading from "../Components/Loading/Loading.js"

import './AddBook.css'

import { ReactComponent as Trash } from "../imagens/trash.svg"

import { ReactComponent as Lock } from "../imagens/lock.svg"
import { ReactComponent as World } from "../imagens/world.svg"

function AddBook( { book_edit } ) {
    const { User } = useContext(LoginContext)

    const [GenreActive, setGenreActive] = useState(false)
    const [IsCheking, setIsCheking] = useState(false)

    const [IsFinish, SetIsFinish] = useState(false)
    const [FinishBookID, setFinishBookID] = useState(null)

    const [formData, setFormData] = useState(() => {
        if (book_edit !== null) {
            return {
                isActive: book_edit.isActive,
                title: book_edit.title,
                author: book_edit.author,
                year: String(book_edit.year),
                pags: String(book_edit.pags),
                type: book_edit.type,
                lang: book_edit.lang,
                book_condition: book_edit.book_condition,
                description: book_edit.description,
                user_description: book_edit.user_description,
                user_id: book_edit.user_id,
                image_urls: book_edit.image_urls,
                genres: book_edit.genres,
            }
        } else {
            return {
                isActive: 1,
                title: '',
                author: '',
                year: '',
                pags: '',
                type: _type[0],
                lang: _lang[0],
                book_condition: 'Usado',
                description: '',
                user_description: '',
                user_id: User.Id,
                image_urls: [],
                genres: [],
            }
        }
    })

    useEffect(()=>{
        if (IsCheking){
            const itens = ['title', 'author', 'year', 'pags', 'description', 'image_urls', 'genres']
            let IsPassed = true

            itens.map((key)=>{
                if (formData[key].length <= 0) {
                    return IsPassed = false
                }
                return IsPassed
            })
            IsPassed ? setIsCheking(false) : setIsCheking(true)
        }
    },[formData])


    const handleChange = useCallback((e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }))
    }, [])

    function IsChekingStyle( key ){
        return (IsCheking === true && formData[key].length <=0)
    }

    function BTNnext() {
        const itens = ['isActive','title', 'author', 'year', 'pags', 'type', 'lang', 'book_condition','description', 'image_urls', 'genres']
        let IsPassed = true

        itens.map((key)=>{
            if (formData[key].length <= 0) {
                return IsPassed = false
            }
            return IsPassed
        })
        IsPassed ? setIsCheking(false) : setIsCheking(true)

        if (IsPassed) {
            Post()
        }
    }
    function Post() {
        // Faz uma solicitação POST para o script PHP para inserir a nova receita
        if ( book_edit === null ) { // nao está editando
            axios.post("http://localhost/bookloop/Book/AddBook.php", formData)
            .then(response => {
                console.log( response.data )
                if (response.data.success) {
                    console.log(response.data.book_id)
                    SetIsFinish(true)
                    setFinishBookID(response.data.book_id)
                } else { setFinishBookID('erro') }
            })
            .catch(error => {
                console.error('Erro ao adicionar livro:', error)
                SetIsFinish(true)
                setFinishBookID('erro')
            })
        }
        else if ( book_edit !== null ){ // está editando
            const COPY = {...formData}
            COPY['book_id'] = book_edit.id
            COPY['user_id'] = User.Id
            COPY['token'] = User.Token
            console.log(COPY)
            axios.post("http://localhost/bookloop/Book/UpdateBook.php", COPY)
            .then(response => {
                console.log(response.data)
                if (response.data.success) {
                    console.log(response.data.book_id)
                    SetIsFinish(true)
                    setFinishBookID(response.data.book_id)
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar livro:', error)
                SetIsFinish(true)
                setFinishBookID('erro')
            })
        }

    }

    function Genres(){
        useEffect(()=>{
            if (formData['genres'].length <= 0 && IsCheking){
                setGenreActive(true)
            }
        },[IsCheking])

        function GenresSelect(){
            let GenreList = formData['genres']
            const [SearchFilter, setSearchFilter] = useState('')

            const filteredGenres = Object.entries(_genre)
            .filter(([_, value]) => value.toLowerCase().includes(SearchFilter.toLowerCase()))

            const handleChangeSearch = useCallback((e) => {
                setSearchFilter(e.target.value)
            }, [])

            return(
                <div className='AB-genre-select-container-all'>
                    <input className='AB-genre-select-input' placeholder='Buscar Por um Gênero Específico' onChange={handleChangeSearch} value={SearchFilter} />

                    {filteredGenres.length >= 1 ?
                        <div className='AB-genre-select-container' style={{ animation: (formData['genres'].length || IsCheking === true) >= 1 ? '' : 'genre-select 0.4s ease-in' }}>
                            {filteredGenres.map(([key, value]) => {
                                return (
                                    <div className='AB-genre-select-item' key={`${value} + ${key}`}
                                        style={{ backgroundColor: GenreList.includes(Number(key)) ? 'var(--accent)' : '' }}

                                        onClick={() => {
                                            if (GenreList.includes(Number(key))) {
                                                const newGenreList = GenreList.filter(item => item !== Number(key))
                                                const copy = { ...formData }
                                                copy['genres'] = newGenreList
                                                setFormData(copy)
                                            }
                                            else {
                                                GenreList.push(Number(key));
                                                const copy = { ...formData }
                                                copy['genres'] = GenreList
                                                setFormData(copy)
                                            }
                                        }}>

                                        <h4>{value}</h4>
                                    </div>
                                )
                            })}
                        </div>
                    :
                        <h3 style={{textAlign: 'center', padding: '10px'}}>Gênero Não Encontrado</h3>
                    }
                </div>
            )
        }


        return(
            <div style={{display: 'grid', gap: '5px'}}>
                <div style={{display: 'flex',alignItems: 'center' ,gap: '5px'}}> 
                    <h4 >Gêneros</h4>
                    <h5 style={{color: 'var(--red)', display: IsChekingStyle('genres') ? 'block' : 'none'}}>*Obrigatorio</h5>
                </div>

                <div className='AB-genres-container'>
                    {formData.genres.map((item, i) => {
                        return (
                        <>
                            <h4 key={i} style={{ color: 'var(--accent)' }}>
                                {_genre[item]}
                            </h4>
                            <h4> {i < formData.genres.length - 1 ? '-' : ''} </h4>
                        </>
                        )
                    })}
                </div>

                <div className='AB-genres-button' onClick={()=>setGenreActive(!GenreActive)}
                    style={{borderColor: GenreActive === true ? 'var(--accent)':'', borderRadius: GenreActive === true ? '10px':''}}>
                        <h4 style={{ fontSize: '12px'}}>{GenreActive === true ? 'Ocultar ⬆': 'Adicionar ⬇'}</h4>
                </div>

                {GenreActive=== true && <GenresSelect />}
            </div>
        )
    }

    function ImportImage(){
        const [IsClicked, setIsClicked] = useState(false)
        const [InputURL, setInputURL] = useState('')
        const [InvalidURL, setInvalidURL] = useState(false)



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

        async function setImage() {
            try {
                const isImage = await isImageUrl(InputURL);
                if (isImage) {
                    let imageUrlsArray = [...formData['image_urls']]
                    setInvalidURL(false)

                    imageUrlsArray.push(InputURL)
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        ['image_urls']: imageUrlsArray
                    }))
                } else {
                    setInvalidURL(true)
                }
            } catch (error) {
                console.error('Erro ao verificar a URL da imagem:', error)
                alert('Ocorreu um erro ao verificar a URL da imagem.')
            }
        }
        

        function InputLink(){
            return(
                <>
                   <div></div>  {/* important */}

                    <div style={{display: 'grid', gap:'10px'}} >
                        <input placeholder='Url da Image' autoFocus={true} className='AB-image-link-input'
                         value={InputURL} onChange={(e) => { setInputURL(e.target.value) }}
                        />

                        <h5 style={{color: 'var(--red)', opacity: InvalidURL === true ? '1':'0'}}>*Nenhuma imagem encontrada</h5>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', zIndex: '7' }}>
                        <button onClick={(e) => { e.stopPropagation(); setIsClicked(false) }} className='AB-image-link-button-cancel'>Cancelar</button>

                        <button className='AB-image-link-button' onClick={() => {setImage()}}>Enviar</button>
                    </div>
                </>
            )
        }

        return(
            <div className='AB-image-template'
                onClick={()=>setIsClicked(true)}
                style={{
                    backgroundColor: IsClicked === true ? 'var(--background)':'',
                    cursor: IsClicked === true ? 'default':'',
                    border: IsChekingStyle('image_urls') ? '1px solid var(--red)':''
                    
                    }}>
                {
                IsClicked === false ?

                    <div className='AB-image-plus'></div>
                :

                    <InputLink />

                }
            </div>
        )
    }

    function ShowImages(){
        const [ImageSelected, setImageSelected] = useState(0) // primeira imagem do array
        const [AddImage, setAddImage] = useState(false)


        function DeleteItem(){
            const imageUrlsArray = [...formData['image_urls']]
            console.log( imageUrlsArray )
            console.log( ImageSelected )

            imageUrlsArray.splice( ImageSelected, 1)
            setFormData((prevFormData) => ({
                ...prevFormData,
                ['image_urls']: imageUrlsArray
            }))
        }

        return(
            <>
                {formData['image_urls'].length >= 1 ?
                    <div className='AB-image-container'>
                        <div className='AB-image-item-container' >

                            {formData['image_urls'].map((item, i)=>{
                                return(
                                    <div className='AB-image-item-base'
                                        style={{border: (ImageSelected === i && AddImage === false) ? '2px solid var(--accent)' : '',
                                                opacity: (ImageSelected === i && AddImage === false) ? '1' : ''
                                        }}
                                        onClick={()=>{setImageSelected(i); setAddImage(false)}}>
                                        
                                        <img className='AB-image-item' src={formData['image_urls'][i]} alt={`livro: ${i}`}/>
                                    </div>
                                )
                            })}

                            {
                                formData['image_urls'].length <= 3 ?
                                    <div className='AB-image-item-base-plus'
                                        style={{ opacity: '1', display: 'grid', alignItems: 'center' }}
                                        onClick={() => { setAddImage(true) }} >

                                        <div className="AB-image-plus" style={{ width: '35px', height: '35px' }} />
                                    </div>
                                : null
                            }


                        </div>

                        <div style={{position: 'relative'}}>
                            {AddImage === true ?
                                <ImportImage />

                            :
                            <>
                                <div className='AB-image-delete' onClick={()=> DeleteItem() }>
                                    <h4 className='AB-image-delete-text'>Deletar</h4>
                                    <Trash style={{width: '28px'}}/>
                                </div>
                                
                                <div style={{width: '220px', height: '340px'}}>
                                    <img style={{borderColor: IsChekingStyle('image_urls') ? 'var(--red)' : ''}} className='AB-imgs'
                                        src={formData['image_urls'][ImageSelected]} alt={`imagem do livro: ${formData.title}`} />

                                </div>
                            </>
                            }
                        </div>
                    </div>

                :
                    <ImportImage />
                }
            </>
        )
    }

    function FinishRedirect(){
        const [TimerShowText, setTimerShowText] = useState(false)

        useEffect(() => {
            const timer = setTimeout(() => {
                setTimerShowText(true)
            }, 2000)

            return () => clearTimeout(timer) // Limpa o timer se o componente for desmontado
        }, [])

        useEffect(() => {
            if (TimerShowText) {
                const timer = setTimeout(() => {
                    if (FinishBookID !== 'erro') {
                        window.location.href = `/book/${FinishBookID}`
                    }
                }, 2000)
    
                return () => clearTimeout(timer) // Limpa o timer se o componente for desmontado
            }
        }, [TimerShowText])

        return(
            <div className='AB-finish-modal'>
                <div className='AB-finish-container'>
                    {FinishBookID === 'erro' && 
                        <>
                            <Error font={58} text={'Erro Ao Criar Anúncio!'} size={50}/>
                            <button onClick={()=>SetIsFinish(false)} className='AB-button-next'> Voltar </button>
                        </>
                    }

                    {FinishBookID !== 'erro' && FinishBookID !== null &&
                        <>

                            {TimerShowText ?
                                <div style={{display: 'grid', gap: '10px', justifyItems: 'center'}}>
                                    <Loading border={10} size={24} />
                                    <h4> Redirecionado...</h4>
                                </div>
                            :
                                <Ok font={58} text={book_edit === null ? 'Anúncio Criado!':'Anúncio Atualizado!'} size={50}/>
                            }
                        </>
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            <br />
            <br />

            {IsFinish && <FinishRedirect />}

            <div className='AB-container-card'>
                <privacy style={{ width: '207px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className='AB-announcement' onClick={() => setFormData({ ...formData, isActive: 1 })}
                            style={{ backgroundColor: formData.isActive === 1 && 'var(--accent)', borderTopRightRadius: 0, borderBottomRightRadius: 0,
                                opacity: formData.isActive === 1 && '1' }} >
                            <World className='AB-announcement-svg'
                                style={{ fill: formData.isActive === 1 && 'var(--text)' }} />
                            <h3> Público </h3>

                        </div>

                        <div className='AB-announcement' onClick={() => setFormData({ ...formData, isActive: 0 })}
                            style={{ backgroundColor: formData.isActive === 0 && 'var(--accent)', borderBottomLeftRadius: 0, borderTopLeftRadius: 0,
                                opacity: formData.isActive === 0 && '1'
                             }} >
                            <Lock className='AB-announcement-svg'
                                style={{ fill: formData.isActive === 0 && 'var(--text)' }} />
                            <h3> Privado </h3>
                        </div>
                    </div>
                </privacy>

                <TextareaAutosize
                    autoFocus={true}
                    value={formData.title}
                    placeholder="Titulo Do Livro"
                    name="title"
                    onChange={handleChange}
                    className="AB-invisible-textarea"
                    style={{ textAlign: 'center', fontSize: '20px', border: IsChekingStyle('title') ? '1px solid var(--red)' : '' }}
                />

                <ShowImages />

                <div className='AB-card'>
                    <div style={{display: 'grid', gap: '10px'}}>
                        <input className='AB-invisible-input' value={formData['author']} placeholder='Nome do Autor(a)'
                            style={{ fontSize: '18px', color: 'var(--accent)', textAlign: 'center',
                            border: IsChekingStyle('author') ? '1px solid var(--red)' : '' }}
                            type="text"
                            name={'author'}
                            autoComplete='off'

                            onChange={handleChange}
                        />

                        <line style={{backgroundColor: 'var(--background)',width: '100%', height: '2px' }}/>

                        <year style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <h4 style={{ display: formData['year'].length >= 1 ? 'block' : 'none' }}>Ano: </h4>
                            <input className='AB-invisible-input' value={formData['year']} placeholder='Ano De Publicação'
                                style={{ fontSize: '16px', color: 'var(--accent)', 
                                width: formData['year'].length >= 1 ? '60px' : '160px',
                                border: IsChekingStyle('year') ? '1px solid var(--red)' : ''}}
                                type="number"
                                name={'year'}
                                autoComplete='off'
                                onChange={handleChange}
                            />
                            <h5 style={{color: 'var(--red)', display: IsChekingStyle('year') ? 'block' : 'none'}}>*Obrigatorio</h5>
                        </year>

                        <pags style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <h4 style={{ display: formData['pags'].length >= 1 ? 'block' : 'none' }}> Páginas: </h4>
                            <input className='AB-invisible-input' value={formData['pags']} placeholder='Quantidade De Páginas'
                                style={{ fontSize: '16px', color: 'var(--accent)',
                                width: formData['pags'].length >= 1 ? '60px' : '194px',
                                border: IsChekingStyle('pags') ? '1px solid var(--red)' : '' }}
                                type="number"
                                name={'pags'}
                                autoComplete='off'
                                onChange={handleChange}
                            />
                            <h5 style={{color: 'var(--red)', display: IsChekingStyle('pags') ? 'block' : 'none'}}>*Obrigatorio</h5>
                        </pags>

                        <line style={{backgroundColor: 'var(--background)',width: '100%', height: '2px' }}/>

                        <div className='AB-itens-container'>
                            <condition style={{ display: 'grid', alignItems: 'center', gap: '5px', width: '130px' }}>
                                <h4>Condição</h4>
                                <select defaultValue={formData.book_condition} name='book_condition' className='AB-select' onChange={(e)=>handleChange(e)}>
                                    <option value="Bem Desgastado">Bem Desgastado</option>
                                    <option value="Desgastado">Desgastado</option>
                                    <option value="Usado" >Usado</option>
                                    <option value="Novo">Novo</option>
                                    <option value="Lacrado">Lacrado</option>
                                </select>
                            </condition>

                            <type style={{ display: 'grid', alignItems: 'center', gap: '5px', width: '130px' }}>
                                <h4>Tipo</h4>
                                <select defaultValue={formData.type} name='type' className='AB-select' onChange={(e)=>handleChange(e)}>
                                    {Object.values(_type).map((item, i)=>{
                                        return(
                                            <option key={`${item}-${i}`} value={item} >{item}</option>
                                        )
                                    })}
                                </select>
                            </type>

                            <lang style={{ display: 'grid', alignItems: 'center', gap: '5px', width: '130px' }}>
                                <h4>Idioma</h4>
                                <select defaultValue={formData.lang} name='lang' className='AB-select' onChange={(e)=>handleChange(e)}>
                                    {Object.values(_lang).map((item, i)=>{
                                        return(
                                            <option key={`${item}-${i}`} value={item} >{item}</option>
                                        )
                                    })}
                                </select>
                            </lang>
                        </div>


                    </div>

                    <Genres />

                    <line style={{backgroundColor: 'var(--background)',width: '100%', height: '2px' }}/>

                    <div>
                        <h3>Descrição Do livro</h3>
                        <TextareaAutosize
                            value={formData.description}
                            placeholder="Digite uma breve sinopse ou descreva o conteúdo do livro (Obrigatório)"
                            name="description"
                            onChange={handleChange}
                            className="AB-invisible-textarea"
                            style={{ border: (IsCheking === true && formData.description.length <= 0) ? '2px solid var(--red)' : '' }}
                        />

                    </div>

                    <line style={{backgroundColor: 'var(--background)',width: '100%', height: '2px' }}/>

                    <div>
                        <h3> Comentários Do Usuário </h3>
                        <TextareaAutosize
                            value={formData.user_description}
                            placeholder="Compartilhe suas opiniões sobre o livro, sobre sua experiência ou o estado do livro, exemplo: 'Página 20 rasgada.' (Opcional)"
                            name="user_description"
                            onChange={handleChange}
                            className="AB-invisible-textarea"
                        />

                    </div>

                    <line style={{backgroundColor: 'var(--background)',width: '100%', height: '2px' }}/>
                    <br />

                    <button className='AB-button-next'
                        style={{
                        backgroundColor: IsCheking === true ? 'var(--red)' : '',
                        borderColor: IsCheking === true ? 'var(--red)' : '',
                        cursor: IsCheking === true ? 'not-allowed' : ''
                        }}
                    onClick={()=> BTNnext()}
                    > Finalizar </button>
                </div>

            </div>

            <br/>
            <br/>
        </>
    )
}

export default AddBook
