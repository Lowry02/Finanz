import React, { useState, useEffect} from 'react'
import News from '../../../components/news_card'
import CourseCard from '../../../components/course_card'
import AccademyCard from '../../../components/accademy_card'
import { Fade } from '@mui/material'
import draghi from "../../../media/img/draghi.jpeg"
import ScrollContainer from '../../../components/scroll_container'

import { Row, Col } from "react-bootstrap"
import "./style.css"

function HomePage(props) {
    let user = props.user
    let windowInfo = props.windowInfo

    return (
        <Fade in={true}>
            <div id="dashboard_home" className="mt-3">
                <Row>
                    <Col md="2"></Col>
                    <Col md="4">
                        <LegaBlock user={user} />
                    </Col>
                    <Col md="4">
                        <NewWebinarBlock user={user} />
                    </Col>
                    <Col md="2"></Col>
                </Row>
            </div>
        </Fade>
        
    )
}

function LegaBlock(props) {
    let user = props.user

    return (
        <div id="lega_section" className="block linear_black">
            <div className="linear_black_content">
                <h6 className="key">LA TUA LEGA</h6>
                <h1 className="value">Diamante</h1>
                <h1 className="value mb-0">1432</h1>
                <h6 className="key">PUNTI</h6>
            </div>
            <div className="ball one"></div>
            <div className="ball two"></div>
            <div className="ball three"></div>
            <div className="ball four"></div>
            <div className="ball five"></div>
        </div>
    )
}

function NewWebinarBlock(props) {
    let user = props.user

    return (
        <div id="new_course_block" className="block orange_bkg bounce">
            <h2 className="title">Un Webinar in vista!</h2>
            <p className="mb-2">Questo mercoledì parleremo di Mario Draghi e le sue mosse finanziare, non puoi mancare!</p>
            <p>A cura di <b>Nome Professore</b></p>
            <div className="course_img_container block">
                <img src={draghi} className="course_img"/>
            </div>
        </div>
    )
}

function CoursesInProgress(props) {
    let windowInfo = props.windowInfo
    let user = props.user
    let courses = user && user.courses

    useEffect(() => {
        if(courses != undefined) {
            if(Object.values(courses.getCoursesInProgress()).length == 0)
                courses.loadCoursesInProgress(2)
        }
    }, [courses])
    
    return <div id="courses_block" className="block">
        <h3>Corsi iniziati</h3>
        <ScrollContainer
        direction="horizontal"
        margin={15}>
        {
            courses && Object.values(courses.getCoursesInProgress()).map((item) => {
                return <div style={{width: "80%"}}><CourseCard content={item} windowInfo={windowInfo}/></div>
            })
        }
        </ScrollContainer>
    </div>
}

function ModulesInProgress(props) {
    let windowInfo = props.windowInfo
    let user = props.user
    let modules = user && user.modules

    useEffect(() => {
        if(modules != undefined) {
            if(Object.values(modules.getModulesInProgress()).length == 0)
                modules.loadModulesInProgress(3)
        }
    }, [modules])

    return <div id="modules_block" className="block">
        <h3>Moduli iniziati</h3>
        <ScrollContainer
        direction="horizontal"
        margin={15}>
        {
            modules && Object.values(modules.getModulesInProgress()).map((item) => {
                return <div style={{width: 300}}><AccademyCard layout="squared" content={item} windowInfo={windowInfo}/></div>
            })
        }
        </ScrollContainer>
    </div>
}

export default HomePage
