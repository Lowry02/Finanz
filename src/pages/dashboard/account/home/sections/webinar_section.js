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
import { useNavigate } from "react-router";
import { IconButton } from "@material-ui/core";

function WebinarSection(props) {
    let user = props.user
    let windowInfo = props.windowInfo
    let routes = props.routes
    let webinar = user.webinar
    let navigate = useNavigate()
    
    // section name
    const CREATED_SECTION = "created"
    const SAVED_SECTION = "saved"

    const [section, setSection] = useState(SAVED_SECTION)
    const [firstLoad, setFirstLoad] = useState(true)

    // opens create webinar page
    function createWebinarPage() {
        navigate(routes.webinar_creation.path)
    }

    useEffect(() => {   
        if(firstLoad && webinar != undefined) {
            webinar.loadCreatedWebinar()
            webinar.loadSavedWebinar(3)
            setFirstLoad(false)
        }
    }, [webinar])

    return <div id="webinar_section">
        <div className="space_between">
            <h2>Webinar</h2>
            <div className="centered">
                <AddCircleIcon className="orange_icon" onClick={createWebinarPage}/>
            </div>
        </div>
        <div className="space_between">
            <div className="search_bar mt-4">
                <input placeholder="Cerca..."/>
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
                    </Select>
                </FormControl>
            </div>
        </div>
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
                                <h6>Autori</h6>
                            </Col>
                            <Col md="3">
                                <h6>Modifica</h6>
                            </Col>
                        </Row>
                    </div> : 
                    ""

            }
            <hr/>
            <div className="list">
                {
                    section == SAVED_SECTION ?
                    webinar && Object.values(webinar.getSavedWebinar()).map((item) => <ListItem content={item}/>)
                    : section == CREATED_SECTION ?
                    webinar && Object.values(webinar.getCreatedWebinar()).map((item) => <ListItem content={item}/>)
                    : ""
                }
            </div>
        </div>
    </div>
}

function ListItem(props) {
    let content = props.content

    return <div className="list_item bounce">
        <Row>
            <Col md="3">
                <p className="title">{content && content.getTitle()}</p>
            </Col>
            <Col md="3">
                <p className="date">{content && content.getDate()}</p>
            </Col>
            <Col md="3">
                <p className="category">{content && content.getAuthors()}</p>
            </Col>
            <Col md="3">
                <div className="display_inline">
                    <DeleteIcon className="orange_icon m-1" />
                    <EditIcon className="orange_icon m-1" />
                </div>
            </Col>
        </Row>
        <hr/>
    </div>
}

export default WebinarSection