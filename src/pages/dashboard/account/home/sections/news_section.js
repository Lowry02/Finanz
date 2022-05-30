import React, {useState, useEffect, useRef} from "react"
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
import { Tab, Tabs } from "@material-ui/core";
import ConfirmAction from "../../../../../components/confirm_action";
import { default as external_routes } from "../../../routes"

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
    const [confirmInfo, setConfirmInfo] = useState({confirm: undefined, refute: undefined})

    const loaderElement = useRef()
    const observer = useRef(new IntersectionObserver(() => {}))
    
    // handle edit and delete
    function handleEdit(e, item) {
        if(section == CREATED_SECTION) navigate(routes.news_creation.path, { state : {news : item}})
        else if(section == SAVED_SECTION) navigate(external_routes.single_news.path + item.id)
    }

    function handleDelete(e, id) {
        e.stopPropagation()
        setConfirmInfo({
            confirm: () => {
                if(section == CREATED_SECTION) news.removeNews(id, news.CREATED_NEWS_TAG)
                else if(section == SAVED_SECTION) news.removeNews(id, news.SAVED_NEWS_TAG)
            },
            refute: undefined
        })
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

    useEffect(() => {
        observer.current.disconnect()

        if(loaderElement.current != undefined) {
            observer.current = new IntersectionObserver((e) => {
                let info = e[0]
                if(info['isIntersecting']) {
                    if(section == CREATED_SECTION && user && user.canI("create_news")) news.loadCreatedNews()
                    else if(section == SAVED_SECTION) news.loadSavedNews()
                }
            })
    
            observer.current.observe(loaderElement.current)
        }
    }, [section, news.getSavedNews(), news.getCreatedNews()])

    return <div id="news_section">
        <div className="space_between">
            <h2>News</h2>
            {
                user && user.canI("create_news") ?
                    <div className="centered">
                        <AddCircleIcon className="orange_icon" onClick={createNewNews}/>
                    </div> :
                    ""
            }
        </div>
        <br/>

        <Col md="6" className="mx-auto">
            <div className="search_bar">
                <input className="my_input" placeholder="Cerca..."/>
            </div>
        </Col>
        <Tabs value={section} onChange={(e, newValue) => setSection(newValue)} scrollButtons="auto" centered>
            <Tab label="Salvate" value={SAVED_SECTION}/>
            { user && user.canI("create_news") ? <Tab label="Create" value={CREATED_SECTION} /> : ""}
        </Tabs>
        
        <div className="items_container" id="new_continer">
            {
                !windowInfo.mobileMode ? 
                    <div className="header">
                        {
                            section == SAVED_SECTION ?
                            <Col md="12">
                                <h6>Titolo</h6>
                            </Col> : 
                            <Row>
                                <Col md="4">
                                    <h6>Titolo</h6>
                                </Col>
                                <Col md="4">
                                    <h6>Data</h6>
                                </Col>
                                <Col md="4">
                                    <h6>Modifica</h6>
                                </Col>
                            </Row>
                        }
                    </div> :
                    ""
            }
            <hr/>
            <div className="list" >
                {
                    section == SAVED_SECTION ?
                    news && Object.values(news.getSavedNews()).map((item) => <ListItem section={section} tag={{createdTag: CREATED_SECTION, savedTag: SAVED_SECTION}} content={item} handleDelete={handleDelete} handleEdit={handleEdit}/>)
                    : section == CREATED_SECTION ?
                    news && Object.values(news.getCreatedNews()).map((item) => <ListItem section={section}content={item} tag={{createdTag: CREATED_SECTION, savedTag: SAVED_SECTION}} handleDelete={handleDelete} handleEdit={handleEdit}/>)
                    : ""
                }
                {
                    section == CREATED_SECTION && news.created_news_index == null ?
                    "" :
                    section == SAVED_SECTION && news.saved_news_index == null ?
                    "" :
                    <div className="centered">
                        <div ref={loaderElement} className="loading"></div>
                    </div>
                }
            </div>
        </div>
        <ConfirmAction action={confirmInfo} closeFunction={() => setConfirmInfo({confirm: undefined, refute: undefined})} />
    </div>
}

function ListItem(props) {
    let content = props.content
    let deleteItem = props.handleDelete
    let editItem = props.handleEdit
    let section = props.section
    let {createdTag, savedTag} = props.tag

    return <div className="list_item bounce" onClick={(e) => editItem(e, content.exportInfo())}>
        {
            section == createdTag ?
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
                        <div className="display_inline text-right">
                            <DeleteIcon
                            onClick={(e) => deleteItem(e, content.getId())} 
                            className="orange_icon m-1" />
                            <EditIcon className="orange_icon m-1" />
                        </div>
                    </Col>
                </Row> :
            section == savedTag ? 
                <p className="title">{content && content.getTitle()}</p> : 
                ""
        }
        <hr/>
    </div>
}

export default NewsSection