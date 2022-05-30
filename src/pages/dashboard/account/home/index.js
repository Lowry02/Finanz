import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {Row, Col} from "react-bootstrap"
import routes from '../routes';
import "./style.css"
import { Accordion, AccordionDetails } from '@mui/material';
import { AccordionSummary } from '@material-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { default as internal_routes } from "./routes"
import CustomRouter from '../../../../components/custom_router';
import { Route, useParams } from 'react-router';

function AccountHome(props) {
    let navigate = useNavigate()
    let params = useParams()
    let section = params['*']
    let user = props.user
    let windowInfo = props.windowInfo
    const [openMobileMenu, setOpenMobileMenu] = useState(false)

    // sections name
    const INFO_SECTION = ""
    const PAYMENTS = "payments"
    const NEWS_SECTION = "news"
    const ACCADEMY_SECTION = "academy"
    const COURSE_SECTION = "course"
    const WEBINAR_SECTION = "webinar"
    const SCHOOL_SECTION = "school"
    const STATISTIC_SECTION = "statistiche"
    const TAG_FIELD = "tag"
    const QUESTION_SECTION = "question"

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
                            onClick={() => navigate(internal_routes.info.path)}>
                                Informazioni
                            </p>
                            <p 
                            className={section == PAYMENTS ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => navigate(internal_routes.payments.path)}>
                                Abbonamento
                            </p>
                            <p 
                            className={section == NEWS_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => navigate(internal_routes.news.path)}>
                                News
                            </p>
                            <p 
                            className={section == ACCADEMY_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => navigate(internal_routes.academy.path)}>
                                Academy
                            </p>
                            {
                                user && user.canI("create_course") ?
                                <p 
                                className={section == COURSE_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                onClick={() => navigate(internal_routes.course.path)}>
                                    Corsi
                                </p> :
                                ""
                            }
                            {
                                user && user.canI("create_webinar") ?
                                <p 
                                className={section == WEBINAR_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                onClick={() => navigate(internal_routes.webinar.path)}>
                                    Webinar
                                </p> :
                                ""
                            }
                            {
                                user && user.canI("create_school") ?
                                <p 
                                className={section == SCHOOL_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                onClick={() => navigate(internal_routes.school.path)}>
                                    Scuola
                                </p> :
                                ""
                            }
                            {
                                user && user.canI("manage_tag") ?
                                <p 
                                className={section == TAG_FIELD ? "menu_item bounce selected" : "menu_item bounce"}
                                onClick={() => navigate(internal_routes.tag.path)}>
                                    Tag & Field
                                </p> :
                                ""
                            }
                            {/* <p 
                            className={section == STATISTIC_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => navigate(internal_routes.stat.path)}>
                                Statistiche
                            </p> */}
                            <p 
                            className={section == QUESTION_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                            onClick={() => navigate(internal_routes.question.path)}>
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
                                    onClick={() => navigate(internal_routes.info.path)}>
                                        Informazioni
                                    </p>
                                    <p 
                                    className={section == PAYMENTS ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.payments.path)}>
                                        Payments
                                    </p>
                                    <p 
                                    className={section == NEWS_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.news.path)}>
                                        News
                                    </p>
                                    <p 
                                    className={section == ACCADEMY_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.academy.path)}>
                                        Academy
                                    </p>
                                    <p 
                                    className={section == COURSE_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.course.path)}>
                                        Corsi
                                    </p>
                                    <p 
                                    className={section == WEBINAR_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.webinar.path)}>
                                        Webinar
                                    </p>
                                    <p 
                                    className={section == SCHOOL_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.school.path)}>
                                        Scuola
                                    </p>
                                    <p 
                                    className={section == TAG_FIELD ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.tag.path)}>
                                        Tag & Field
                                    </p>
                                    {/* <p 
                                    className={section == STATISTIC_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.info.path)}>
                                        Statistiche
                                    </p> */}
                                    <p 
                                    className={section == QUESTION_SECTION ? "menu_item bounce selected" : "menu_item bounce"}
                                    onClick={() => navigate(internal_routes.question.path)}>
                                        Domande
                                    </p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    }
                    
                </div>
            </Col>
            <Col md="7" className="content">
                <CustomRouter>
                    {Object.values(internal_routes).map(route => (
                        <Route path={route.url} element={route.component({routes: routes, user: user, windowInfo: windowInfo})}/>
                    ))}
                </CustomRouter>
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