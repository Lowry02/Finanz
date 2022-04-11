import React from 'react'
import {Col, Row} from 'react-bootstrap'

function DesignAccademyCard(props) {
    let content = props.content
    
    return (
        <div className="accademy_card design bounce">
            <Row>
                <Col xs="4" className="wallpaper_container">
                    <img src={content && content.getWallpaper()} className="img-fluid wallpaper"/>
                </Col>
                <Col xs="8" className="info_container">
                    <h5 className="title">{content && content.getTitle()}</h5>
                    <p className="difficulty mb-1">Difficoltà {content && content.getDifficultyLevel()}</p>
                    <p className="modules_number mb-1">{content && content.getNModules()} moduli</p>
                    <p className="time mb-1">{content && content.getTime()} minuti</p>
                </Col>
            </Row>
        </div>
    )
}

export default DesignAccademyCard