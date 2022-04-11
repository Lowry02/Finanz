import React from 'react'

function CompactSquaredNews(props) {
    let content = props.content
    let onClick = props.onClick

    return (
        <div onClick={onClick} className="news-card c_squared bounce block">
            <h6 className="title">{content.getTitle()}</h6>
            <div className="author">
                <p>Di {content.getAuthor()}</p>
            </div>
        </div>
    )
}

export default CompactSquaredNews
