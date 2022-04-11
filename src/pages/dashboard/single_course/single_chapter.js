import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router'
import CourseController from '../../../controllers/course_controller'
import {Col} from "react-bootstrap"
import { Fade } from '@mui/material'

function SingleChapter() {
    let { courseId, chapterId } = useParams()
    let { state } = useLocation()
    let navigate = useNavigate()

    const [content, setContent] = useState(new CourseController())

    function openLesson(lessonId) {
        navigate(lessonId, { state : { course : content.exportInfo() }})
    }

    useEffect(() => {
        console.log(state.course)
        content.setState(setContent)
        content.load(state.course, false)
    }, [])

    return (
        <Fade in={true}>
            <div id="single_chapter">
                <div className="text-center">
                    <h6 className="chapter m-0">Capitolo N - {content.getChapterTitle(chapterId)}</h6>
                    <div className="separator"></div>
                    <h1 className="title">{content.getChapterTitle(chapterId)}</h1>
                    <p className="course_title m-0">{content.getTitle()}</p>
                </div>
                <div className="lessons_container display_inline">
                    {
                        Object.keys(content.getLessonsByChapter(chapterId)).map(
                            (lessonId) =>
                            <Col
                            xs="10"
                            md="6"
                            className="block lesson_item bounce"
                            onClick={() => openLesson(lessonId)}>
                                <video className="video block">
                                    <source src={content.getLessonVideo(chapterId, lessonId)}/>
                                </video>
                                <h2 className="lesson_title">{content.getLessonTitle(chapterId, lessonId)}</h2>
                                <p className="lesson_description">{content.getLessonDescription(chapterId, lessonId)}</p>
                            </Col>
                        )
                    }
                </div>
            </div>
        </Fade>
    )
}

export default SingleChapter
