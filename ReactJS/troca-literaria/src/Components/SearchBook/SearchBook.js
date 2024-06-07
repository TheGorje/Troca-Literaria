import React, { useEffect, useState } from "react"
import "./SearchBook.css"
import BookCardFull from "../BookCardFull"


function SearchBook( { Books } ){
    const [SearchBooks, setSearchBooks] = useState([])

    const [InputSearch, setInputSearch] = useState("")

    useEffect(() => {
        if (InputSearch.length >= 1 && Books.length >= 1) {
            const filteredBooks = Books.filter((book) => {
                return book.title.toLowerCase().includes(InputSearch.toLowerCase())
            })
            console.log( filteredBooks )
            setSearchBooks(filteredBooks)
        } else {
            console.log( 'nao ha livros: null' )
            setSearchBooks([])
        }
    }, [InputSearch, Books])

    return(
        Books.length >= 1 && (
            <>
                <h1 > Anúncios </h1>
                <h4 style={{ opacity: '0.8' }}>
                    <span style={{ color: 'var(--accent)' }}> {Books.filter((item) => item.isActive === 1).length} </span> de
                    <span style={{ color: 'var(--accent)' }}> {Books.length} </span> Ativos</h4>

                <div className="C-SB-input">
                    <h2 style={{ color: InputSearch.length >= 1 ? 'var(--accent)' : '' }}> Buscar </h2>

                    <input value={InputSearch} onChange={(e) => { setInputSearch(e.currentTarget.value) }} placeholder='Exemplo "Sherlock Holmes"'
                        type="text" name="Search" autoComplete="off" />
                </div>

                <div>
                    {Books.length >= 1 ?
                        (InputSearch.length >= 1 ?
                            (SearchBooks.length >= 1 ?
                                <div className='C-SB-books-container'>
                                    {SearchBooks.map((item, i) => {
                                        return (
                                            <BookCardFull book={item} hideUser={true} key={'cusSearchBookstom'+i}/>
                                        )
                                    })}

                                </div>
                                :
                                <h2 style={{textAlign: 'center'}}>
                                    <span style={{color: 'var(--red)'}}>Nenhum </span>
                                    livro com o nome
                                    <span style={{color: 'var(--accent)'}}> "{InputSearch}" </span> no perfil
                                </h2>
                            )
                            :
                            <div className='C-SB-books-container'>
                                {Books.map((item, i) => {
                                    return (
                                        <BookCardFull book={item} hideUser={true} key={i}/>
                                    )
                                })}
                            </div>
                        )
                        :
                        <p>Perfil não tem anúncios</p>
                    }

                </div>
            </>
        )
    )
}

export default SearchBook