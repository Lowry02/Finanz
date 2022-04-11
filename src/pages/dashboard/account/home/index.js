import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import InfoSection from './sections/info_section';
import NewsSection from './sections/news_section';
import AccademySection from './sections/accademy_section';
import CoursesSection from './sections/courses_section';
import WebinarSection from './sections/webinar_section';
import QuestionSection from './sections/question_section';

import {Row, Col} from "react-bootstrap"
import routes from '../routes';
import "./style.css"
import { Accordion, AccordionDetails } from '@mui/material';
import { AccordionSummary } from '@material-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function AccountHome(props) {
    let navigate = useNavigate()
    let user = props.user
    let windowInfo = props.windowInfo
    const [openMobileMenu, setOpenMobileMenu] = useState(false)

    // sections name
    const INFO_SECTION = "info"
    const NEWS_SECTION = "news"
    const ACCADEMY_SECTION = "accademy"
    const COURSE_SECTION = "corsi"
    const WEBINAR_SECTION = "webinar"
    const STATISTIC_SECTION = "statistiche"
    const QUESTION_SECTION = "domande"

    // sections component
    const sectionComponent = {
        [INFO_SECTION] : () => <InfoSection {...props} />,
        [NEWS_SECTION] : () => <NewsSection {...props} />,
        [ACCADEMY_SECTION] : () => <AccademySection {...props} />,
        [COURSE_SECTION] : () => <CoursesSection {...props} />,
        [WEBINAR_SECTION] : () => <WebinarSection {...props} />,
        [STATISTIC_SECTION] : () => <StatisticSection {...props} />,
        [QUESTION_SECTION] : () => <QuestionSection {...props} />,
    }

    const [section, setSection] = useState(INFO_SECTION)

    return <div className="account_page">
        {
            !windowInfo.mobileMode ?
            <>
                <br/>
                <br/>
            </> :
            ""
        }
        <Row>
            <Col md="3">
                <div className="sidebar">
                    {
                        !windowInfo.mobileMode ?
                        <>
                            <h3>Menu</h3>
                            <p 
                            className={section == INFO_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(INFO_SECTION)}>
                                Informazioni
                            </p>
                            <p 
                            className={section == NEWS_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(NEWS_SECTION)}>
                                News
                            </p>
                            <p 
                            className={section == ACCADEMY_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(ACCADEMY_SECTION)}>
                                Academy
                            </p>
                            <p 
                            className={section == COURSE_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(COURSE_SECTION)}>
                                Corsi
                            </p>
                            <p 
                            className={section == WEBINAR_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(WEBINAR_SECTION)}>
                                Webinar
                            </p>
                            <p 
                            className={section == STATISTIC_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(STATISTIC_SECTION)}>
                                Statistiche
                            </p>
                            <p 
                            className={section == QUESTION_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => setSection(QUESTION_SECTION)}>
                                Domande
                            </p>
                        </> : 
                        <Accordion
                        expanded={openMobileMenu}
                        className="mobile_menu">
                            <AccordionSummary
                            onClick={() => setOpenMobileMenu(!openMobileMenu)}
                            expandIcon={<KeyboardArrowDownIcon className="orange_icon" />}>
                                <h3 className="m-0">Menu</h3>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div onClick={() => setOpenMobileMenu(false)}>
                                    <p 
                                    className={section == INFO_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(INFO_SECTION)}>
                                        Informazioni
                                    </p>
                                    <p 
                                    className={section == NEWS_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(NEWS_SECTION)}>
                                        News
                                    </p>
                                    <p 
                                    className={section == ACCADEMY_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(ACCADEMY_SECTION)}>
                                        Academy
                                    </p>
                                    <p 
                                    className={section == COURSE_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(COURSE_SECTION)}>
                                        Corsi
                                    </p>
                                    <p 
                                    className={section == WEBINAR_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(WEBINAR_SECTION)}>
                                        Webinar
                                    </p>
                                    <p 
                                    className={section == STATISTIC_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(STATISTIC_SECTION)}>
                                        Statistiche
                                    </p>
                                    <p 
                                    className={section == QUESTION_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => setSection(QUESTION_SECTION)}>
                                        Domande
                                    </p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    }
                    
                </div>
            </Col>
            <Col md="7" className="content">
                {
                    sectionComponent[section]({user : user, routes : routes})
                }
            </Col>
        </Row>
        <br/>
    </div>
}

function StatisticSection(props) {
    return <div id="info_section">
        STATISTIC_SECTION
    </div>
}



export default AccountHome