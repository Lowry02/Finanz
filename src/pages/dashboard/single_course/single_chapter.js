import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router'
import CourseController from '../../../controllers/course_controller'
import {Col} from "react-bootstrap"
import { Fade, Skeleton } from '@mui/material'
import ScrollContainer from '../../../components/scroll_container'
import routes from '../routes'
import Popup from '../../../components/popup'

function SingleChapter(props) {
    let windowInfo = props.windowInfo

    let { courseId, chapterId } = useParams()
    let { state } = useLocation()
    let navigate = useNavigate()

    const [content, setContent] = useState(new CourseController())
    const [loading, setLoading] = useState(true)
    const [popupContent, setPopupContent] = useState({})

    function openLesson(lessonId) {
        // check if user can open the lesson
        let lessonPosition = content.getLessonPosition(chapterId, lessonId)
        let canOpen = Object.values(content.getLessonsByChapter(chapterId)).filter(item => (item['position'] == lessonPosition - 1) && (!item['isFinished']))

        if(canOpen.length != 0 && lessonPosition != 1) {
            // error message
            setPopupContent({ error: true, message: "Devi completare le lezioni precedenti"})
        } else {
            // open lesson
            navigate(lessonId, { state : { course : content.exportInfo() }})
        }
    }

    useEffect(async () => {
        content.setState(setContent)
        
        if(state?.course != undefined) content.load(state.course, false)
        else {
            await content.loadById(courseId, false)
        } 
        
        if(content.getChapter(chapterId) == undefined) navigate(routes.single_course.path)
        setLoading(false)
    }, [])

    return (
        <>
        {
            loading ?
            <Fade in={loading}>
                <div>
                    <Skeleton variant="rectangular" height="200px"/>
                    <br/>
                    <Skeleton variant="rectangular" height="200px"/>
                </div>
            </Fade> :
            <Fade in={true}>
                <div id="single_chapter">
                    <div className="text-center">
                        <h6 className="chapter m-0">Capitolo {content.getChapter(chapterId)?.position} - {content.getChapterTitle(chapterId)}</h6>
                        <div className="separator"></div>
                        <h1 className="title">{content.getChapterTitle(chapterId)}</h1>
                        <p className="course_title m-0">{content.getTitle()}</p>
                    </div>
                    <br/>
                    <ScrollContainer
                    isMobile={windowInfo.mobileMode}
                    direction="horizontal"
                    margin={20}>
                        {
                            Object.values(content.getLessonsByChapter(chapterId))
                            .sort((a,b) => a['position'] > b['position'] ? 1 : -1)
                            .map(lesson => lesson['id'])
                            .map(
                                (lessonId) =>
                                <Col
                                xs="10"
                                md="6"
                                className={ "block lesson_item bounce " + (content.getLesson(chapterId, lessonId)['isFinished'] ? "finished" : "") }
                                onClick={() => openLesson(lessonId)}>
                                    {content.getLessonVideoId(chapterId, lessonId)}
                                    {/* <div className="block p-0" style={{ overflow: "hidden"}}>
                                        <img className="img-fluid" src={content.getLesson(chapterId, lessonId)['thumbnail']} />
                                    </div> */}
                                    {/* <video className="video block">
                                        <source src={content.getLessonVideo(chapterId, lessonId)}/>
                                    </video> */}
                                    <h2 className="lesson_title">{content.getLessonTitle(chapterId, lessonId)}</h2>
                                    <p className="lesson_description">{content.getLessonDescription(chapterId, lessonId)}</p>
                                </Col>
                            )
                        }
                    </ScrollContainer>
                </div>
            </Fade>
        }
        {
            Object.values(popupContent).length != 0 ?
                <Popup isError={popupContent['error']} message={popupContent['message']} removePopup={() => setPopupContent({})}/> :
                ""
        }
        </>
    )
}

export default SingleChapter
