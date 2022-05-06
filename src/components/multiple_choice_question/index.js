import React, { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Fade, IconButton } from '@mui/material'

import "./style.css"

function MultipleChoiceQuestion(props) {
    let deletable = props.deletable     //in this case question is a QuestionCreatorControllor
                                        // otherwise a QuestionController
    let question = deletable ? props.question.question : props.question
    let questionCreator = deletable ? props.question : null

    const [correctAnswer, setCorrectAnswer] = useState({isCorrect: false, message: ""})
    const [answerGiven, setanswerGiven] = useState(false)

    async function addRemoveChoice(id) {
        if(question.isChoiceSelected(id)) question.removeSelectedChoice(id)
        else {
            question.addSelectedChoice(id)
            if(!deletable) {
                // send user answer
                let isCorrect = await question.sendUserAnswer(id)
                setCorrectAnswer({isCorrect: isCorrect, message: question.getChoices()[id]['description']})
                setanswerGiven(true)
                setTimeout(() => setanswerGiven(false), 4000)
            }
        }
    }

    function handleDelete(e, id) {
        e.stopPropagation()
        questionCreator.deleteItem(id)
    }

    useEffect(() => {
        setanswerGiven(false)
    }, [question])
    

    return (
        <div className={!deletable ? "multiple_choice centered" : "multiple_choice"}>
            {!deletable ? <p>{question.getTitle()}</p> : ""}
            {
                Object.keys(question.getChoices()).map((id) => 
                    <div key={id}>
                        <div className="choice mb-3 max_width" onClick={() => addRemoveChoice(id)}>
                            {
                                deletable ? 
                                <>
                                    <div className="display_inline max_width">
                                        <div className={"tick " + (question.isChoiceSelected(id) ? "selected" : "")}></div>
                                        {
                                            typeof question.getChoices()[id] == "string" ?
                                            <p className="mb-0">{question.getChoices()[id]}</p> :
                                            <div>
                                                <p className="mb-0">{question.getChoices()[id]['title']}</p>
                                                <p className="mb-0 thin">{question.getChoices()[id]['description']}</p>
                                            </div>
                                        }
                                        <IconButton className="m-0 p-0" onClick={(e) => handleDelete(e, id)}>
                                            <DeleteIcon className="orange_icon"/>
                                        </IconButton>
                                    </div>
                                </> :
                                <>
                                    <div className={"tick " + (question.isChoiceSelected(id) ? "selected" : "")}></div>
                                    {
                                        typeof question.getChoices()[id] == "string" ?
                                        <p className="mb-0">{question.getChoices()[id]}</p> :
                                        <p className="mb-0">{question.getChoices()[id]['title']}</p>
                                    }
                                </>
                            }
                        </div>
                    </div>
                )
            }
            {
                !deletable && answerGiven ?
                <Fade in={!deletable && answerGiven} style={{ transitionDuration: "800ms" }}>
                    <div className="verify_answer">
                        <h1>{ correctAnswer['isCorrect'] ? "Corretto!" : "Errato!" }</h1>
                        <p>{correctAnswer['message']}</p>
                    </div>
                </Fade> :
                ""
            }
        </div>
    )
}

export default MultipleChoiceQuestion
