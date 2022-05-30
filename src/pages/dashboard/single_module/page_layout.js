import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import ModuleController from '../../../controllers/module_controller'
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import { Skeleton } from '@mui/material';
import { Fade } from '@mui/material';

import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function PageLayout(props) {
    let windowInfo = props.windowInfo
    let { moduleId } = useParams()
    let navigate = useNavigate()

    const [content, setContent] = useState(new ModuleController())
    const [height, setHeight] = useState("auto")

    function openLesson(moduleId) {
        navigate(moduleId, { state : { module: content.exportInfo() }})
    }

    function resume() {
        let completedNotes = content.getCompletedNotes()
        let lastCompletedNote = completedNotes[completedNotes.length - 1]
        let notes = Object.values(content.getModules()).sort((a,b) =>  a['position'] > b['position'] ? 1 : -1)
        let notesId = notes.map(item => item['id'])
        let nextNoteIndex = notesId.indexOf(lastCompletedNote) + 1
        if(nextNoteIndex >= 0 && nextNoteIndex < notesId.length) {
            let nextNoteSlug = notesId[nextNoteIndex]
            navigate(nextNoteSlug, { state : { module: content.exportInfo() }})
        }
    }

    function saveNote(e, noteId) {
        e.stopPropagation()
        if(!content.getModuleById(noteId)['isSaved']) content.saveNote(noteId)
        else content.unsaveNote(noteId)
        content.getModuleById(noteId)['isSaved'] = !content.getModuleById(noteId)['isSaved']
        content.updateInfo()
    }

    function likeNote(e, noteId) {
        e.stopPropagation()
        if(!content.getModuleById(noteId)['isLiked']) content.likeNote(noteId)
        else content.unlikeNote(noteId)
        content.getModuleById(noteId)['isLiked'] = !content.getModuleById(noteId)['isLiked']
        content.updateInfo()
    }

    useEffect(async () => {
        content.setState(setContent)
        let fullGet = false
        content.loadById(moduleId, fullGet)
        content.loadCompletedNotes(moduleId)
    }, [])
    
    useEffect(() => {
        if(windowInfo.mobileMode) setHeight("auto")
        else setHeight(window.dashboardContainerHeight)
    }, [windowInfo.dashboardContainerHeight])
    
    return (
        <div id="single_module">
            <div className="content_container" >
                {
                    content && content.getWallpaper() == "" ?
                    "" : 
                    <img className="wallpaper" src={content && content.getWallpaper()}/>
                }
                <div className="gradient_effect"></div>
                <div className="content">
                    <div className="info_container">
                        {
                            content && content.getId() == "" ?
                            <>
                                <Skeleton variant="rectangular" height="20px" />
                                <br/>
                                <Skeleton variant="rectangular" height="20px" />
                                <br/>
                                <Skeleton variant="rectangular" height="100px" />
                                <br/>
                                <Skeleton variant="rectangular" height="100px" />
                                <br/>
                                <Skeleton variant="rectangular" height="100px" />
                                <br/>
                                <Skeleton variant="rectangular" height="100px" />
                            </> :
                            <Fade in={true} style={{ transitionDuration: "1000ms"}}>
                                <div>
                                    <h1 className="title">{content && content.getTitle()}</h1>
                                    <p className="author">{ content && content.getArgument()} - {content && content.getAuthor()}</p>
                                    <div className="separator"></div>
                                    <div className="buttons">
                                        <div className="display_inline">
                                            {/* <div className="item">
                                                <div className="icon_container bounce">
                                                    <AddIcon className="icon"/>
                                                </div>
                                                <h6>Aggiungi</h6>
                                            </div> */}
                                        {
                                            content && content.getCompletedNotes().length == Object.keys(content.getModules()).length ? 
                                            "" : 
                                            <div className="item" onClick={() => resume()}>
                                                <div className="icon_container bounce">
                                                    <PlayArrowIcon className="icon"/>
                                                </div>
                                                <h6>Riprendi</h6>
                                            </div>
                                        }
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
                                            className={content.getCompletedNotes().includes(moduleId) ? "block lesson_item ended bounce" : "block lesson_item bounce"}>
                                                <h3 className="lesson_title">{content.getModuleTitle(moduleId)}</h3>
                                                <div className="text-center">
                                                    {
                                                        !content.getModuleById(moduleId)['isSaved'] ? 
                                                        <PlaylistAddIcon className="orange_icon m-2" onClick={(e) => saveNote(e, moduleId)}/> :
                                                        <PlaylistAddCheckIcon className="orange_icon m-2" onClick={(e) => saveNote(e, moduleId)}/>
                                                    }
                                                    {
                                                        content.getModuleById(moduleId)['isLiked'] ? 
                                                        <FavoriteIcon className="orange_icon m-2" onClick={(e) => likeNote(e, moduleId)}/> :
                                                        <FavoriteBorderIcon className="orange_icon m-2" onClick={(e) => likeNote(e, moduleId)}/>

                                                    }
                                                    {
                                                        !content.getCompletedNotes().includes(moduleId) ?
                                                            <PlayArrowIcon className="play_module bounce m-2"/> : 
                                                            <DoneIcon className="play_module bounce m-2"/> 
                                                    }
                                                </div>
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
                            </Fade>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageLayout
