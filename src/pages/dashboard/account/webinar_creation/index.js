import React, {useEffect, useState} from 'react'
import { TextField } from '@mui/material'
import WebinarController from '../../../../controllers/webinar'
import imagePicker from "../../../../media/icons/image_picker.png"
import CloseIcon from '@mui/icons-material/Close';
import { Col } from "react-bootstrap"
import Popup from "../../../../components/popup"
import "./style.css"

function WebinarCreation(props) {
    const [content, setContent] = useState(new WebinarController())
    const [dateType, setDateType] = useState("date")
    const [popupContent, setPopupContent] = useState()

    function loadWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            let reader = new FileReader();
            reader.onload = function(){
                let dataURL = reader.result
                content.setWallpaper(dataURL)
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function closePopup() {
        setPopupContent()
    }

    function publish() {
        let isError = content.checkContentValidity()
        setPopupContent(isError)
        if(!isError['error']) {
            // TODO: pubblica
        }
    }

    useEffect(() => { 
        content.setState(setContent)
    }, [])

    useEffect(() => {
        console.log(content.webinar)
    }, [content])
    
    
  return (
    <div id="webinar_creation" className="container">
        <div className="wallpaper_container block">

        {
            content != undefined && content.getWallpaper() != "" ?
            <>
            <img src={content.getWallpaper()} className="wallpaper"/>
            <CloseIcon
            className="remove_wallpaper bounce"
            onClick={() => content.setWallpaper("")}/>
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
                onFocus={() => setDateType('date')}
                onBlur={() => setDateType('text')}
                placeholder="Data"
                value={content.getDate()}
                onChange={(e) => content.setDate(e.target.value)}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Titolo"
                fullWidth={true}
                variant="outlined"
                value={content.getTitle()}
                onChange={(e) => content.setTitle(e.target.value)}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Descrizione"
                fullWidth={true}
                variant="outlined"
                value={content.getDescription()}
                onChange={(e) => content.setDescription(e.target.value)}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Autori"
                fullWidth={true}
                variant="outlined"
                value={content.getAuthors()}
                onChange={(e) => content.setAuthors(e.target.value)}/>
            <br/>
            <br/>
            <div className="text-center">
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