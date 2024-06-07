import React from 'react'
import './UserFeedback.css'

function UserFeedback({ feedback }) {
    return (
        <div className='C-UF-container-all'>
            {feedback.map((item, i) =>{
                return(
                    <div className='C-UF-container' key={i}>
                        <div className='C-UF-counter'>
                            {item.count}
                        </div>

                        <div className='C-UF-name'>
                            {item.name}
                        </div>
                    </div>
                )
            })}
        </div>

    )
}

export default UserFeedback
