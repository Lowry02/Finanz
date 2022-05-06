import { ConstructionOutlined } from '@mui/icons-material'
import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import ModuleController from '../../../controllers/module_controller'
import {Stepper, Step, StepLabel, Fade, StepContent } from "@mui/material"
import { Col } from 'react-bootstrap'
import QuestionController from '../../../controllers/question_controller'
import QuizGroup from '../../../components/quiz_group'
import RichTextEditor from 'react-rte'
import MultipleChoiceQuestion from '../../../components/multiple_choice_question'


function Lesson(props) {
    let windowInfo = props.windowInfo

    let { pathname, state } = useLocation()
    let navigate = useNavigate()

    const lessonId = useRef(useParams()['lessonId'])
    const [content, setContent] = useState(new ModuleController())
    const [activePage, setActivePage] = useState(0)
    const [activePageId, setActivePageId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [nextPageLabel, setNextPageLabel] = useState("Successivo")
    const [previousPageLabel, setPreviousPageLabel] = useState("Precedente")

    useEffect(() => {
        let lessons = content.getAllPages(lessonId.current)
        
        // checking if all quiz have been done
        for(let lesson of Object.values(lessons).sort((a,b) => a['position'] > b['position'] ? 1 : -1)) {
            let position = lesson['position'] - 1
            console.log(position, activePage ,lesson['type'] == "quiz", lesson)
            if((position <= activePage) && (lesson['type'] == "quiz")) {
                let quiz = lesson['content']['question']
                if(quiz instanceof QuestionController && (quiz && quiz.getSelectedChoices().length == 0)) {
                    setActivePage(position)
                    return
                }
            }
        }

        // managin page overflow
        if(activePage < 0) {
            setActivePage(0)
        } else if(activePage == 0 && content.getModuleById(lessonId.current)?.position == 1) {
            setPreviousPageLabel("")
        } else if(activePage == 0){
            setPreviousPageLabel("Capitolo precedente")
        } else {
            setPreviousPageLabel("Precedente")
        }

        if(activePage > Object.keys(lessons).length) {
            setActivePage(Object.keys(lessons).length - 1)
        } else if(activePage == (Object.keys(lessons).length - 1) && content.getModuleById(lessonId.current)?.position == Object.keys(content.getModules()).length) {
            setNextPageLabel("Fine")
        } else if(activePage == (Object.keys(lessons).length - 1)){
            setNextPageLabel("Prossimo capitolo")
        } else {
            setNextPageLabel("Successivo")
        }
        
        // managing chapter change
        if(!loading && activePage == Object.keys(lessons).length) {
            // TODO: check finisched quiz
            // load new chapter
            let chapters = content.getModules()
            let position = content.getModuleById(lessonId.current)['position']
            let [nextChapter] = Object.values(chapters).filter(item => item['position'] == position + 1)
            content.setChapterFinished(lessonId.current)
            if(nextChapter != undefined) {
                pathname = pathname.substring(0, pathname.lastIndexOf("/")) + "/" + nextChapter['id']
                lessonId.current = nextChapter['id']
                navigate(pathname, { state : { module: content.exportInfo() }})
            } else {
                // chapters finished
                pathname = pathname.substring(0, pathname.lastIndexOf("/")) 
                navigate(pathname, { state : { module: content.exportInfo() }})
            }
        } else if(!loading && activePage == -1) {
            let chapters = content.getModules()
            let position = content.getModuleById(lessonId.current)['position']
            let [nextChapter] = Object.values(chapters).filter(item => item['position'] == position - 1)
            if(nextChapter != undefined) {
                // TODO: set finished
                pathname = pathname.substring(0, pathname.lastIndexOf("/")) + "/" + nextChapter['id']
                lessonId.current = nextChapter['id']
                navigate(pathname, { state : { module: content.exportInfo() }})
            } else {
                // first chapter just loaded
            }
        }
    }, [activePage])
    
    useEffect(async () => {
        // not first load
        if(!loading) {
            lessonId.current = pathname.substring(pathname.lastIndexOf("/") + 1)
            setActivePage(0)
            setLoading(true)
            let updateMode = true
            if(Object.keys(content.getAllPages(lessonId.current)) == 0) {
                await content.loadNote(lessonId.current, updateMode)
            }
            setLoading(false)
        }
    }, [pathname])
    
    useEffect(async() => {
        content.setState(setContent)
        content.load(state.module, false)
        let updateMode = true
        await content.loadNote(lessonId.current, updateMode)
        setLoading(false)
    }, [])

    return (
        <Fade in={true}>
            <div id="module_pages">
                <div className="header text-center centered">
                    <h6 className="title">{content.getTitle()}</h6>
                    <div className="separator"></div>
                    <h2>{content.getModuleTitle(lessonId.current)}</h2>
                    <div className="separator"></div>
                    <br/>
                </div>
                <Stepper
                activeStep={activePage}
                alternativeLabel={!(window && windowInfo.mobileMode)}
                orientation={windowInfo && windowInfo.mobileMode ? "vertical" :"horizontal"}>
                    {
                        Object.values(content.getAllPages(lessonId.current))
                        .sort((a,b) => a['position'] > b['position'] ? 1 : -1)
                        .map(a => a.id)
                        .map((pageId, index) => {
                                if(activePage == index && activePageId != pageId) setActivePageId(pageId) 
                                return  <Step key={index} className="step" onClick={() => setActivePage(index)}>
                                            <Fade in={true} style={{ transitionDuration: "1000ms"}}><StepLabel>{"Lezione " + (index + 1)}</StepLabel></Fade>
                                            {
                                                windowInfo && windowInfo.mobileMode ?
                                                <StepContent>
                                                    {
                                                        content.getPageType(lessonId.current, pageId) == 'quiz'  ?
                                                        <div className="mt-3">
                                                        <MultipleChoiceQuestion question={content.getPageContent(lessonId.current, pageId).question} />
                                                        </div> :
                                                        <div
                                                        dangerouslySetInnerHTML={{ __html: RichTextEditor.createValueFromString(content.getPageContent(lessonId.current, activePageId), 'markdown').toString("html")}}
                                                        className="markdown_content"/>
                                                    }
                                                    <Col md="11" className="mx-auto">
                                                        <div className="display_inline space_between">
                                                            <button
                                                            className="navigation_button button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActivePage(activePage - 1)

                                                            }}>{previousPageLabel}</button>
                                                            <button
                                                            className="navigation_button button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActivePage(activePage + 1)
                                                            }}>{nextPageLabel}</button>
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
                    !(windowInfo && windowInfo.mobileMode) ?
                        <div className="content_container">
                            <Col md="8" className="mx-auto mt-5">
                                {
                                    content.getPageType(lessonId.current, activePageId) == 'quiz' ?
                                    <MultipleChoiceQuestion question={content.getPageContent(lessonId.current, activePageId).question} /> :
                                    <div
                                    dangerouslySetInnerHTML={{ __html: RichTextEditor.createValueFromString(content.getPageContent(lessonId.current, activePageId), 'markdown').toString("html")}}
                                    className="markdown_content"/>
                                }
                            </Col>
                            <Col md="11" className="mx-auto">
                                <div className="display_inline space_between">
                                    <button
                                    className="navigation_button button"
                                    onClick={() => setActivePage(activePage - 1)}>{previousPageLabel}</button>
                                    <button
                                    className="navigation_button button"
                                    onClick={() => setActivePage(activePage + 1)}>{nextPageLabel}</button>
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
