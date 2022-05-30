import React, {useState, useEffect} from 'react'
import { Col } from "react-bootstrap"
import Comments from '../../../components/comments'
import { Fade, Skeleton } from '@mui/material'
import NewsController from '../../../controllers/news_controller'
import { Navigate, useNavigate, useParams } from 'react-router'
import RichTextEditor from 'react-rte';
import "./style.css"
import { Container } from '@material-ui/core'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import routes from '../routes'

function SingleNews(props) {
    let user = props.user
    let { id } = useParams()
    let navigate = useNavigate()

    const [content, setContent] = useState(new NewsController())
    const [loading, setLoading] = useState(true)

    function saveNews() {
        if(!content.getIsSaved()) content.saveNews()
        else content.unsaveNews()
        content.setIsSaved(!content.getIsSaved())
    }

    function likeNews() {
        if(!content.getIsLiked()) content.likedNews()
        else content.unlikeNews()
        content.setIsLiked(!content.getIsLiked())
    }

    useEffect(async () => {
        content.setState(setContent)
        try {
            await content.loadById(id)
        } catch {
            navigate(routes.single_news.path)
        }

        setLoading(false)
        content.loadComments(id)
    }, [])

    useEffect(() => {
        if(content != undefined) content.setState(setContent)
    }, [content])

    return (
        <>
        {
            content == undefined ?
            "" :
            !loading ? 
                <Fade in={true}>
                    <div id="single_news">
                        <div className="wallpaper_container block">
                            {
                                !loading ? 
                                    <img 
                                    className="wallpaper"
                                    src={content.getWallpaper()}/> :
                                    ""
                            }
                        </div>
                        <br/>
                        <Col md="6 mx-auto">
                            <h1 className="title">{content.getTitle()}</h1>
                        </Col>
                        <Col md="8 mx-auto">
                            <div className="display_inline details_container mb-3 mt-2">
                                <div className="orange_rect">
                                    <h6>Di {content.getAuthor()}</h6>
                                </div>
                                <div className="orange_rect">
                                    <h6>{content.getPublishDate()}</h6>
                                </div>
                            </div>
                            <p className="description">{content.getDescription()}</p>
                        </Col>
                        <Col md="8 mx-auto text-center">
                            {
                                content.getIsLiked() ?
                                <FavoriteIcon onClick={likeNews} className="orange_icon bounce m-2" />:
                                <FavoriteBorderIcon onClick={likeNews} className="orange_icon bounce m-2" />
                            }
                            {
                                content.getIsSaved() ?
                                <PlaylistAddCheckIcon onClick={saveNews} className="orange_icon bounce m-2" /> :
                                <PlaylistAddIcon onClick={saveNews} className="orange_icon bounce m-2" />

                            }
                        </Col>
                        <Col md="8 mx-auto">
                            <hr />  
                            <div
                            style={{ fontWeight: 200 }}
                            dangerouslySetInnerHTML={{__html: RichTextEditor.createValueFromString(content.getContent(), 'markdown').toString("html")}}></div>
                            <hr />
                            <Comments
                            content={content.getComments()}
                            addComment={(content.addComment).bind(content)}
                            removeComment={(content.removeComment).bind(content)}
                            loadMore={() => content.loadComments(id)}
                            noMore={content.news.getCommentPageIndex() == null}
                            user={user}/>
                        </Col>
                    </div>
                </Fade> :
                <Container>
                    <Skeleton height={"300px"} />
                    <Skeleton height={"50px"} />
                    <Skeleton height={"50px"} />
                    <Skeleton height={"50px"} />
                    <Skeleton height={"50px"} />
                    <Skeleton height={"50px"} />
                    <Skeleton height={"50px"} />
                    <Skeleton height={"50px"} />
                </Container>
        }
        </>
       
    )
}

export default SingleNews
