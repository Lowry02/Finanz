import React from 'react'

function SquaredNews(props) {
    let content = props.content
    let onClick = props.onClick

    return (
        <div onClick={onClick} className="news-card squared bounce">
            <img src={content.getWallpaper()} />
            <div className="gradient_effect"></div>
            <div className="info">
                <h4 className="title">{content.getTitle()}</h4>
                <div className="space_between">
                    <p>Di {content.getAuthor()}</p>
                    <p>{content.getPublishDate()}</p>
                </div>
            </div>
        </div>
    )
}

export default SquaredNews
