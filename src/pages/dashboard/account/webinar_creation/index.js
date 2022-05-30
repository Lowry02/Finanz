import React, {useEffect, useState} from 'react'
import { TextField } from '@mui/material'
import imagePicker from "../../../../media/icons/image_picker.png"
import CreateWebinarController from '../../../../controllers/create_webinar_controller';
import CloseIcon from '@mui/icons-material/Close';
import { Row, Col } from "react-bootstrap"
import Popup from "../../../../components/popup"
import { Checkbox } from '@mui/material';
import "./style.css"
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';

function WebinarCreation(props) {
    const [content, setContent] = useState(new CreateWebinarController())
    const [dateType, setDateType] = useState("text")
    const [popupContent, setPopupContent] = useState()

    let { state } = useLocation()
    let navigate = useNavigate()

    let user = props.user
    let routes = props.routes

    function loadWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            let reader = new FileReader();
            reader.onload = function(){
                let dataURL = reader.result
                content.webinar.setWallpaper(dataURL)
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function closePopup() {
        setPopupContent()
    }

    function publish() {
        let isError = content.webinar.checkContentValidity()
        if(!isError['error']) {
            setPopupContent({error: false, message: "Pubblicazione in corso..."})
            content.publish(setPopupContent(isError))
            .then(() => setPopupContent({error: false, message: "Pubblicazione completata"}))
            .catch((error) => {
                console.warn(error)
                setPopupContent({error: true, message: "Errore, riprovare"})
            })
        } else {
            setPopupContent(isError)
        }
    }

    useEffect(() => { 
        content.setState(setContent)
        if(state != undefined) {
            let webinarId = state['webinarId']
            content.webinar.loadById(webinarId)
        }
    }, [])

    useEffect(() => {
        if(user) {
            if(!user.canI("create_webinar")) navigate(routes.home.path)
        }
    }, [user])
    
    
  return (
    <div id="webinar_creation" className="container">
        <div className="wallpaper_container block">
        {
            content != undefined && content.webinar.getWallpaper() != "" ?
            <>
            <img src={content.webinar.getWallpaper()} className="wallpaper"/>
            <CloseIcon
            className="remove_wallpaper bounce"
            onClick={() => content.webinar.setWallpaper("")}/>
            </> : 
            <>
                <label className="select_wallpaper" htmlFor="wallpaper_input">
                    <img src={imagePicker} className="img-fluid bounce wallpapaer_picker_image" />
                </label>
                <input
                id="wallpaper_input"
                accept="image/*"
                type="file"
                onChange={(e) => loadWallpaper(e)}/>
            </>
        }
        </div>
        <Col md="8" className="mx-auto">
            <br/>
            <input
                className="input"
                type={dateType}
                onFocus={() => setDateType('datetime-local')}
                onBlur={() => setDateType('text')}
                placeholder="Data"
                value={content.webinar.getDate()}
                onChange={(e) => content.webinar.setDate(e.target.value)}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Titolo"
                fullWidth={true}
                variant="outlined"
                value={content.webinar.getTitle()}
                onChange={(e) => content.webinar.setTitle(e.target.value)}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Descrizione"
                fullWidth={true}
                variant="outlined"
                value={content.webinar.getDescription()}
                onChange={(e) => content.webinar.setDescription(e.target.value)}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Id evento"
                fullWidth={true}
                variant="outlined"
                value={content.webinar.getEventId()}
                onChange={(e) => content.webinar.setEventId(e.target.value)}/>
            <Row>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Società"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getSociety()}
                    onChange={(e) => content.webinar.setSociety(e.target.value)}/>
                </Col>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Link società"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getSocietyLink()}
                    onChange={(e) => content.webinar.setSocietyLink(e.target.value)}/>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Ospite"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getGuest()}
                    onChange={(e) => content.webinar.setGuest(e.target.value)}/>
                </Col>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Link ospite"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getGuestLink()}
                    onChange={(e) => content.webinar.setGuestLink(e.target.value)}/>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Iframe video finale"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getFinalVideoIframe()}
                    onChange={(e) => content.webinar.setFinalVideoIFrame(e.target.value)}/>
                </Col>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Id video finale"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getFinalVideoId()}
                    onChange={(e) => content.webinar.setFInalVideoId(e.target.value)}/>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Iframe video"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getEventVideoIframe()}
                    onChange={(e) => content.webinar.setEventVideoIframe(e.target.value)}/>
                </Col>
                <Col md="6">
                    <TextField
                    className="my_input"
                    margin="normal"
                    label="Chat iframe"
                    fullWidth={true}
                    variant="outlined"
                    value={content.webinar.getEventChatIframe()}
                    onChange={(e) => content.webinar.setEventChatIframe(e.target.value)}/>
                </Col>
            </Row>
            <br/>
            <br/>
            <div className="text-center">
                <Checkbox className="orange_icon" checked={content.webinar.getIsFree()} value={content.webinar.getIsFree()} onChange={() => content.webinar.setIsFree(!content.webinar.setIsFree())}/>Free <br/>
                <button className="button bounce" onClick={publish}>Pubblica</button>
            </div>
        </Col>
        {
            popupContent ? 
            <Popup isError={popupContent['error']} message={popupContent['message']} removeFunction={closePopup}/> :
            ""
        }
    </div>
  )
}

export default WebinarCreation