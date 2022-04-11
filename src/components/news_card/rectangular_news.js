import React from 'react'

import { Row, Col } from "react-bootstrap"

function RectangularNews(props) {
    let content = props.content
    let onClick = props.onClick
    let windowInfo = props.windowInfo
    let selected = props.selected

    return (
        <div onClick={onClick} className={"news-card rectangular bounce " + (selected ? "selected" : "") }>
            <Row>
                <Col xs="4">
                    <div className="image">
                        <img src={content.getWallpaper()}/>
                    </div>
                </Col>
                <Col xs="8">
                    <h6 className="title">{content.getTitle()}</h6>
                    <p className="author">Di {content.getAuthor()}</p>
                </Col>
            </Row>
        </div>
    )
}

export default RectangularNews
