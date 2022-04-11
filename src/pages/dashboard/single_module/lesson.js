import { ConstructionOutlined } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import ModuleController from '../../../controllers/module_controller'
import {Stepper, Step, StepLabel, Fade, StepContent } from "@mui/material"
import { Col } from 'react-bootstrap'
import QuestionController from '../../../controllers/question_controller'
import QuizGroup from '../../../components/quiz_group'


function Lesson(props) {
    let windowInfo = props.windowInfo

    let { moduleId, lessonId } = useParams()
    let { state } = useLocation()

    const [content, setContent] = useState(new ModuleController())
    const [activePage, setActivePage] = useState(2)
    const [activePageId, setActivePageId] = useState(null)

    useEffect(() => {
        content.setState(setContent)
        content.load(state.module, false)
    }, [])

    return (
        <Fade in={true}>
            <div id="module_pages">
                <div className="header text-center centered">
                    <h6 className="title">{content.getTitle()}</h6>
                    <div className="separator"></div>
                    <h2>{content.getModuleTitle(lessonId)}</h2>
                    <div className="separator"></div>
                    <br/>
                </div>
                <Stepper
                activeStep={activePage}
                alternativeLabel={!(window && windowInfo.mobileMode)}
                orientation={windowInfo && windowInfo.mobileMode ? "vertical" :"horizontal"}>
                    {
                        Object.keys(content.getAllPages(lessonId)).map(
                            (pageId, index) => {
                                if(activePage == index && activePageId != pageId) setActivePageId(pageId) 
                                return  <Step key={index} className="step" onClick={() => setActivePage(index)}>
                                            <StepLabel>{content.getPageTitle(lessonId, pageId)}</StepLabel>
                                            {
                                                windowInfo && windowInfo.mobileMode ?
                                                <StepContent>
                                                    {
                                                        content.getPageType(lessonId, pageId) == 'quiz'  ?
                                                        <div className="mt-3">
                                                        <QuizGroup questions={{1 : content.getPageContent(lessonId, pageId)}} />
                                                        </div> :
                                                        <p style={{fontWeight: 100, lineHeight: "30px"}}>
                                                            {content.getPageContent(lessonId, pageId)}
                                                        </p>
                                                    }
                                                    <Col md="11" className="mx-auto">
                                                        <div className="display_inline space_between">
                                                            <button
                                                            className="navigation_button button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActivePage(activePage - 1)

                                                            }}>Precedente</button>
                                                            <button
                                                            className="navigation_button button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActivePage(activePage + 1)
                                                            }}>Successivo</button>
                                                        </div>
                                                    </Col>
                                                </StepContent> : 
                                                ""
                                            }
                                        </Step>
                            }
                                
                        )
                    }
                </Stepper>
                {
                    !(window && windowInfo.mobileMode) ?
                        <div className="content_container">
                            <Col md="8" className="mx-auto mt-5">
                                {
                                    content.getPageType(lessonId, activePageId) == 'quiz' ?
                                    <QuizGroup questions={{1 : content.getPageContent(lessonId, activePageId)}} /> :
                                    <p style={{fontWeight: 100, lineHeight: "30px"}}>{content.getPageContent(lessonId, activePageId)}</p>
                                }
                            </Col>
                            <Col md="11" className="mx-auto">
                                <div className="display_inline space_between">
                                    <button
                                    className="navigation_button button"
                                    onClick={() => setActivePage(activePage - 1)}>Precedente</button>
                                    <button
                                    className="navigation_button button"
                                    onClick={() => setActivePage(activePage + 1)}>Successivo</button>
                                </div>
                            </Col>
                        </div> : 
                        <br/>
                }
            </div>
        </Fade>
    )
}

export default Lesson
