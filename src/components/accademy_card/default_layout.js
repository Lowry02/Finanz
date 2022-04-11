import React from 'react'

import { Row, Col } from "react-bootstrap"
import arrowLeft from "../../media/icons/arrow_left.png"

function DefaultAccademyCard(props) {
    let content = props.content
    let windowInfo = props.windowInfo

    return (
        <div className="accademy_card bounce">
            <Row>
                <Col xs="3" id="wallpaper_container">
                    <img src={content.getWallpaper()} className="img-fluid wallpaper"/>
                </Col>
                <Col>
                    <h6 className="title">{content.getTitle()}</h6>
                    <p className="description">{content.getDescription()}</p>
                    <Row>
                        <Col>
                            <div className="orange_rect">
                                <h6>{content.getNModules()} Moduli</h6>
                            </div>
                        </Col>
                        <Col>
                            <div className="orange_rect">
                                <h6>{content.getTime()} minuti</h6>
                            </div>
                        </Col>
                        <Col>
                            <div className="orange_rect">
                                <h6>Difficoltà {content.getDifficultyLevel()}</h6>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md="1" id="arrow_container" className={windowInfo && windowInfo.mobileMode ? "mt-3" : ""}>
                    <img src={arrowLeft}/>
                </Col>
                
            </Row>
        </div>
    )
}

export default DefaultAccademyCard
