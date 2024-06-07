import React, { useEffect, useState } from 'react'
import Axios from 'axios'

import Header from '../Header/Header'

function Search( ) {
    const [Users, setUsers] = useState(null)
    const [InputSearch, setInputSearch] = useState('')

    function USERsearch(){
        // const link = `http://localhost/bookloop/Search/GetUsers.php`
        // Axios.get(link, genreId)
        // .then(response => {
        //     const Users = response.data
        //     if (Object.keys(Users).length >=1){
        //         setUsers(response.data)
        //     }
        //     else { return setUsers(404)}
        // })
        // .catch(error => {
        //     console.error('Erro ao buscar generos:', error)
        //     return setUsers(404)
        // })
    }

    return (
        <div>

        </div>
    )
}

export default Search;
