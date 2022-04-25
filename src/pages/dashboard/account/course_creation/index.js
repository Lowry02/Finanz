import React, {useState, useEffect} from 'react'
import {Row, Col} from "react-bootstrap"
import MultipleChoicesQuestion from "../../../../components/multiple_choice_question"
import imagePicker from "../../../../media/icons/image_picker.png"
import CourseCreationController from '../../../../controllers/course_creation_controller'
import QuestionCreator from '../../../../components/question_creator'

import x_icon from "../../../../media/icons/x.png"
import video_icon from "../../../../media/icons/video_camera.png"
import MarkupEditor from "../../../../components/markup_editor"
import arrowIcon from '../../../../media/icons/arrow_bottom_orange.png'
import trashIcon from "../../../../media/icons/trash.png"
import { TextField, Card, CardContent, Accordion, AccordionSummary, AccordionDetails} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useLocation } from 'react-router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import "./style.css"
import EditCategories from '../edit_categories'
import Popup from "../../../../components/popup"
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

function CourseCreation(props) {
    const [content, setContent] = useState(new CourseCreationController())
    const [selectedChapter, setSelectedChapter] = useState(undefined)
    const [openDialog, setOpenDialog] = useState(false)
    const [popupContent, setPopupContent] = useState()
    let { state } = useLocation()

    let windowInfo = props.windowInfo

    function loadWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            let reader = new FileReader();
            reader.onload = function(){
                let dataURL = reader.result
                content.course.setWallpaper(dataURL)
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function laodPresentationVideo(e) {
        let media = URL.createObjectURL(e.target.files[0]);
        content.course.setPresentationVideo(media)
    }

    function closePopup() {
        setPopupContent()
    }

    function publish() {
        let isError = content.checkContentValidity()
        setPopupContent(isError)
        if(isError['error']) {
            content.publish()
        } 
    }

    useEffect(() => {
        content.setState(setContent)
        content.loadArgs()
        if(state != null) {
            let courseid = state['course']
            content.course.loadById(courseid)
        }
    }, [])

    return (
        <div className="creation" id="course_creation">
            <div className="wallpaper_container block">
                {
                    content.course.getWallpaper() ?
                    <>
                        <div id="remove_wallpaper" className="bounce" onClick={() => content.course.setWallpaper("")}>
                            <img src={x_icon} className="img-fluid"/>
                        </div>
                        <img id="wallpaper_img" src={content.course.getWallpaper()} />
                    </> :
                    <>
                        <label className="select_wallpaper" htmlFor="wallpaper_input">
                            <img src={imagePicker} className="img-fluid bounce" />
                        </label>
                        <input
                        id="wallpaper_input"
                        accept="image/*"
                        type="file"
                        onChange={(e) => loadWallpaper(e)}/>
                    </>
                }
            </div>
            <br />
            <Row>
                <Col md="9">
                    <div className="content_container">
                        <div className="block">
                            <TextField
                                className="my_input"
                                margin="normal"
                                label="Titolo"
                                fullWidth={true}
                                variant="outlined"
                                value={content.course.getTitle()}
                                onChange={(e) => content.course.setTitle(e.target.value)}/>
                            <br />
                            <TextField
                                className="my_input"
                                margin="normal"
                                label="Descrizione"
                                fullWidth={true}
                                variant="outlined"
                                value={content.course.getDescription()}
                                onChange={(e) => content.course.setDescription(e.target.value)}/>
                            <br/>
                            <TextField
                                className="my_input"
                                margin="normal"
                                label="Video presentazione(Iframe)"
                                fullWidth={true}
                                variant="outlined"
                                value={content.course.getPresentationVideo()}
                                onChange={(e) => content.course.setPresentationVideo(e.target.value)}/>
                            <TextField
                                className="my_input"
                                margin="normal"
                                label="Video ID"
                                fullWidth={true}
                                variant="outlined"
                                value={content.course.getPresentationVideoId()}
                                onChange={(e) => content.course.setPresentationVideoId(e.target.value)}/>
                        </div>
                        <br />
                        <br />
                        <div className="block">
                            {
                                selectedChapter == undefined ?
                                <>
                                    <h5 className="mb-3">Contenuto</h5>
                                    <div className="chapters_container">
                                        {
                                            Object.values(content.course.getContent()).sort((a,b) => a['position'] > b['position'] ? 1 : -1).map(
                                                (chapter) =>  
                                                <ChapterLayout
                                                key={chapter['id']}
                                                id={chapter['id']}
                                                content={content}
                                                selectedChapter={selectedChapter}
                                                setSelectedChapter={setSelectedChapter}
                                                />
                                            )
                                        }
                                        <Card
                                        className="mini_block bounce"
                                        onClick={() => content.course.addChapter()}
                                        >
                                            <h6 className="m-0">Aggiungi</h6>
                                        </Card>
                                    </div>
                                </> : 
                                <ChapterLayout
                                key={selectedChapter}
                                id={selectedChapter}
                                content={content}
                                selectedChapter={selectedChapter}
                                setSelectedChapter={setSelectedChapter}
                                windowInfo={windowInfo}
                                />
                            }
                        </div>
                        <br />
                    </div>
                </Col>
                <Col md="3">
                    <div className="info_container block">
                        <h5>Informazioni news</h5>
                        <TextField
                            className="my_input"
                            margin="normal"
                            label="Autore(nome utente)"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getOfferedBy()}
                            onChange={(e) => content.course.setOfferedBy(e.target.value)}/>
                        <br />
                        <br />
                        <h6>Professori</h6>
                        {/* <MultipleChoicesQuestion question={content.getCategories()}/>  */}
                        <br />
                        <div className="space_between">
                            <h6 className="mb-3">Argomento</h6>
                            <ModeEditIcon onClick={() => setOpenDialog(true)}/>
                        </div>
                        <EditCategories
                        isOpen={openDialog}
                        setIsOpen={setOpenDialog}
                        content={content.getArgs()}
                        showDescription={true}
                        onDelete={(slug, callback) => content.deleteArgument(slug, callback)}
                        onCreation={(title, description, image, callback) => content.postArgument(title, description, callback)}
                        onUpdate={(slug, title, description, image, callback) => content.updateArgument(slug, title, description, callback)}/>
                        <MultipleChoicesQuestion question={content.getArgs()}/>
                        <hr />
                        <button className="button" onClick={() => publish()}>Pubblica</button>
                    </div>
                </Col>
            </Row>
            {
                popupContent ?
                <Popup isError={popupContent['error']} message={popupContent['message']} removeFunction={closePopup} /> :
                "" 
            }
           
        </div>
    )
}

