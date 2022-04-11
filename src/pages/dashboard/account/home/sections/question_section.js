import React, { useState, useEffect } from 'react'
import QuestionCreator from '../../../../../components/question_creator'
import ScrollContainer from '../../../../../components/scroll_container'
import LoginQuestionController from '../../../../../controllers/login_questions_controller'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@material-ui/core';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

function QuestionSection() {
  const [content, setContent] = useState(new LoginQuestionController())

  function handleOnDragEnd(result) {
    let list = content.getList()
    const [reorderedItem] = list.splice(result.source.index, 1)
    list.splice(result.destination.index, 0, reorderedItem)
    content.setList(list)
  }

  useEffect(() => {
    content.setState(setContent)
    content.addQuestion()
    content.addQuestion()
    content.addQuestion()
  }, [])
  
  return (
    <div id="question_section">
        <h2>Domande</h2>
        <p className="thin">Crea e gestisci le domande d'iscrizione.</p>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="list">
            {
              (provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {
                    content && content.getList().map(
                      (item, i) => 
                                <Draggable key={i} draggableId={i.toString()} index={i} >
                                  {
                                    (innerProvided) => 
                                          <div {...innerProvided.draggableProps} {...innerProvided.dragHandleProps} ref={innerProvided.innerRef} className="block m-3">
                                            <div className="space_between header">
                                              <div className="display_inline">
                                                {/* <div>
                                                  <ArrowDropUpIcon className="orange_icon"/>
                                                  <br/>
                                                  <ArrowDropDownIcon className="orange_icon"/>
                                                </div> */}
                                                <h5 className="m-0">Domanda {item.question.getId()}</h5>
                                              </div>
                                              <DeleteIcon onClick={() => content.removeQuestion(item)} className="orange_icon"/>
                                            </div>
                                            <QuestionCreator question={item}/>
                                          </div>
                                  }
                                </Draggable>
                  )}
                  {provided.placeholder}
                </div>
              )
            }
        </Droppable>
        </DragDropContext>
        <div className="centered">
          <p onClick={() => content.addQuestion()}><AddCircleIcon className=""/> Aggiungi</p>
        </div>
    </div>
  )
}

export default QuestionSection