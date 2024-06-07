import React from 'react'
import './ScoreInsStar.css'

function ScoreInStar({ score }) {
    const starPercentage = (score / 5) * 100

    return (
        <div className="C-SIS-star-rating">
            <div className="C-SIS-star-rating-top" style={{ width: `${starPercentage}%` }}>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
            </div>
            <div className="C-SIS-star-rating-bottom">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
            </div>
        </div>
    )
}

export default ScoreInStar
