import React, {useState, useEffect, useRef} from "react"
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from "@mui/material";
import Select from '@mui/material/Select';
import {Row, Col} from "react-bootstrap"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from "@material-ui/core";
import { useNavigate } from "react-router";
import $ from "jquery"
import { Tab, Tabs } from "@material-ui/core";
import {default as external_routes} from "../../../routes"
import ConfirmAction from "../../../../../components/confirm_action";

function AccademySection(props) {
    let user = props.user
    let windowInfo = props.windowInfo
    let accademy = user.modules
    let routes = props.routes
    let navigate = useNavigate()

    // section name
    const CREATED_SECTION = "created"
    const SAVED_SECTION = "saved"
    const IN_PROPGRESS_SECTION = "in_progress"

    const [section, setSection] = useState(SAVED_SECTION)
    const [firstLoad, setFirstLoad] = useState(true)
    const [confirmInfo, setConfirmInfo] = useState({confirm: undefined, refute: undefined})

    const loaderElement = useRef()
    const observer = useRef(new IntersectionObserver(() => {}))

    // delete and edit management
    function handleDelete(e, id) {
        e.stopPropagation()
        setConfirmInfo({
            confirm: () => {
                if(section == CREATED_SECTION) accademy.removeModule(id, accademy.CREATED_MODULES_TAG)
                else if(section == SAVED_SECTION) accademy.removeModule(id, accademy.SAVED_SECTION)
                else if(section == IN_PROPGRESS_SECTION) accademy.removeModule(id, accademy.IN_PROGRESS_MODULE_TAG)
            },
            refute: undefined
        })
    }

    function handleEdit(item) {
        navigate(routes.module_creation.path, { state : { module : item.id }})
    }

    // opens create module page
    function createNewModule() {
        navigate(routes.module_creation.path)
    }

    function openNote(moduleId, noteId) {
        navigate(external_routes.single_module.path + moduleId + "/" + noteId)
    }
    // used to load modules automatically on scroll
    async function manageInfiniteScroll(e) {
        let list = e.target
        let listScrollHeight = list.clientHeight
        let listOffsetTop = $('#modules_container').offset().top
        let lastElementOffsetTop = $('#modules_container .list_item').last().offset().top

        if(lastElementOffsetTop < listOffsetTop + listScrollHeight) {
            await accademy.loadCreatedModules() // TODO: change in base of section name
        }
    }

    useEffect(() => {
        observer.current.disconnect()

        if(loaderElement.current != undefined) {
            console.log("a")
            observer.current = new IntersectionObserver((e) => {
                let info = e[0]
                if(info['isIntersecting']) {
                    if(section == CREATED_SECTION && user && user.canI("create_academy")) accademy.loadCreatedModules()
                    else if(section == SAVED_SECTION) accademy.loadSavedNotes()
                }
            })

            observer.current.observe(loaderElement.current)
        }
    }, [section, accademy.getSavedNotes(), accademy.getCreatedModules()])
    


    useEffect(() => {   
        console.log(accademy.getSavedNotes())
    }, [accademy.getSavedNotes()])

    return <div id="accademy_section">
        <div className="space_between">
            <h2>Accademy</h2>
            {
                user && user.canI("create_academy") ?
                    <div className="centered">
                        <AddCircleIcon className="orange_icon" onClick={createNewModule}/>
                    </div> :
                    ""
            }
        </div>
        <Col md="6" className="mx-auto">
            <div className="search_bar mt-4">
                <input placeholder="Cerca..."/>
            </div>
        </Col>
        <Tabs value={section} onChange={(e, newValue) => setSection(newValue)} scrollButtons="auto" centered>
            <Tab label="Salvate" value={SAVED_SECTION}/>
            { user && user.canI("create_academy") ? <Tab label="Create" value={CREATED_SECTION} /> : "" }
            
        </Tabs>

        <div className="items_container">
            {
                !windowInfo.mobileMode ?
                    <div className="header">
                        <Row>
                            <Col md="3">
                                <h6>Titolo</h6>
                            </Col>
                            <Col md="3"></Col>
                            <Col md="3"></Col>
                            <Col md="3">
                                <h6>Modifica</h6>
                            </Col>
                        </Row>
                    </div> :
                    ""
            }
            <hr/>
            <div className="list" id="modules_container">
                {
                    section == SAVED_SECTION ?
                        accademy && accademy.getSavedNotes().map((item) => (
                            <div className="bounce" onClick={() => openNote(item['module_id'], item['id'])}>
                                <p>{item.title}</p>
                                <hr/>
                            </div>
                        ))
                    : section == CREATED_SECTION ?
                        accademy && Object.values(accademy.getCreatedModules()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : ""
                }
                {
                    section == CREATED_SECTION && accademy.isLastPageLoaded() ?
                    "" : 
                    section == SAVED_SECTION && accademy.saved_notes_index == null ?
                    "" :
                    <div ref={loaderElement} className="loading m-auto"></div>
                }
            </div>
        </div>
        <ConfirmAction action={confirmInfo} closeFunction={() => setConfirmInfo({confirm: undefined, refute: undefined})}/>
    </div>
}

function ListItem(props) {
    let content = props.content
    let deleteItem = props.deleteItem
    let editContent = props.editItem

    return <div className="list_item bounce" onClick={() => editContent(content.exportInfo())}>
        <Row>
            <Col md="3">
                <p className="title">{content && content.getTitle()}</p>
            </Col>
            <Col md="3">
                <p className="date">{content && content.getPublishDate()}</p>
            </Col>
            <Col md="3">
                <p className="category">{content && content.getArgument()}</p>
            </Col>
            <Col md="3">
                <div className="display_inline">
                    <DeleteIcon
                    onClick={(e) => deleteItem(e, content.getId())} 
                    className="orange_icon m-1" />
                    <EditIcon className="orange_icon m-1" />
                </div>
            </Col>
        </Row>
        <hr/>
    </div>
}

export default AccademySection