import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from "react-router-dom"
import CourseController from '../../../controllers/course_controller'
import { Col } from 'react-bootstrap'
import { Collapse, Fade, Skeleton } from '@mui/material'
import QuizGroup from '../../../components/quiz_group'
import { useNavigate } from 'react-router'
import routes from '../routes'


function SingleLesson(props) {
    let { courseId, chapterId, lessonId } = useParams()
    let { state } = useLocation()
    let navigate = useNavigate()

    const [content, setContent] = useState(new CourseController())
    const [quizOpen, setQuizOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    async function changeLesson(forward) {
        // checking that every single quiz has been answered
        let quiz = content.getLessonQuiz(chapterId, lessonId)

        if(Object.keys(quiz).length != 0 && forward) {
            for(let quizItem of Object.values(quiz)) {
                if(quizItem.question.getSelectedChoices().length == 0) {
                    setQuizOpen(true)
                    return
                }
            }
        }

        // changing lesson
        let nextLesson
        let currentPosition = content.getLessonPosition(chapterId, lessonId)
        let lessons = content.getLessonsByChapter(chapterId)

        if(forward) {
            // next lesson
            nextLesson = Object.values(lessons).filter(lesson => lesson['position'] == currentPosition + 1)
        } else {
            // previous lesson
            nextLesson = Object.values(lessons).filter(lesson => lesson['position'] == currentPosition - 1)
        }
        
        // set lesson as read
        if(forward) await content.setReadLesson(chapterId, lessonId)
        
        if(nextLesson.length != 0) {
            // change lesson
            nextLesson = nextLesson[0]
            let nextLessonId = nextLesson['id']
            navigate("../" + courseId + "/" + chapterId + "/" + nextLessonId, { state : { course : content.exportInfo() }})
            setQuizOpen(false)
        } else {
            // change chapter
            let chapters = content.getContent()
            let currentPosition = content.getChapter(chapterId)['position']
            let nextChapter

            if(forward) {
                // load next chapter
                nextChapter = Object.values(chapters).filter(chapter => chapter.position == currentPosition + 1)
            } else {
                // load previous chapter
                nextChapter = Object.values(chapters).filter(chapter => chapter.position == currentPosition - 1)
            }

            if(nextChapter.length != 0) {
                // changing chapter
                nextChapter = nextChapter[0]
                let nextChapterId = nextChapter['id']
                navigate("../" + courseId + "/" + nextChapterId, { state : { course : content.exportInfo() }})
                setQuizOpen(false)
            } else if(forward) {
                // course finished
                alert("finito!")
            }
        }
    }

    useEffect(async () => {
        content.setState(setContent)

        if(state?.course != undefined) content.load(state.course, false)
        else await content.loadById(courseId, false)

        // checking if user can access(he has to complete all previous lessons)
        let lessonPosition = content.getLessonPosition(chapterId, lessonId)
        let canOpen = Object.values(content.getLessonsByChapter(chapterId)).filter(item => (item['position'] == lessonPosition - 1) && (!item['isFinished']))
        
        
        if(canOpen.length != 0 && lessonPosition != 1) {
            // redirect
            navigate(routes.single_course.path + courseId + "/" + chapterId)
        }

        if(content.getLessonVideo(chapterId, lessonId) == undefined) {
            await content.loadLessonFromServer(chapterId, lessonId)
        }

        if(content.getLesson(chapterId, lessonId) == undefined) navigate(routes.single_course.path)

        setLoading(false)
    }, [lessonId])

    return (
        <Fade in={true}>
            <div id="single_lesson">
                <Col md="8" className="mx-auto">
                    <div className="text-center">
                        <h6 className="chapter m-0">Capitolo {content && content.getChapter(chapterId)?.position} - {content.getChapterTitle(chapterId)}</h6>
                        <div className="separator "></div>
                        <h1 className="title">{content.getLessonTitle(chapterId, lessonId)}</h1>
                        <p className="course_title m-0">{content.getTitle()}</p>
                        <div className="separator "></div>
                        <p className="description m-0">{content.getLessonDescription(chapterId, lessonId)}</p>
                    </div>
                    {
                        loading ?
                            <div>
                                <br/>
                                <Skeleton variant={"rectangular"} height={"200px"} />
                                <br/>
                                <Skeleton variant={"rectangular"} height={"200px"} />
                            </div> : 
                            <Fade in={!loading}>
                                <div>
                                    <Collapse in={!quizOpen}>
                                        <br/>
                                        <div className="block" dangerouslySetInnerHTML={{ __html: content.getLessonVideo(chapterId, lessonId)}}></div>
                                        <p className="text">{content.getLessonText(chapterId, lessonId)}</p>
                                        {
                                            content && Object.keys(content.getLessonQuiz(chapterId, lessonId)).length == 0 ?
                                            "" : 
                                            <div
                                            className="quiz_button centered bounce block text-center"
                                            onClick={() => setQuizOpen(true)}>
                                                <h2>Quiz</h2>
                                                <p className="m-0">Mettiti alla prova</p>
                                            </div>
                                        }
                                    </Collapse>
                                    {
                                        content && Object.keys(content.getLessonQuiz(chapterId, lessonId)).length == 0 ?
                                        "" : 
                                        <Collapse in={quizOpen}>
                                            <div className="separator"></div>
                                            <p className="close_quiz bounce text-center" onClick={() => setQuizOpen(false)}>Chiudi quiz</p>
                                            <div className="quiz_block block">
                                                <h4 className="text-center">Quiz</h4>
                                                <QuizGroup questions={content.getLessonQuiz(chapterId, lessonId)}/>
                                            </div>
                                            <br />
                                        </Collapse>
                                    }
                                    <div className="navigation_buttons space_between mt-3">
                                        <div className="navigation_item bounce" onClick={() => changeLesson(false)}>
                                            {
                                                content && content.getChapter(chapterId)?.position == 1 && content.getLessonPosition(chapterId, lessonId) == 1 ?
                                                    "" :
                                                content && content.getChapter(chapterId)?.position != 1 && content.getLessonPosition(chapterId, lessonId) == 1 ?
                                                    <h6>Capitolo precedente</h6> :
                                                content && content.getLessonPosition(chapterId, lessonId) != 1 ?
                                                    <h6>Precedente</h6> :
                                                    ""
                                            }
                                        </div>
                                        <div className="navigation_item bounce" onClick={() => changeLesson(true)}>
                                            {
                                                content &&
                                                content.getChapter(chapterId)?.position == Math.max(...Object.values(content.getContent()).map(item => item.position)) &&
                                                content.getLessonPosition(chapterId, lessonId) == Math.max(...Object.values(content.getLessonsByChapter(chapterId)).map(lesson => lesson['position'])) ? 
                                                <h6>Fine</h6> :
                                                content && 
                                                content.getLessonPosition(chapterId, lessonId) == Math.max(...Object.values(content.getLessonsByChapter(chapterId)).map(lesson => lesson['position'])) ?
                                                <h6>Prossimo capitolo</h6> :
                                                <h6>Successivo</h6>
                                            }
                                            {}
                                        </div>
                                    </div>
                                </div>
                            </Fade>
                    }
                    <br />
                </Col>
            </div>
        </Fade>
    )
}

export default SingleLesson
