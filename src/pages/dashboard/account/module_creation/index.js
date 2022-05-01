import React, {useState, useEffect} from 'react'
import {Row, Col} from "react-bootstrap"
import MultipleChoicesQuestion from "../../../../components/multiple_choice_question"
import CreateModuleController from '../../../../controllers/create_module_controller'
import imagePicker from "../../../../media/icons/image_picker.png"
import x_icon from "../../../../media/icons/x.png"
import ModuleLayout from './module_layout'
import { useLocation } from 'react-router'
import EditCategories from '../edit_categories'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Card } from '@mui/material'
import { TextField } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Popup from "../../../../components/popup"
import Skeleton from '@mui/material/Skeleton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@material-ui/core'
import Compressor from 'compressorjs';

import { MenuItem } from '@material-ui/core'

import "./style.css"
import ImageLink from '../../../../components/image_link'

function ModuleCreation(props) {
    const [content, setContent] = useState(new CreateModuleController())
    const [selectedId, setSelectedId] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [popupContent, setPopupContent] = useState()
    const [argumentsLoaded, setArgumentsLoaded] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const [showDeleteDraft, setShowDeleteDraft] = useState(false)

    let user = props.user
    let windowInfo = props.windowInfo

    let { state } = useLocation()

    function loadWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function(){
                let dataURL = reader.result
                content.module.setWallpaper(dataURL)
            }
        }
    }

    function closePopup() {
        setPopupContent()
    }

    function removeDraft() {
        window.localStorage.removeItem("trash")
        window.localStorage.removeItem("data")
        window.location.reload()
    }

    function publish() {
        let isError = content.isContentValid()
        if(isError.error) {
            if(popupContent != undefined) {
                setPopupContent()
                setTimeout(() => setPopupContent(isError), 100)
            } else setPopupContent(isError)
        } else {
            setPopupContent({error : false, message : "Pubblicazione in corso..."})
            content.publish((message) => setPopupContent(message))
            .then(() => {
                window.localStorage.removeItem("trash")
                window.localStorage.removeItem("data")
                setShowDeleteDraft(false)
                setPopupContent({ error: false, message: "Pubblicazione completata"})
                setTimeout(() => setPopupContent({ error: false, message: "Pubblicazione completata"}), 1000)
                setSelectedId(null)
            })
            .catch((error) => {
                console.warn(error)
                setPopupContent({error: true, message: "Errore, riprovare"})
            })
        }
    }

    // loading content
    useEffect(async () => {
        content.setState(setContent)
        await content.loadArguments().then(() => setArgumentsLoaded(true)).catch(() => alert('Ricarica la pagina'))
        // managing edit mode
        if(state != null) {
            let moduleId = state['module']
            // let moduleId = "proviamo"
            let draftId = JSON.parse(window.localStorage.getItem('data'))?.id
            if(draftId == moduleId) {
                let module_info = JSON.parse(window.localStorage.getItem('data'))
                content.module.load(module_info)
                setShowDeleteDraft(true)
                setPopupContent({error: false, message: "Caricamento ultima modifica"})
            } else {
                content.module.loadById(moduleId)
            }
            // content.load({...{module: module_info}})
        } else if(window.localStorage.getItem('data') != undefined) {
            // managing draft
            let module_info = JSON.parse(window.localStorage.getItem('data'))
            content.module.load(module_info)
            setShowDeleteDraft(true)
            setPopupContent({error: false, message: "Caricamento ultima modifica"})
        }
        setFirstLoad(false)
    }, [])

    useEffect(() => {
        // saving data to local storage(don't lose data on refresh)
        if(!firstLoad) {
            window.localStorage.setItem("data", JSON.stringify(content.module.exportInfo()))
            if(window.localStorage.getItem('trash') == undefined)
                window.localStorage.setItem('trash', JSON.stringify({notes: [], pages: []})) // id of deleted items
        }
    }, [content])
    

    return (
        <div className="creation" id="module_creation">
            <div className="wallpaper_container block">
                {
                    content.module.getWallpaper() ?
                    <>
                        <div id="remove_wallpaper" className="bounce" onClick={() => content.module.setWallpaper("")}>
                            <img src={x_icon} className="img-fluid"/>
                        </div>
                        <img id="wallpaper_img" src={content.module.getWallpaper()} />
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
                                fullWidth={true}
                                multiline={true}
                                label="Titolo"
                                variant="outlined"
                                value={content.module.getTitle()}
                                onChange={(e) => content.module.setTitle(e.target.value)}/>
                            <TextField
                                className="my_input"
                                margin="normal"
                                fullWidth={true}
                                multiline={true}
                                label="Descrizione"
                                variant="outlined"
                                value={content.module.getDescription()}
                                onChange={(e) => content.module.setDescription(e.target.value)}/>
                        </div>
                        <br />
                        <div className="block">
                            {
                                selectedId == null ?
                                <h4>Moduli</h4> :
                                ""
                            }
                            <div className={selectedId == null ? "modules_container columns" : "modules_container"}>
                                {
                                    // MODULI
                                    Object.keys(content.module.getModules()).sort((a,b) => content.module.getModules()[a]['position'] > content.module.getModules()[b]['position'] ? 1 : -1).map((id) => {
                                        if(selectedId != null) {
                                            if(selectedId == id)
                                                return <ModuleLayout
                                                selectedId={selectedId}
                                                setSelectedId={setSelectedId}
                                                module={content} id={id}
                                                windowInfo={windowInfo}
                                                />
                                        } else return <ModuleLayout
                                                        selectedId={selectedId}
                                                        setSelectedId={setSelectedId}
                                                        module={content}
                                                        id={id}/>
                                    })
                                }
                                {
                                    selectedId == null ?
                                    <Card
                                        className="mini_block bounce"
                                        onClick={() => content.module.addModule()}>
                                        <AddCircleOutlineIcon className="orange_icon"/>
                                    </Card> : 
                                    ""
                                }
                                
                            </div>
                        </div>
                        {/* <MarkupEditor
                        // content={content.getContent()}
                        content="# ciao ![ciao](http://www.google.com.au/images/nav_logo7.png)"
                        setContent={content.setContent}
                        /> */}
                        <br />
                    </div>
                </Col>
                <Col md="3">
                    <div className="info_container block">
                        <br />
                        <TextField
                        className={windowInfo.mobileMode ? "my_input " : "my_input"}
                        fullWidth={true}
                        multiline={true}
                        type={"number"}
                        label="Posizione"
                        variant="outlined"
                        value={content.module.getPosition()}
                        onChange={(e) => content.module.setPosition(e.target.value)}/>
                        <br/>
                        <br/>
                        <TextField
                        className={windowInfo.mobileMode ? "my_input " : "my_input"}
                        fullWidth={true}
                        multiline={true}
                        select
                        label="Difficoltà"
                        variant="outlined"
                        value={content.module.getDifficultyLevel()}
                        onChange={(e) => content.module.setDifficultyLevel(e.target.value)}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </TextField>
                        <br/>
                        <br/>
                        <div className="space_between">
                            <h5>Categoria</h5>
                            {
                                user && Object.values(user.getRole()).map((item) => item['slug']).includes("super-admin") ||
                                user && Object.values(user.getRole()).map((item) => item['slug']).includes('super-admin-academy') ?
                                <ModeEditIcon
                                    className="orange_icon mb-3"
                                    onClick={() => setOpenDialog(true)}/> :
                                    ""
                            }
                        </div>
                        {
                            argumentsLoaded ? 
                            <MultipleChoicesQuestion question={content.getArguments()}/> :
                            <>
                                <Skeleton sx={{ bgcolor: 'gray.800', borderRadius: 3 }} className="mb-2" animation="wave" variant="rectangular" height="20px" />
                                <Skeleton sx={{ bgcolor: 'gray.800', borderRadius: 3 }} className="mb-2" animation="wave" variant="rectangular" height="20px" />
                                <Skeleton sx={{ bgcolor: 'gray.800', borderRadius: 3 }} className="mb-2" animation="wave" variant="rectangular" height="20px" />
                                <Skeleton sx={{ bgcolor: 'gray.800', borderRadius: 3 }} className="mb-2" animation="wave" variant="rectangular" height="20px" />
                            </>
                        }
                        <hr/>
                        <button className="button" onClick={() => publish()}>Pubblica</button>
                        {
                        showDeleteDraft ? 
                            <button className="button" onClick={() => removeDraft()}>Elimina Bozza</button> :
                            ""
                        }
                        {
                            user && Object.values(user.getRole()).map((item) => item['slug']).includes("super-admin") ||
                            user && Object.values(user.getRole()).map((item) => item['slug']).includes('super-admin-academy') ?
                            <EditCategories
                                onUpdate={content.updateArgument}
                                onCreation={content.addArgument}
                                onDelete={content.deleteArgument}
                                content={content.getArguments()}
                                isOpen={openDialog}
                                setIsOpen={setOpenDialog}
                                showDescription={true}
                                showImage={true}/> : 
                                ""
                        }
                        
                    </div>
                    <br/>
                    <ImageLink />
                    <br/>
                </Col>
            </Row>
            {
                popupContent != null ?
                <Popup isError={popupContent['error']} message={popupContent['message']} removeFunction={closePopup}/> :
                ""
            }
        </div>
    )
}



export default ModuleCreation
