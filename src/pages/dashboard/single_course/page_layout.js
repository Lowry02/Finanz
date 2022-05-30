import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'

import CourseController from '../../../controllers/course_controller'
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Chip, Icon, Modal } from '@material-ui/core';

import { Col } from 'react-bootstrap';

import { Fade, Skeleton } from '@mui/material'
import "./style.css"
import ScrollContainer from '../../../components/scroll_container';
import { HashLink } from 'react-router-hash-link';
import routes from '../routes';
import Popup from "../../../components/popup"

// function PageLayout() {
//     let { courseId } = useParams()
//     let navigate = useNavigate()

//     const [content, setContent] = useState(new CourseController())

//     function openChapter(chapterId) {
//         navigate(chapterId, {state: {course : content.exportInfo()}})
//     }

//     useEffect(() => {
//         content.setState(setContent)
//         content.loadById(courseId, false)
//     }, [])

//     return (
//         <Fade in={true}>
//             <div id="single_course">
//                 <div className="wallpaper_container">
//                     <img className="wallpaper block" src={content.getWallpaper()} />
//                 </div>
//                 <br />
//                 <br />
//                 <Row>
//                     <Col md="7" id="left_col">
//                         <h1 className="title mb-4">{content.getTitle()}</h1>
//                         <h5 className="mt-3 mb-2 orange_line">Descrizione</h5>
//                         <p className="description">{content.getDescription()}</p>
//                         <h5 className="mt-3 mb-2 orange_line">Syllabus</h5>
//                         <p className="syllabus">{content.getSyllabus()}</p>
//                         <h5 className="mt-3 mb-3 orange_line">Capitoli</h5>
//                         <div className="indented">
//                             {
//                                 Object.keys(content.getContent()).map(
//                                     (chapterId, index) => 
//                                         <div
//                                         className="lesson_item block mt-2 mb-2 bounce"
//                                         onClick={() => openChapter(chapterId)}>
//                                             <div className="display_inline space_between max_width">
//                                                 <h6 className="m-0"><span className="chapter_number">{index + 1}</span>{content.getChapterTitle(chapterId)}</h6>    
//                                                 <ArrowForwardIosIcon className="orange_icon"/>
//                                             </div>
//                                         </div>
//                                 )
//                             }
//                         </div>

//                     </Col>
//                     <Col md="1"></Col>
//                     <Col md="4" className="block info">
//                         <h5 className="mb-3">Video di presentazione</h5>
//                         <video controls={true} className="video block">
//                             <source src={content.getPresentationVideo()} />
//                         </video>
//                         <div className="centered mt-2 mb-4">
//                             <Rating
//                             size="large"
//                             readOnly={true}
//                             name="simple-controlled"
//                             max={3}
//                             value={content.getStar()}/>
//                         </div>
//                         <TextField
//                         InputProps={{readOnly: true}}
//                         className="my_input"
//                         fullWidth={true}
//                         label="Argomento"
//                         value={content.getArgument()}/>
//                         <TextField
//                         InputProps={{readOnly: true}}
//                         className="my_input"
//                         margin="normal"
//                         fullWidth={true}
//                         label="Tempo"
//                         value={content.getTime()}/>
//                         <TextField
//                         InputProps={{readOnly: true}}
//                         className="my_input"
//                         margin="normal"
//                         fullWidth={true}
//                         label="Numero di video"
//                         value={content.getNVideo()}/>
//                         <TextField
//                         InputProps={{readOnly: true}}
//                         className="my_input"
//                         margin="normal"
//                         fullWidth={true}
//                         label="Numero di video"
//                         value={content.getAuthor()}/>
//                         <TextField
//                         InputProps={{readOnly: true}}
//                         className="my_input"
//                         margin="normal"
//                         fullWidth={true}
//                         label="Pubblicato il"
//                         value={content.getPublishDate()}/>
//                         <div className="buy block bounce mt-3">
//                             <h3 className="mb-0">Acquista</h3>
//                         </div>
//                     </Col>
//                 </Row>
//                 <br />
//             </div>
//         </Fade>
//     )
// }

function PageLayout(props) {
    let windowInfo = props.windowInfo
    let { courseId } = useParams()
    const [content, setContent] = useState(new CourseController())
    const [selectedSection, setSelectedSection] = useState(0)
    let navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(true)

    let sections = {
        0 : (props) => <Description {...props}/>,
        1 : (props) => <Video {...props}/>,
    }

    useEffect(async () => {
        content.setState(setContent)
        let allInfo = false // it doesn't load all lessons
        try {
            await content.loadById(courseId, allInfo)
            setLoading(false)
        } catch {
            // error page
            navigate(routes.single_webinar.path)
        }
    }, [])

    useEffect(() => {
        // updates dashboardContainerHeight field
        if(!loading) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [loading])
    

    return (
        loading ? 
        <Fade in={loading}>
            <div>
                <Skeleton height={"500px"}/>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        </Fade>:
        <Fade in={!loading}>
        <div id="single_course">
            <div className="wallpaper_container" style={{height: windowInfo['dashboardContainerHeight']}}>
                <div className="gradient"></div>
                <img className="wallpaper" src={content.getWallpaper()}/>
                <div className="info">
                    <Col md="12" className="mx-auto" >
                        <h2 className="title text-center">{content.getTitle()}</h2>
                    </Col>
                    <div className="separator"></div>
                    <p className="text-center">di <b className="author">{content.getOfferedBy().join(' - ')}</b></p>
                    <div className="display_inline actions_container">
                        {/* <div className="m-3">
                            <div className="action bounce">
                                <AddIcon />
                            </div>
                            <div className="text-center">
                                <h6>Aggiungi</h6>
                            </div>
                        </div> */}
                        {/* <div className="m-3">
                            <HashLink to={"#presentazion_video"}>
                                <div className="action bounce">
                                    <PlayArrowIcon/>
                                </div>
                            </HashLink>
                            <div className="text-center">
                                <h6>Trailer</h6>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <Col md="8" className="info_container mx-auto" style={{marginTop: windowInfo.dashboardContainerHeight}}>
                <div className="panel display_inline">
                    <p className={selectedSection == 0 ? "panel_item selected" : "panel_item"} onClick={() => setSelectedSection(0)}>Informazioni</p>
                    <p className={selectedSection == 1 ? "panel_item selected" : "panel_item"} onClick={() => setSelectedSection(1)}>Video</p>
                </div>
                {selectedSection != undefined ? sections[selectedSection]({ content : content }) : ""}
                {/* <hr/> */}
                {/* <Comments content={content} windowInfo={windowInfo}/> */}
                <br/>
            </Col>
        </div>
        </Fade>
    )
}

function Description(props) {
    let content = props.content

    return (
        <Col id="course_description" md="10" className="mx-auto">
            <div className="chip_container text-center">
                {/* <Chip className="item mb-3" label={content && content.getArgument()}/> */}
                {/* <Chip className="item mb-3" label={content && content.getNVideo() + " video"}/>
                <Chip className="item mb-3" label={content && content.getStar() + " stelle"}/>
                <Chip className="item mb-3" label={content && content.getTime()}/>
                <Chip className="item mb-3" label={content && "Di " + content.getAuthor()}/> */}
            </div>
            <h5>Descrizione</h5>
            <p className="thin">{content.getDescription()}</p>
            <a id="presentazion_video"></a>
            <h5>Video di presentazione</h5>
            <div dangerouslySetInnerHTML={{ __html: content.getPresentationVideo()}}></div>
        </Col>
    )
}

function Video(props) {
    let content = props.content
    let navigate = useNavigate()

    const [popupContent, setPopupContent] = useState({})
    const [currentSection, setCurrentSection] = useState(undefined)
    
    function openChapter(chapterId) {
        let chapterPosition = content.getChapter(chapterId)['position']
        if(chapterPosition != 1) {
            let [lastChapter] = Object.values(content.getContent()).filter(item => item['position'] == chapterPosition - 1)
            let notFinishedLessons = Object.values(lastChapter['lessons']).filter(item => !item['isFinished'])
            if(notFinishedLessons.length == 0) navigate(chapterId, {state: {course : content.exportInfo()}})
            else setPopupContent({ error: true, message: "Devi completare i capitoli precedenti"})
        } else {
            navigate(chapterId, {state: {course : content.exportInfo()}})
        }
    }

    return (
        <div id="course_video" md="8" className="mx-auto centered">
            {
                content && Object.keys(content.getContent()).map(
                    (chapterId, i) => <div className="chapter_item">
                        <div className={"block mb-3 text-center " + (Object.values(content.getLessonsByChapter(chapterId)).filter(item => !item['isFinished']).length == 0 ? "orange" : "")}>
                            <h5 className={"chapter"}>Capitolo {i + 1} - {content.getChapterTitle(chapterId)}</h5>
                            <p className={"thin "}>{Object.values(content.getLessonsByChapter(chapterId)).filter(item => item['isFinished']).length}/{Object.values(content.getLessonsByChapter(chapterId)).length} lezioni completate</p>

                            <PlayArrowIcon
                                onClick={() => openChapter(chapterId)}
                                className={"orange_icon"}/>
                            <KeyboardArrowDownIcon
                            className={i == currentSection ? "orange_icon arrow selected" : "orange_icon arrow"}
                            onClick={() => setCurrentSection(i == currentSection ? undefined : i)}/>
                        </div>
                        <Collapse in={i == currentSection}>
                            <div className="lessons m-2">
                                {
                                    Object.keys(content.getLessonsByChapter(chapterId)).map(
                                        (lessonId, i) => <Col md="8" className={"lesson_item block mb-3 mx-auto " + (content.getLesson(chapterId, lessonId)['isFinished'] ? "orange" : "")}>
                                            {
                                                content.getLesson(chapterId, lessonId)['isFree'] ? 
                                                <h5 className="text-right">FREE</h5> :
                                                ""
                                            }
                                            <h6>Lezione {i + 1} - {content.getLessonTitle(chapterId, lessonId)}</h6>
                                            <p className="thin">{content.getLessonDescription(chapterId, lessonId)}</p>
                                            <div className="centered">
                                                <PlayArrowIcon
                                                    onClick={() => navigate(chapterId + "/" + lessonId)}
                                                    className={"orange_icon"}/>
                                            </div>
                                        </Col> 
                                    )
                                }
                            </div>
                        </Collapse>
                    </div>
                )
            }
            {
                Object.keys(popupContent).length != 0 ?
                <Popup isError={popupContent['error']} message={popupContent['message']} removeFunction={() => setPopupContent({})}/>
                : ""
            }
        </div>
    )
}

function Comments(props) {
    let content = props.content
    let windowInfo = props.windowInfo

    return (
        <div id="comments">
            <h5 className="text-center">Commenti</h5>
            {
                !windowInfo.mobileMode ?
                    <ScrollContainer
                    direction="horizontal"
                    margin={15}>
                        {content && content.getComments().map(
                            (comment) => <div className="comment_item bounce">
                                            <h6 className="title">{comment['title']}</h6>
                                            <p className="content thin m-0">{comment['content']}</p>
                                        </div>
                        )}
                    </ScrollContainer> :
                    <div className="list">
                        {content && content.getComments().map(
                            (comment) => <div className="comment_item bounce">
                                            <h6 className="title">{comment['title']}</h6>
                                            <p className="content thin m-0">{comment['content']}</p>
                                        </div>
                        )}
                    </div>

            }
        </div>
    )
}

export default PageLayout
