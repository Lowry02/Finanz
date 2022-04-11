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

function CoursesSection(props) {
    let user = props.user
    let windowInfo = props.windowInfo
    let courses = user.courses
    let routes = props.routes 

    let navigate = useNavigate()

    // section name
    const CREATED_SECTION = "created"
    const SAVED_SECTION = "saved"
    const IN_PROPGRESS_SECTION = "in_progress"

    const [section, setSection] = useState(SAVED_SECTION)
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {   
        if(firstLoad && courses != undefined) {
            courses.loadSavedCourses()
            courses.loadCreatedCourses(3)
            courses.loadCoursesInProgress()
            setFirstLoad(false)
        }
    }, [courses])

    // delete and edit management
    function handleDelete(e, id) {
        e.stopPropagation()
        if(section == CREATED_SECTION) courses.removeCourse(id, courses.CREATED_COURSES)
        else if(section == SAVED_SECTION) courses.removeCourse(id, courses.SAVED_COURSES_TAG)
        else if(section == IN_PROPGRESS_SECTION) courses.removeCourse(id, courses.IN_PROGRESS_COURSE)
    }

    function handleEdit(item) {
        navigate(routes.course_creation.path, { state : { course : item } })
    }

    // opens create new course page
    function createNewCourse() {
        navigate(routes.course_creation.path)
    }

    return <div id="courses_section">
        <div className="space_between">
            <h2>Corsi</h2>
            <div className="centered">
                <AddCircleIcon className="orange_icon" onClick={createNewCourse}/>
            </div>
        </div>
        <Row>
            <Col md="6">
                <div className="search_bar mt-4">
                    <input placeholder="Cerca..."/>
                </div>
            </Col>
            <Col md="6">
                <FormControl variant="standard" className="mobile_filter" sx={{ m: 1, minWidth: 120 }}>
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
        </Row>
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
            <div className="list">
                {
                    section == SAVED_SECTION ?
                    courses && Object.values(courses.getSavedCourses()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : section == CREATED_SECTION ?
                    courses && Object.values(courses.getCreatedCourse()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : section == IN_PROPGRESS_SECTION ?
                    courses && Object.values(courses.getCoursesInProgress()).map((item) => <ListItem content={item} deleteItem={handleDelete} editItem={handleEdit}/>)
                    : ""
                }
            </div>
        </div>
    </div>
}

function ListItem(props) {
    let content = props.content
    let deleteItem = props.deleteItem
    let editItem = props.editItem

    return <div className="list_item bounce" onClick={() => editItem(content.exportInfo())}>
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

export default CoursesSection