function ChapterLayout(props) {
    let id = props.id
    let content = props.content
    let selectedChapter = props.selectedChapter
    let setSelectedChapter = props.setSelectedChapter
    let windowInfo = props.windowInfo

    const [selectedLesson, setSelectedLesson] = useState(undefined)

    function handleChapterDelete(e, id) {
        e.stopPropagation()
        content.course.removeChapter(id)
    }

    function handleOnDragEnd(result) {
        let sInd = result.source?.index
        let dInd = result.destination?.index
        if(sInd != undefined && dInd != undefined) content.changeLessonOrder(id, sInd, dInd)
    }

    function handleChapterChangeOrder(e, direction) {
        e.stopPropagation()
        content.changeChapterOrder(id, direction)
    }

    return (
        <>
            {
                selectedChapter != id ?
                <Card
                className="mini_block bounce"
                onClick={() => setSelectedChapter(id)}>
                    <CardContent>
                        <h6 className="m-0">{content.course.getChapterTitle(id)}</h6>
                        <div className="centered">
                            <IconButton className="orange_icon mb-0" type="submit" aria-label="search">
                                <DeleteIcon onClick={(e) => handleChapterDelete(e, id)}/>
                                <ModeEditIcon />
                            </IconButton>
                            <div>
                                <ArrowLeftIcon onClick={(e) => handleChapterChangeOrder(e, -1)} className="orange_icon"/>
                                <ArrowRightIcon onClick={(e) => handleChapterChangeOrder(e, 1)} className="orange_icon"/>
                            </div>
                        </div>
                    </CardContent>
                </Card> :
                <div className="chapter_layout">
                    <div className="chapter_header">
                        <ArrowBackIosIcon
                        className="orange_icon"
                        onClick={() => setSelectedChapter(undefined)}/>
                        <TextField
                            className="my_input"
                            margin="normal"
                            label="Titolo"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getChapterTitle(id)}
                            onChange={(e) => content.course.setChapterTitle(id, e.target.value)}/>
                    </div>
                    <br />
                    <br />
                    <div className="lessons_container">
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="lessons_container">
                                {
                                    (provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                Object.values(content.course.getLessonsByChapter(id)).sort((a,b) => a['position'] > b['position'] ? 1 : -1).map(
                                                    (lesson) => 
                                                        <Draggable key={lesson['id']} draggableId={lesson['id']} index={Number(content.course.getLessonPosition(id, lesson['id']))}>
                                                            {
                                                                (innerProvided) => (
                                                                    <div {...innerProvided.draggableProps} {...innerProvided.dragHandleProps} ref={innerProvided.innerRef} >
                                                                        <LessonLayout
                                                                        key={lesson['id']}
                                                                        lessonId={lesson['id']}
                                                                        chapterId={id}
                                                                        content={content}
                                                                        selectedLesson={selectedLesson}
                                                                        setSelectedLesson={setSelectedLesson}
                                                                        windowInfo={windowInfo}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                        </Draggable>
                                                )
                    
                                            }
                                            {provided.placeholder}
                                        </div>
                                    ) 
                                }
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <br />
                    <Card
                    className="mini_block"
                    onClick={() => content.course.addLesson(id)}>
                        <h5 className="m-0">Aggiungi lezione</h5>
                    </Card>
                    <br />
                </div>
            }
        </>
    )
}

