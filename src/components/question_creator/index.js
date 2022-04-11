import React, {useEffect, useState} from 'react'
import MultipleChoiceQuestion from '../multiple_choice_question'
import { TextField } from '@mui/material'
import imagePicker from "../../media/icons/image_picker.png"
import CloseIcon from '@mui/icons-material/Close';

import "./style.css"

function QuestionCreator(props) {
    let questionCreator = props.question
    const [newAnswer, setNewAnswer] = useState("")

    function addAnswer(e) {
        if(e.key == "Enter" && newAnswer != "") {
            questionCreator.question.addChoice(newAnswer)
            setNewAnswer("")
        }
    }

    function loadWallpaper(e) {
        if(e != undefined) {
            let input = e.target
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function(){
                let dataURL = reader.result
                questionCreator.question.setImage(dataURL)
            }
        }
    }

    return (
        <div className="question_creator">
            <p>Immagine quiz(opzionale)</p>
            <div className="block image_container text-center">
                {
                    questionCreator.question.getImage() ?
                    <>
                        <div className="remove_wallpaper bounce" onClick={() => questionCreator.question.setImage("")}>
                            <CloseIcon />
                        </div>
                        <img className="image" src={questionCreator.question.getImage()} />
                    </> :
                    <>
                        <label className="select_image mx-auto" htmlFor="select_image_input">
                            <img src={imagePicker} className="img-fluid bounce" style={{ width: "100px"}} />
                        </label>
                        <input
                        id="select_image_input"
                        accept="image/*"
                        type="file"
                        onChange={(e) => loadWallpaper(e)}/>
                    </>
                }
            </div>
            <TextField
                className="my_input"
                margin="normal"
                label="Domanda"
                fullWidth={true}
                variant="outlined"
                value={questionCreator.question.getTitle()}
                onChange={(e) => questionCreator.question.setTitle(e.target.value)}/>
            <br />
            <br />
            <MultipleChoiceQuestion 
            question={questionCreator}
            deletable={true}/>
            <TextField
                className="my_input"
                margin="normal"
                label="Nuova Risposta"
                fullWidth={true}
                variant="outlined"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                onKeyDown={(e) => addAnswer(e)}/>

        </div>
    )
}

export default QuestionCreator
