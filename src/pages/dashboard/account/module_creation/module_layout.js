import React, {useState, useEffect} from 'react'
import MarkupEditor from "../../../../components/markup_editor"
import QuestionCreator from "../../../../components/question_creator"
import {Row, Col} from "react-bootstrap"
import { Card, CardContent, Fade, IconButton, Accordion, AccordionSummary, AccordionDetails, TextField, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenuItem } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ImagePicker from "../../../../media/icons/image_picker.png"
import CloseIcon from '@mui/icons-material/Close';

function ModuleLayout(props) {
    let id = props.id
    let content = props.module
    let selectedId = props.selectedId
    let setSelectedId = props.setSelectedId
    let windowInfo = props.windowInfo

    const [selectedPage, setSelectedPage] = useState(null)
    const [startTransition, setStartTransition] = useState(false)

    function handleDeleteModule(e) {
        e.stopPropagation()
        content.deleteModule(id)
    }
    
    function handleOnDragEnd(result) {
        let sInd = result.source?.index
        let dInd = result.destination?.index
        if(sInd != undefined && dInd != undefined) content.changePageOrder(id, sInd, dInd)
    }

    function changeOrder(e, direction, moduleId) {
        e.stopPropagation()
        content.changeModuleOrder(direction, moduleId)
    }
    
    useEffect(() => {
        if(selectedId == id) {
            setStartTransition(true)   
        } else {
            setStartTransition(false)
        }
    }, [selectedId])

    return (
        <>
        {
            selectedId != id ?
            <Fade in={true}>
                <Card
                className="mini_block bounce"
                onClick={() => setSelectedId(id)}>
                    <CardContent>
                        <h6 className="m-0">{content.module.getModuleTitle(id)}</h6>
                        <div className="centered">
                            <IconButton className="orange_icon mb-0" type="submit" aria-label="search">
                                <DeleteIcon onClick={(e) => handleDeleteModule(e)}/>
                                <ModeEditIcon />
                            </IconButton>
                            <div className="display_inline">
                                <IconButton className="orange_icon" onClick={(e) => changeOrder(e, -1, id)}>
                                    <ArrowLeftIcon />
                                </IconButton>
                                <IconButton className="orange_icon" onClick={(e) => changeOrder(e, 1, id)}>
                                    <ArrowRightIcon />
                                </IconButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Fade> :
            <Collapse in={startTransition} timeout={500}>
                <div className="module_title_container mt-2">
                    <div className="display_inline vertical_centered">
                        <ArrowBackIosNewIcon
                        onClick={() => setSelectedId(null)}/>
                        <TextField
                            className="my_input"
                            fullWidth={true}
                            multiline={true}
                            label="Titolo del modulo"
                            variant="outlined"
                            value={content.module.getModuleTitle(id)}
                            onChange={(e) => content.module.setModuleTitle(id, e.target.value)}/>
                    </div>
                </div>
                <br/>
                <br/>
                {
                    !windowInfo.mobileMode ? 
                    <>
                        <br />
                        <br />
                    </> : 
                    <br/>                    
                }
                
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="list" >
                    {
                        (provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {
                                    Object.keys(content.module.getAllPages(id)).sort((a,b) => content.module.getPage(id, a)['position'] > content.module.getPage(id, b)['position'] ? 1 : -1).map((pageId, i, _) => {
                                        return (
                                            <Draggable key={pageId} draggableId={pageId} index={Number.parseInt(content.module.getPage(id, pageId)['position'])}>
                                                {
                                                    (innerProvided) => (
                                                        <div {...innerProvided.draggableProps} {...innerProvided.dragHandleProps} ref={innerProvided.innerRef} >
                                                            <PageLayout
                                                                i={i}
                                                                content={content} 
                                                                selectedPage={selectedPage}
                                                                setSelectedPage={setSelectedPage}
                                                                pageId={pageId}
                                                                moduleId={id}
                                                                windowInfo={windowInfo}
                                                                />
                                                        </div>
                                                    )
                                                }
                                            </Draggable>
                                        )
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                    </Droppable>
                </DragDropContext>
                
                <Row className="mt-4">
                    <Col>
                        <div
                        className="page orange_border  bounce"
                        onClick={() => content.module.addPage(id)}>
                            <h5 className="m-0 add_page">Aggiungi pagina</h5>
                        </div>
                    </Col>
                    <Col>
                        <div
                        className="page orange_border bounce"
                        onClick={() => content.module.addQuiz(id)}>
                            <h5 className="m-0 add_page">Aggiungi quiz</h5>
                        </div>
                    </Col>
                </Row>
            </Collapse>
        }
        </>
    )
}

function PageLayout(props) {
    let i = props.i
    let content = props.content
    let moduleId = props.moduleId
    let pageId = props.pageId
    let selectedPage = props.selectedPage
    let setSelectedPage = props.setSelectedPage
    let windowInfo = props.windowInfo
    
    let type = content.module.getPageType(moduleId, pageId)
    const [openPanel, setOpenPanel] = useState(false)

    function setPageWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            if(input?.files[0] != undefined) {
                let reader = new FileReader()
                reader.readAsDataURL(input.files[0])
                reader.onload = function() {
                    let dataURL = reader.result
                    content.module.setPageWallpaper(moduleId, pageId, dataURL)
                }
            }
        }
    }

    return (
            <>
                {
                    !windowInfo.mobileMode ? 
                        <Accordion
                        expanded={selectedPage == pageId}
                        key={i}
                        className="accordion block"
                        onChange={() => setSelectedPage(pageId == selectedPage ? null : pageId)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon className="orange_icon"/>}>
                                <div className="display_inline space_between">
                                    <h5 className="m-0">{type == 'quiz' ? 'Quiz' : "Lezione"}</h5>
                                    <DeleteIcon
                                    className="orange_icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        content.deletePage(moduleId, pageId)
                                    }}/>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>

                                {
                                    type == 'page' ? 
                                    <>
                                        <div className="block" id="module_wallpaper_container">
                                            <h6>Wallpaper</h6>
                                            {
                                                content.module.getPageWallpaper(moduleId, pageId) == "" ?
                                                    <>
                                                        <label htmlFor="module_wallpaper" className="centered">
                                                            <img className="img-fluid mx-auto bounce" src={ImagePicker} width={200} />
                                                        </label>
                                                        <input id="module_wallpaper"
                                                        type="file" accept="image/*"
                                                        style={{ display: "none" }}
                                                        onChange={setPageWallpaper}/>
                                                    </> : 
                                                    <>
                                                        <CloseIcon className="remove_module_wallpaper bounce" onClick={() => content.module.setPageWallpaper(moduleId, pageId, "")}/>
                                                        <img className="module_wallpaper" src={content.module.getPageWallpaper(moduleId, pageId)} />
                                                    </>
                                            }
                                        </div>
                                        <MarkupEditor
                                        content={content.module.getPageContent(moduleId, pageId)}
                                        setContent={(value) => content.module.setPageContent(moduleId, pageId, value)}/> 
                                    </> : 
                                    <Col md="12">
                                        <QuestionCreator question={content.module.getPageContent(moduleId, pageId)}/>
                                    </Col>
                                }
                            </AccordionDetails>
                        </Accordion> : 
                        <>
                            <div
                            className="display_inline mobile_page space_between bounce"
                            onClick={() => setOpenPanel(true)}>
                                <h5 className="m-0">{type == 'quiz' ? 'Quiz' : "Lezione"}</h5>
                                <DeleteIcon
                                className="orange_icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    content.deletePage(moduleId, pageId)
                                }}/>
                            </div>
                            <SwipeableDrawer
                                anchor={"bottom"}
                                open={openPanel}
                                onClose={() => setOpenPanel(false)}>
                                <div id="academy_page_panel">
                                    <h5>Contenuto</h5>
                                {
                                    type == 'page' ? 
                                    <MarkupEditor
                                    content={content.module.getPageContent(moduleId, pageId)}
                                    setContent={(value) => content.module.setPageContent(moduleId, pageId, value)}/> : 
                                    <Col md="12">
                                        <QuestionCreator question={content.module.getPageContent(moduleId, pageId)}/>
                                    </Col>
                                }
                                </div>
                            </SwipeableDrawer>
                        </>
                }
            </>
    )
}




export default ModuleLayout