function LessonLayout(props) {
    let content = props.content
    let lessonId = props.lessonId
    let chapterId = props.chapterId
    let windowInfo = props.windowInfo

    const [collapseOpened, setCollapseOpened] = useState(false)
    const [quizAdded, setQuizAdded] = useState(false)
    const [openPanel, setOpenPanel] = useState(false)

    function loadLessonVideo(e, chapterId, lessonId) {
        let media = URL.createObjectURL(e.target.files[0]);
        content.course.setLessonVideo(chapterId, lessonId, media)
    }

    return (
        <>
        {
            !windowInfo.mobileMode ? 
                <Accordion
                expanded={collapseOpened}
                key={lessonId}
                className="accordion block">
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                    onClick={() => setCollapseOpened(!collapseOpened)}>
                    <div className="space_between max_width">
                        <div className="display_inline space_between max_width">
                            <h5 className="m-0">{content.course.getLessonTitle(chapterId, lessonId)}</h5>
                            <DeleteIcon
                            className="orange_icon"
                            onClick={(e) => {
                                e.stopPropagation()
                                content.course.removeLesson(chapterId, lessonId)
                            }}/>
                        </div>
                    </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            className="my_input"
                            margin="normal"
                            label="Titolo"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getLessonTitle(chapterId, lessonId)}
                            onChange={(e) => content.course.setLessonTitle(chapterId, lessonId, e.target.value)}/>
                        <TextField
                            className="my_input"
                            margin="normal"
                            label="Descrizione"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getLessonDescription(chapterId, lessonId)}
                            onChange={(e) => content.course.setLessonDescription(chapterId, lessonId, e.target.value)}/>
                        <br />
                        <TextField
                            className="my_input"
                            margin="normal"
                            label="Video(Iframe)"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getLessonVideo(chapterId, lessonId)}
                            onChange={(e) => content.course.setLessonVideo(chapterId, lessonId, e.target.value)}/>
                        <TextField
                            className="my_input"
                            margin="normal"
                            label="Video ID"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getLessonVideoId(chapterId, lessonId)}
                            onChange={(e) => content.course.setLessonVideoId(chapterId, lessonId, e.target.value)}/>
                        <br />
                        <br />
                        <div className="block">
                            <h5>Contenuto</h5>
                            <MarkupEditor
                            content={content.course.getLessonText(chapterId, lessonId)}
                            setContent={(value) => content.course.setLessonText(chapterId, lessonId, value)}
                            block={false}/>
                        </div>
                        <br />
                        <QuizSection
                        deleteQuiz={() => setQuizAdded(false)}
                        content={content}
                        chapterId={chapterId}
                        lessonId={lessonId}
                        />
                    </AccordionDetails>
                </Accordion> : 
                <>
                    <div className="space_between lesson_mobile_layout max_width"
                    onClick={() => setOpenPanel(true)}>
                        <div className="display_inline space_between max_width">
                            <h5 className="m-0">{content.course.getLessonTitle(chapterId, lessonId)}</h5>
                            <DeleteIcon
                            className="orange_icon"
                            onClick={(e) => {
                                e.stopPropagation()
                                content.course.removeLesson(chapterId, lessonId)
                            }}/>
                        </div>
                    </div>
                    <SwipeableDrawer
                    id={"course_creation"}
                    anchor={"bottom"}
                    open={openPanel}
                    onClose={() => setOpenPanel(false)}
                    onOpen={() => setOpenPanel(true)}
                    >
                        <div id="course_lesson_layout">
                            <h5>Contenuto</h5>
                            <TextField
                            className="my_input"
                            margin="normal"
                            label="Titolo"
                            fullWidth={true}
                            variant="outlined"
                            value={content.course.getLessonTitle(chapterId, lessonId)}
                            onChange={(e) => content.course.setLessonTitle(chapterId, lessonId, e.target.value)}/>
                                <TextField
                                    className="my_input"
                                    margin="normal"
                                    label="Descrizione"
                                    fullWidth={true}
                                    variant="outlined"
                                    value={content.course.getLessonDescription(chapterId, lessonId)}
                                    onChange={(e) => content.course.setLessonDescription(chapterId, lessonId, e.target.value)}/>
                                <br />
                                <br />
                                <div className="wallpaper_container block">
                                    {
                                        content.course.getLessonVideo(chapterId, lessonId) == "" ?
                                        <> 
                                            <label className="load_video centered" htmlFor="lesson_video">
                                                <img src={video_icon} width={100} className="img-fluid mx-auto bounce" />
                                                <h6>Video della lezione</h6>
                                            </label>
                                            <input
                                            id="lesson_video"
                                            accept="video/*"
                                            type="file"
                                            style={{display: 'none'}}
                                            onChange={(e) => loadLessonVideo(e, chapterId, lessonId)}
                                            />
                                        </> : 
                                        <video className="video" controls={true}>
                                            <source src={content.course.getLessonVideo(chapterId, lessonId)} />
                                        </video>
                                    }
                                </div>
                                <br />
                                <div className="block">
                                    <h5>Contenuto lezione</h5>
                                    <MarkupEditor
                                    content={content.course.getLessonText(chapterId, lessonId)}
                                    setContent={(value) => content.course.setLessonContent(chapterId, lessonId, value)}
                                    block={false}/>
                                </div>
                                <br />
                                <QuizSection
                                deleteQuiz={() => setQuizAdded(false)}
                                content={content}
                                chapterId={chapterId}
                                lessonId={lessonId}
                                />
                        </div>
                    </SwipeableDrawer>
                </>
            
        }
        </>
    )

}


