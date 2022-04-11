import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from "react-router-dom"
import CourseController from '../../../controllers/course_controller'
import { Col } from 'react-bootstrap'
import { Collapse, Fade } from '@mui/material'
import MultipleChoiceQuestion from '../../../components/multiple_choice_question'
import QuizGroup from '../../../components/quiz_group'

function SingleLesson() {
    let { courseId, chapterId, lessonId } = useParams()
    let { state } = useLocation()

    const [content, setContent] = useState(new CourseController())
    const [quizOpen, setQuizOpen] = useState(false)

    useEffect(() => {
        content.setState(setContent)
        content.load(state.course, false)
        console.log(state.course)
    }, [])

    return (
        <Fade in={true}>
            <div id="single_lesson">
                <Col md="8" className="mx-auto">
                    <div className="text-center">
                        <h6 className="chapter m-0">Capitolo N - {content.getChapterTitle(chapterId)}</h6>
                        <div className="separator "></div>
                        <h1 className="title">{content.getLessonTitle(chapterId, lessonId)}</h1>
                        <p className="course_title m-0">{content.getTitle()}</p>
                        <div className="separator "></div>
                        <p className="description m-0">{content.getLessonDescription(chapterId, lessonId)}</p>
                    </div>
                    <Collapse in={!quizOpen}>
                        <video className="video block mt-4" controls={true}>
                            <source src={content.getLessonVideo(chapterId, lessonId)}></source>
                        </video>
                        <p className="text">{content.getLessonText(chapterId, lessonId)}</p>
                        <div
                        className="quiz_button centered bounce block text-center"
                        onClick={() => setQuizOpen(true)}>
                            <h2>Quiz</h2>
                            <p className="m-0">Mettiti alla prova</p>
                        </div>
                    </Collapse>
                    <Collapse in={quizOpen}>
                        <div className="separator"></div>
                        <p className="close_quiz bounce text-center" onClick={() => setQuizOpen(false)}>Chiudi quiz</p>
                        <div className="quiz_block block">
                            <h4 className="text-center">Quiz</h4>
                            <QuizGroup questions={content.getLessonQuiz(chapterId, lessonId)}/>
                        </div>
                        <br />
                    </Collapse>
                    <div className="navigation_buttons space_between mt-3">
                        <div className="navigation_item bounce">
                            <h6>Precedente</h6>
                        </div>
                        <div className="navigation_item bounce">
                            <h6>Successivo</h6>
                        </div>
                    </div>
                    <br />
                </Col>
            </div>
        </Fade>
    )
}

export default SingleLesson
