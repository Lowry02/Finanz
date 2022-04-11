import React, {useState, useEffect} from "react"
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

    useEffect(() => {   
        if(firstLoad && accademy != undefined) {
            accademy.loadSavedModules()
            accademy.loadCreatedModules()
            accademy.loadModulesInProgress()
            setFirstLoad(false)
        }
    }, [accademy])

    // delete and edit management
    function handleDelete(e, id) {
        e.stopPropagation()
        if(section == CREATED_SECTION) accademy.removeModule(id, accademy.CREATED_MODULES_TAG)
        else if(section == SAVED_SECTION) accademy.removeModule(id, accademy.SAVED_SECTION)
        else if(section == IN_PROPGRESS_SECTION) accademy.removeModule(id, accademy.IN_PROGRESS_MODULE_TAG)
    }

    function handleEdit(item) {
        navigate(routes.module_creation.path, { state : { module : item.id }})
    }

    // opens create module page
    function createNewModule() {
        navigate(routes.module_creation.path)
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

    return <div id="accademy_section">
        <div className="space_between">
            <h2>Accademy</h2>
            <div className="centered">
                <AddCircleIcon className="orange_icon" onClick={createNewModule}/>
            </div> 
        </div>
        <br/>
        {
            !windowInfo.mobileMode ? 
                <Row>
                    <Col md="4">
                        <div className="search_bar mt-4">
                            <input placeholder="Cerca..."/>
                        </div>
                    </Col>
                    <Col md="4">
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label" className="label_orange">Categoria</InputLabel>
                            <Select
                            className="select my_input"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            >
                                <MenuItem value={CREATED_SECTION}>Create</MenuItem>
                                <MenuItem value={SAVED_SECTION}>Salvate</MenuItem>
                                <MenuItem value={IN_PROPGRESS_SECTION}>In Corso</MenuItem>
                            </Select>
                        </FormControl>
                    </Col>
                </Row> : 
                <div>
                    <div className="search_bar ">
                        <input placeholder="Cerca..."/>
                    </div>
                    <FormControl className="mobile_filter" variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label" className="label_orange">Categoria</InputLabel>
                        <Select
                        className="select my_input"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        >
                            <MenuItem value={CREATED_SECTION}>Create</MenuItem>
                            <MenuItem value={SAVED_SECTION}>Salvate</MenuItem>
                            <MenuItem value={IN_PROPGRESS_SECTION}>In Corso</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            
        }

        <div className="items_container">
            {
                !windowInfo.mobileMode ?
                    <div className="header">
                        <Row>
                            <Col md="3">
                                <h6>Titolo</h6>
                            </Col>
                            <Col md="3">
                                <h6>Data</h6>
                            </Col>
                            <Col md="3">
                                <h6>Categoria</h6>
                            </Col>
                            <Col md="3">
                                <h6>Modifica</h6>
                            </Col>
                        </Row>
                    </div> :
                    ""
            }
            <hr/>
            <div className="list" id="modules_container" onScroll={manageInfiniteScroll}>
                {
                    section == SAVED_SECTION ?
                    accademy && Object.values(accademy.getSavedModules()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : section == CREATED_SECTION ?
                    accademy && Object.values(accademy.getCreatedModules()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : section == IN_PROPGRESS_SECTION ?
                    accademy && Object.values(accademy.getModulesInProgress()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : ""
                }
                {
                    accademy.isLastPageLoaded() ?
                    "" : 
                    <div className="loading m-auto"></div>
                }
            </div>
        </div>
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