import React from 'react'

function CompactRectangularNews(props) {
    let content = props.content
    let onClick = props.onClick
    let selected = props.selected
    
    return (
        <div onClick={onClick} className={"news-card c_rectangular bounce " + (selected ? "selected" : "")}>
            <p className="title">{content.getTitle()}</p>
            <div className="justify-content-between">
                <p>Di {content.getAuthor()}</p>
                <p>Pubblicato {content.getPublishDate()}</p>
            </div>
        </div>
    )
}

export default CompactRectangularNews
