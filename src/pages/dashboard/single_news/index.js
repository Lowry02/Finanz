import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import { Col } from "react-bootstrap"

import "./style.css"
import Comments from '../../../components/comments'
import { Fade } from '@mui/material'

function SingleNews(props) {
    let user = props.user
    let { id } = useParams()

    const [content, setContent] = useState(undefined)

    useEffect(() => {
        if(user != undefined && content == undefined) {
            setContent(user.news.getNewsById(id))
        }
    }, [user])

    useEffect(() => {
        if(content != undefined)
            content.setState(setContent)
    }, [content])

    return (
        <>
        {
            content == undefined ?
            "" :
            <Fade in={true}>
            <div id="single_news">
                <div className="wallpaper_container block">
                    <img 
                    className="wallpaper"
                    src={content.getWallpaper()}/>
                </div>
                <br/>
                <Col md="6 mx-auto">
                    <h1 className="title">{content.getTitle()}</h1>
                </Col>
                <Col md="8 mx-auto">
                    <div className="display_inline details_container mb-3 mt-2">
                        <div className="orange_rect">
                            <h6>{content.getAuthor()}</h6>
                        </div>
                        <div className="orange_rect">
                            <h6>{content.getCategory()}</h6>
                        </div>
                        <div className="orange_rect">
                            <h6>{content.getPublishDate()}</h6>
                        </div>
                    </div>
                    <p className="description">{content.getDescription()}</p>
                </Col>
                <Col md="8 mx-auto">
                    <hr />  
                    <ReactMarkdown>
                        # Titolo Markdown
                    </ReactMarkdown>
                    <hr />
                    <Comments
                    content={content.getComments()}
                    addComment={(content.addComment).bind(content)}
                    removeComment={(content.removeComment).bind(content)}
                    user={user}/>
                </Col>
            </div>
            </Fade>
        }
        </>
       
    )
}

export default SingleNews
