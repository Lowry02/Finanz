import { LocalConvenienceStoreOutlined } from '@mui/icons-material'
import { TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CommentController from '../../controllers/comment_controller'
import DeleteIcon from '@mui/icons-material/Delete';

import "./style.css"

function Comments(props) {
    let content = props.content
    let addComment = props.addComment
    let removeComment = props.removeComment
    let loadMore = props.loadMore
    let noMore = props.noMore
    let user = props.user

    const [newComment, setNewComment] = useState(new CommentController())
    const [loading, setLoading] = useState(false)

    function handleNewComment() {
        if(newComment.getContent() != "") {
            newComment.setAuthor(user.getName() + " " + user.getSurname())
            newComment.setAuthorUsername(user.getUsername())
            setLoading(true)
            addComment(newComment.exportInfo())
            .then(() => setLoading(false))
            // newComment.setTitle("")
            newComment.setContent("")
        }
    }

    useEffect(() => {
        let today = new Date()
        let data_string = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear()
        newComment.setState(setNewComment)
        newComment.setDate(data_string)
    }, [])

    return (
        <div id="comments_section" className="mt-3">
            <h5 className="mb-3">Commenti</h5>
            {   content.length == 0 ?
                    <p style={{ fontWeight: 200 }}>Non ci sono commenti</p> :
                    content.map(
                    (comment) => 
                    <div className="comment_item">
                        <div className="title space_between">
                            <h6 className="info">{/*Pubblicato il {comment.getDate()} */}Di {comment.getAuthor()}</h6>
                            {/* <h6>{comment.getTitle()}</h6> */}
                            {
                                comment.getAuthorUsername() == user.getUsername() ? 
                                    <DeleteIcon className="orange_icon" onClick={() => removeComment(comment.getId())}/> : 
                                    ""
                            }
                        </div>
                        <p className="description m-0">{comment.getContent()}</p>
                        <hr />
                    </div>
                )
            }
            <br />
            {/* <TextField
            className="my_input"
            fullWidth={true}
            label="Facci sapere la tua"
            value={newComment.getTitle()}
            onChange={(e) => newComment.setTitle(e.target.value)}/> */}
            {
                !noMore ?
                    <div className="centered"><p style={{ color: "var(--details_color)"}} onClick={loadMore}>Mostra di più</p></div> :
                    ""
            }
            <TextField
            margin="normal"
            className="my_input"
            fullWidth={true}
            label="Aggiungi un commento"
            onKeyDown={(e) => e.key == "Enter" ? handleNewComment() : () => {}}
            value={newComment.getContent()}
            onChange={(e) => newComment.setContent(e.target.value)}/>
            {
                !loading ? 
                    <div className="centered">
                        <button className="button" onClick={handleNewComment}>Invia</button>
                    </div> : 
                    <div className="centered">
                        <div className="loading"></div>
                    </div> 
            }
        </div>
    )
}

export default Comments
