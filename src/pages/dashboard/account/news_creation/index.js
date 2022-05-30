import React, {useState, useEffect, useRef} from 'react'
import {Row, Col} from "react-bootstrap"
import MultipleChoicesQuestion from "../../../../components/multiple_choice_question"
import imagePicker from "../../../../media/icons/image_picker.png"
import CreateNewsController from '../../../../controllers/create_news_controller'
import x_icon from "../../../../media/icons/x.png"
import MarkupEditor from "../../../../components/markup_editor"
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useLocation, useNavigate } from 'react-router'
import { TextField } from '@mui/material'
import EditCategories from '../edit_categories'
import Popup from "../../../../components/popup"
import TagListController from '../../../../controllers/tags_list'
import { Select, MenuItem, Checkbox, ListItemText } from '@material-ui/core'

import "./style.css"
import ImageLink from '../../../../components/image_link'

function NewsCreation(props) {
    let user = props.user
    let routes = props.routes

    const [content, setContent] = useState(new CreateNewsController())
    const [tagList, setTagList] = useState(new TagListController())
    const [tagPerNews, setTagPerNews] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [popupContent, setPopupContent] = useState()
    const { state } = useLocation()
    let navigate = useNavigate()

    function loadWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            let reader = new FileReader();
            reader.onload = function(){
                let dataURL = reader.result
                content.news.setWallpaper(dataURL)
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function closePopup() {
        setPopupContent()
    }

    function publish() {
        let isError = content.isContentValid()
        if(isError.error) {
            if(popupContent != undefined) {
                setPopupContent()
                setTimeout(() => setPopupContent(isError), 100)
                
            } else {
                setPopupContent(isError)
            }
        } else {
            setPopupContent({error : false, message : "Pubblicazione in corso..."})
            content.publish().then(() => setPopupContent({error: false, message: "Pubblicazione completata"}))
                             .catch(() => setPopupContent({error: true, message: "Errore"}))
        }
    }

    function linkTagToNews(tag, link) {
          if(link) {
            setTagPerNews([...tagPerNews, tag])
            tag.linkTagToNews(content.news.getId())
          }
          else {
            let index = tagPerNews.map(item => item.getId()).indexOf(tag.id)
            if(index >= 0) {
              tagPerNews.splice(index, 1)
              setTagPerNews([...tagPerNews])
            }
            tag.unlinkTagToNews(content.news.getId())
          }
      }

    // manage news loading
    useEffect(async () => {
        content.setState(setContent)
        tagList.setState(setTagList)
        content.loadCategories()
        tagList.loadTags()
        if(state != null) {
            let newsInfo = state['news']
            let slug = newsInfo['id']
            content.news.loadById(slug)
            setTagPerNews(await tagList.getTagPerNews(slug))
        }
    }, [])    

    // checking roles
    useEffect(() => {
        if(user) {
            if(!user.canI("create_news")) navigate(routes.home.path)
        }
    }, [user])

    return (
        <div className="creation" id="news_creation">
            <div className="wallpaper_container block">
                {
                    content.news.getWallpaper() ?
                    <>
                        <div id="remove_wallpaper" className="bounce" onClick={() => content.news.setWallpaper("")}>
                            <img src={x_icon} className="img-fluid"/>
                        </div>
                        <img id="wallpaper_img" src={content.news.getWallpaper()} />
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
                                value={content.news.getTitle()}
                                onChange={(e) => content.news.setTitle(e.target.value)}/>
                            <TextField
                                className="my_input"
                                margin="normal"
                                fullWidth={true}
                                multiline={true}
                                label="Descrizione"
                                variant="outlined"
                                value={content.news.getDescription()}
                                onChange={(e) => content.news.setDescription(e.target.value)}/>
                        </div>
                        <br />
                        <MarkupEditor
                        content={content.news.getContent()}
                        setContent={(value) => content.news.setContent(value)}/>
                        <br />
                    </div>
                </Col>
                <Col md="3">
                    <div className="info_container block">
                        <h5>Informazioni news</h5>
                        <br />
                        <h6>Tag</h6>
                        {
                            content.news.getId() == "" ? 
                            <p className="m-0">Per collegare i tag devi prima pubblicare la news</p> : 
                            <Select renderValue={(selected) => selected.map(item => item.getName()).join(', ')} multiple value={tagPerNews} variant="standard" className="input" label="Tag">
                            {
                                tagList.getList().map(tag => (
                                <MenuItem onClick={() => linkTagToNews(tag, !tagPerNews.map(item => item.getId()).includes(tag.getId()))}>
                                    <Checkbox className="orange_icon" checked={tagPerNews.map(item => item.getId()).includes(tag.getId())} />
                                    <ListItemText primary={tag.getName()} />
                                </MenuItem>
                                ))
                            }
                            </Select>
                        }
                        <br />
                        <hr/>
                        <div className="space_between">
                            <h6 className="mb-4">Categoria</h6>
                            {
                                user && Object.values(user.getRole()).map((item) => item['slug']).includes("super-admin") ||
                                user && Object.values(user.getRole()).map((item) => item['slug']).includes('super-admin-news') ?
                                    <ModeEditIcon
                                    className="orange_icon"
                                    onClick={() => setDialogOpen(true)}/> : 
                                    ""
                            }
                        </div>
                        <MultipleChoicesQuestion question={content.getCategories()}/> 
                        {
                            user && Object.values(user.getRole()).map((item) => item['slug']).includes("super-admin") ||
                            user && Object.values(user.getRole()).map((item) => item['slug']).includes('super-admin-news') ?
                                <EditCategories
                                    content={content.getCategories()}
                                    isOpen={dialogOpen}
                                    onDelete={content.deleteCategory}
                                    onCreation={(title) => content.createCategory(title)}
                                    onUpdate={(slug, title) => content.createCategory(title)}
                                    setIsOpen={setDialogOpen}
                                    showDescription={false}/> : 
                                    ""
                        }
                        <hr/>
                        <button className="button" onClick={publish}>Pubblica</button>
                    </div>
                    <br/>
                    <ImageLink />
                </Col>
            </Row>
            {
                popupContent != null ?
                <Popup isError={popupContent['error']}  message={popupContent['message']} removeFunction={closePopup} /> :
                ""
            }
        </div>
    )
}


export default NewsCreation