function QuizSection(props) {
    let content = props.content
    let chapterId = props.chapterId
    let lessonId = props.lessonId

    return (
        <div className="block">
            <h5>Quiz</h5>
            <br />
            {
                Object.keys(content.course.getQuiz(chapterId, lessonId)).map(
                    (quizId) =>
                        <QuizItem
                        key={quizId}
                        quiz={content.course.getQuizById(chapterId, lessonId, quizId)}
                        quizId={quizId}
                        chapterId={chapterId}
                        lessonId={lessonId}
                        content={content}
                        />
                )
            }
            <br/>
            <div className="text-center">
                <button
                className="button"
                onClick={() => content.course.addQuiz(chapterId, lessonId)}
                >Aggiungi domanda</button>
            </div>
        </div>
    )
}

function QuizItem(props) {
    let chapterId = props.chapterId
    let lessonId = props.lessonId
    let quizId = props.quizId
    let content = props.content
    let quiz = props.quiz
    const [collapseOpened, setCollapseOpened] = useState(false)

    return (
            <Accordion
            className="accordion block"
            expanded={collapseOpened}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                onClick={() => setCollapseOpened(!collapseOpened)}>
                    <div className="display_inline space_between max_width">
                        <h5 className="m-0">{quiz.question.getTitle()}</h5>
                        <DeleteIcon
                        className="orange_icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            content.course.removeQuiz(chapterId, lessonId, quizId)
                        }}/>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <QuestionCreator question={quiz}/>
                </AccordionDetails>
            </Accordion>
            
    )
}



export default CourseCreation
