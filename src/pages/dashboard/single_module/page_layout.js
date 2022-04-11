import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import ModuleController from '../../../controllers/module_controller'
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton, Fade } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {Row, Col} from "react-bootstrap"
import { TextField } from '@mui/material'

// function PageLayout() {
//     let { moduleId } = useParams()
//     const [content, setContent] = useState(new ModuleController())
//     let navigate = useNavigate()

//     function openLesson(moduleId) {
//         navigate(moduleId, { state : { module: content.exportInfo() }})
//     }

//     useEffect(() => {
//         content.setState(setContent)
//         content.loadById(moduleId, false)
//     }, [])

//     return (
//         <Fade in={true}>
//             <div id="single_module">
//                 <div className="wallpaper_container block mb-3">
//                     <img src={content.getWallpaper()} className="wallpaper" />
//                 </div>
//                 <br/>
//                 <Row>
//                     <Col md="8 mx-auto">
//                         <h1 className="title">{content.getTitle()}</h1>
//                         <h5 className="orange_line mb-3 mt-3">Descrizione</h5>
//                         <p className="description">{content.getDescription()}</p>
//                         <h5 className="orange_line mb-3">Lezioni</h5>
//                         <div className="lessons_container">
//                             {
//                                 Object.keys(content.getModules()).map(
//                                     (moduleId) =>
//                                         <div
//                                         className="block lesson_item bounce"
//                                         onClick={() => openLesson(moduleId)}>
//                                             <h5 className="m-0">
//                                                 {content.getModuleTitle(moduleId)}
//                                                 <IconButton className="orange_icon">
//                                                     <ArrowForwardIosIcon />
//                                                 </IconButton>
//                                             </h5>
//                                         </div>
//                                 )
//                             }
//                         </div>
//                     </Col>
//                     <Col md="4" className="mb-3 block side_bar">
//                         <h5>Informazioni</h5>
//                         <TextField
//                             InputProps={{readOnly: true}}
//                             className="my_input"
//                             margin="normal"
//                             fullWidth={true}
//                             label="Autore"
//                             value={content.getAuthor()}/>
//                         <TextField
//                             InputProps={{readOnly: true}}
//                             className="my_input"
//                             margin="normal"
//                             fullWidth={true}
//                             label="Pagina social"
//                             value={content.getAuthor()}/>
//                         <TextField
//                             InputProps={{readOnly: true}}
//                             className="my_input"
//                             margin="normal"
//                             fullWidth={true}
//                             label="Argomento"
//                             value={content.getAuthor()}/>
//                         <Row className="mt-3">
//                             <Col md="4" className="value_container centered">
//                                 <p className="value_description m-0">Durata</p>
//                                 <h2 className="value">{content.getTime()}</h2>
//                             </Col>
//                             <Col md="4" className="value_container centered">
//                                 <p className="value_description m-0">Difficoltà</p>
//                                 <h2 className="value">{content.getDifficultyLevel()}</h2>
//                             </Col>
//                             <Col md="4" className="value_container centered">
//                                 <p className="value_description m-0">Moduli</p>
//                                 <h2 className="value">{content.getNModules()}</h2>
//                             </Col>
//                         </Row>
//                         {/* <div className="buy block bounce mt-3">
//                             <h3 className="m-0">Acquista</h3>
//                         </div>  */}
//                     </Col>
//                 </Row>
//                 <br/>
//             </div>
//         </Fade>
//     )
// }

function PageLayout(props) {
    let windowInfo = props.windowInfo
    let { moduleId } = useParams()
    let navigate = useNavigate()
    const [content, setContent] = useState(new ModuleController())
    const [height, setHeight] = useState("auto")

    function openLesson(moduleId) {
        navigate(moduleId, { state : { module: content.exportInfo() }})
    }

    useEffect(() => {
        content.setState(setContent)
        content.loadById(moduleId, false)
    }, [])
    
    useEffect(() => {
        if(windowInfo.mobileMode) setHeight("auto")
        else setHeight(window.dashboardContainerHeight)
    }, [windowInfo.dashboardContainerHeight])
    
    return (
        <div id="single_module">
            <div className="content_container" style={{height: height}}>
                <img className="wallpaper" src={content && content.getWallpaper()}/>
                <div className="gradient_effect"></div>
                <div className="content">
                    <div className="info_container">
                        <h1 className="title">{content && content.getTitle()}</h1>
                        <p className="author">{ content && content.getArgument()} - {content && content.getAuthor()}</p>
                        <div className="separator"></div>
                        <div className="buttons">
                            <div className="display_inline">
                                <div className="item">
                                    <div className="icon_container bounce">
                                        <AddIcon className="icon"/>
                                    </div>
                                    <h6>Aggiungi</h6>
                                </div>
                                <div className="item">
                                    <div className="icon_container bounce">
                                        <PlayArrowIcon className="icon"/>
                                    </div>
                                    <h6>Riprendi</h6>
                                </div>
                            </div>
                        </div>
                        <div className="separator"></div>
                        <h5 className="text-center">Lezioni</h5>
                        <div className="lessons_container">
                            {
                                content && Object.keys(content.getModules()).map(
                                    (moduleId, i) =>
                                    <>
                                    <div
                                    onClick={() => openLesson(moduleId)}
                                    className={i == 0 ? "block lesson_item ended bounce" : "block lesson_item bounce"}>
                                        <h3 className="lesson_title">{content.getModuleTitle(moduleId)}</h3>
                                        {
                                            i != 0 ?
                                            <h6 className="text-center"><PlayArrowIcon className="play_module bounce"/>Inizia</h6> : 
                                            <h6 className="text-center"><DoneIcon className="play_module bounce"/>Terminato</h6> 
                                        }
                                    </div>
                                    {
                                        i == Object.keys(content.getModules()).length - 1 ?
                                        "" :
                                        <div className="vertical_line"></div>
                                    }
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageLayout
