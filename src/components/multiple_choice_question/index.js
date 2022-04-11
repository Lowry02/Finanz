import React, { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'

import "./style.css"

function MultipleChoiceQuestion(props) {
    let deletable = props.deletable     //in this case question is a QuestionCreatorControllor
                                        // otherwise a QuestionController
    let question = deletable ? props.question.question : props.question
    let questionCreator = deletable ? props.question : null

    function addRemoveChoice(id) {
        if(question.isChoiceSelected(id)) question.removeSelectedChoice(id)
        else question.addSelectedChoice(id)
    }

    function handleDelete(e, id) {
        e.stopPropagation()
        questionCreator.deleteItem(id)
    }

    return (
        <div>
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
                                            <p className="mb-0">{question.getChoices()[id]['title']}</p>
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
        </div>
    )
}

export default MultipleChoiceQuestion
