import React, {useState, useEffect} from "react"
import { Navigate, useNavigate } from "react-router";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from "@mui/material";
import Select from '@mui/material/Select';
import {Row, Col} from "react-bootstrap"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import $ from "jquery"

function NewsSection(props) {
    let windowInfo = props.windowInfo
    let user = props.user
    let news = user.news
    let routes = props.routes
    let navigate = useNavigate()
    
    // section name
    const CREATED_SECTION = "created"
    const SAVED_SECTION = "saved"

    const [section, setSection] = useState(SAVED_SECTION)
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {   
        if(firstLoad && news != undefined) {
            news.loadSavedNews()
            news.loadCreatedNews(3)
            setFirstLoad(false)
        }
    }, [news])
    
    // handle edit and delete
    function handleEdit(e, item) {
        navigate(routes.news_creation.path, { state : {news : item}})
    }

    function handleDelete(e, id) {
        e.stopPropagation()
        if(section == CREATED_SECTION) news.removeNews(id, news.CREATED_NEWS_TAG)
        else if(section == SAVED_SECTION) news.removeNews(id, news.SAVED_NEWS_TAG)
    }

    // opens create news page
    function createNewNews() {
        navigate(routes.news_creation.path)
    }

    // used to load modules automatically on scroll
    async function manageInfiniteScroll(e) {
        let list = e.target
        let listScrollHeight = list.clientHeight
        let listOffsetTop = $('#new_continer').offset().top
        let lastElementOffsetTop = $('#new_continer .list_item').last().offset().top

        if(lastElementOffsetTop < listOffsetTop + listScrollHeight) {
            await news.loadCreatedNews() // TODO: change in base of section name
        }
    }

    return <div id="news_section">
        <div className="space_between">
            <h2>News</h2>
            <div className="centered">
                <AddCircleIcon className="orange_icon" onClick={createNewNews}/>
            </div>
        </div>
        <br/>
        {
            !windowInfo.mobileMode ?
                <Row >
                    <Col md="6">
                        <div className="search_bar mt-4">
                            <input placeholder="Cerca..."/>
                        </div>
                    </Col>
                    <Col md="6">
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
                            </Select>
                        </FormControl>
                    </Col>
                </Row> : 
                <div>
                    <div className="search_bar">
                        <input className="my_input" placeholder="Cerca..."/>
                    </div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, width: "100%"}}>
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
        }
        
        
        <div className="items_container" id="new_continer">
            {
                !windowInfo.mobileMode ? 
                    <div className="header">
                        <Row>
                            <Col md="4">
                                <h6>Titolo</h6>
                            </Col>
                            <Col md="4">
                                <h6>Data</h6>
                            </Col>
                            {/* <Col md="3">
                                <h6>Categoria</h6>
                            </Col> */}
                            <Col md="4">
                                <h6>Modifica</h6>
                            </Col>
                        </Row>
                    </div> :
                    ""
            }
            <hr/>
            <div className="list" onScroll={manageInfiniteScroll}>
                {
                    section == SAVED_SECTION ?
                    news && Object.values(news.getSavedNews()).map((item) => <ListItem content={item} handleDelete={handleDelete} handleEdit={handleEdit}/>)
                    : section == CREATED_SECTION ?
                    news && Object.values(news.getCreatedNews()).map((item) => <ListItem content={item} handleDelete={handleDelete} handleEdit={handleEdit}/>)
                    : ""
                }
            </div>
        </div>
    </div>
}

function ListItem(props) {
    let content = props.content
    console.log(content)
    let deleteItem = props.handleDelete
    let editItem = props.handleEdit

    return <div className="list_item bounce" onClick={(e) => editItem(e, content.exportInfo())}>
        <Row>
            <Col md="4">
                <p className="title">{content && content.getTitle()}</p>
            </Col>
            <Col md="4">
                <p className="date">{content && content.getPublishDate()}</p>
            </Col>
            {/* <Col md="3">
                <p className="category">{content && content.getCategory()}</p>
            </Col> */}
            <Col md="4">
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

export default NewsSection