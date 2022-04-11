import React from 'react'

import { Row, Col } from "react-bootstrap"

function LargeNews(props) {
    let content = props.content
    let onClick = props.onClick
    let windowInfo = props.windowInfo

    return (
        <div className="large">
            <Row>
                <Col md="6" className="info order-1">
                    <div className="info_container">
                        <h1>{content.getTitle()}</h1>
                        <p>{content.getDescription()}</p>
                        <div className="read_button bounce">
                            <h6 onClick={onClick}>Leggi di più</h6>
                        </div>
                    </div>
                </Col>
                <Col md="6" className="order-md-2">
                    <img src={content.getWallpaper()} className="img-fluid wallpaper"/>
                </Col>
            </Row>
        </div>
    )
}

export default LargeNews
