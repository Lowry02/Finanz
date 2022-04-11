import React from 'react'

function CompactAccademyCard(props) {
    let content = props.content

    return (
        <div className="accademy_card compact_accademy_card block bounce">
            <p className="title">{content.getTitle()}</p>
            <p className="m-0 author">Di {content.getAuthor()}</p>
        </div>
    )
}

export default CompactAccademyCard
