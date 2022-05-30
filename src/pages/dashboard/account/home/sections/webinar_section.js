import React, {useState, useEffect} from "react"
import {Row, Col} from "react-bootstrap"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from "react-router";
import ConfirmAction from "../../../../../components/confirm_action";

function WebinarSection(props) {
    let user = props.user
    let windowInfo = props.windowInfo
    let routes = props.routes
    let webinar = user.webinar
    let navigate = useNavigate()
    
    // section name
    const CREATED_SECTION = "created"
    const SAVED_SECTION = "saved"

    const [section, setSection] = useState(CREATED_SECTION)
    const [confirmInfo, setConfirmInfo] = useState({confirm: undefined, refute: undefined})
    const [firstLoad, setFirstLoad] = useState(true)

    // opens create webinar page
    function createWebinarPage() {
        navigate(routes.webinar_creation.path)
    }

    useEffect(() => {   
        if(firstLoad && webinar != undefined) {
            if(user && user.canI("create_webinar")) webinar.loadCreatedWebinar()
            webinar.loadSavedWebinar()
            setFirstLoad(false)
        }
    }, [webinar])

    useEffect(() => {
        if(user) {
            if(!user.canI("create_webinar")) navigate(routes.home.path)
        }
    }, [user])
    

    return <div id="webinar_section">
        <div className="space_between">
            <h2>Webinar</h2>
            {
                user && user.canI("create_webinar") ?
                    <div className="centered">
                        <AddCircleIcon className="orange_icon" onClick={createWebinarPage}/>
                    </div> :
                    ""
            }
        </div>
        <Col md="6" className="mx-auto">
            <div className="search_bar mt-4">
                <input placeholder="Cerca..."/>
            </div>
        </Col>
        <div className="items_container">
            {
                !windowInfo.mobileMode ?
                    <div className="header">
                        <Row>
                            <Col md="3">
                                <h6>Titolo</h6>
                            </Col>
                            <Col md="3">
                            </Col>
                            <Col md="3">
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
                    webinar && Object.values(webinar.getSavedWebinar()).map((item) => <ListItem confirmInfo={{ confirmInfo: confirmInfo, setConfirmInfo: setConfirmInfo}} content={item} webinarList={webinar} routes={routes}/>)
                    : section == CREATED_SECTION ?
                    webinar && Object.values(webinar.getCreatedWebinar()).map((item) => <ListItem confirmInfo={{ confirmInfo: confirmInfo, setConfirmInfo: setConfirmInfo}} content={item} webinarList={webinar} routes={routes}/>)
                    : ""
                }
            </div>
        </div>
        <ConfirmAction action={confirmInfo} closeFunction={() => setConfirmInfo({confirm: undefined, refute: undefined})} />
    </div>
}

function ListItem(props) {
    let content = props.content
    let webinarList = props.webinarList
    let routes = props.routes
    let navigate = useNavigate()
    let {confirmInfo, setConfirmInfo} = props.confirmInfo

    function deleteWebinar(e) {
        e.stopPropagation()
        setConfirmInfo({
            confirm: () => webinarList.deleteWebinar(content),
            refute: undefined
        })
    }

    // opens create webinar page
    function editWebinar() {
        navigate(routes.webinar_creation.path, { state : { webinarId : content.getId() }})
    }

    return <div className="list_item bounce" onClick={editWebinar}>
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
                    <DeleteIcon className="orange_icon m-1" onClick={(e) => deleteWebinar(e)}/>
                    <EditIcon className="orange_icon m-1" />
                </div>
            </Col>
        </Row>
        <hr/>
    </div>
}

export default WebinarSection