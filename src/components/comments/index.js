import { TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CommentController from '../../controllers/comment_controller'

import "./style.css"

function Comments(props) {
    let content = props.content
    let addComment = props.addComment
    let removeComment = props.removeComment
    let user = props.user

    const [newComment, setNewComment] = useState(new CommentController())

    function handleNewComment() {
        if(newComment.getTitle() != "") {
            addComment(newComment.exportInfo())
            newComment.setTitle("")
            newComment.setContent("")
        }
    }

    useEffect(() => {
        let today = new Date()
        let data_string = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear()
        newComment.setState(setNewComment)
        newComment.setAuthor(user.getName() + " " + user.getSurname())
        newComment.setDate(data_string)
    }, [])

    return (
        <div id="comments_section" className="mt-3">
            <h5 className="mb-3">Commenti</h5>
            {
                    content.map(
                    (comment) => 
                    <div className="comment_item">
                        <div className="title">
                            <h6>{comment.getTitle()}</h6>
                            <p className="info">Pubblicato il {comment.getDate()} da {comment.getAuthor()}</p>
                        </div>
                        <p className="description">{comment.getContent()}</p>
                        <hr />
                    </div>
                )
            }
            <br />
            <TextField
            className="my_input"
            fullWidth={true}
            label="Facci sapere la tua"
            value={newComment.getTitle()}
            onChange={(e) => newComment.setTitle(e.target.value)}/>
            <TextField
            margin="normal"
            className="my_input"
            fullWidth={true}
            label="Aggiungi una descrizione"
            value={newComment.getContent()}
            onChange={(e) => newComment.setContent(e.target.value)}/>
            <div className="centered">
                <button className="button" onClick={handleNewComment}>Invia</button>
            </div>
        </div>
    )
}

export default Comments
