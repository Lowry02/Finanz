import React, { useState, useEffect } from 'react'
import QuestionController from '../../controllers/question_controller'
import MultipleChoiceQuestion from '../multiple_choice_question'
import { Row, Col } from "react-bootstrap"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fade, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

function QuizGroup(props) {
    let questions = props.questions
    console.log(questions)

    const [currentQuizId, setCurrentQuizId] = useState(0)
    const [currentQuiz, setCurrentQuiz] = useState(new QuestionController())

    function handleSwitch(i) {
        let newId = (currentQuizId + i) % Object.values(questions).length
        setCurrentQuizId(newId)
    }

    useEffect(() => {
        setCurrentQuiz(Object.values(questions)[currentQuizId])
    }, [currentQuizId])

    useEffect(() => {
        setCurrentQuiz(Object.values(questions)[currentQuizId]) 
    }, [questions])

    return (
        <>
        {
            currentQuiz != undefined ? 
            <Row>
                <Col className="centered">
                    {
                        currentQuizId == 0 ?
                        "" :
                        <IconButton
                        className="orange_icon"
                        onClick={() => handleSwitch(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    }
                    
                </Col>
                <Col xs="8">
                    <div className="centered">
                        <h6 className="mb-3">{currentQuiz.getTitle()}</h6>
                        <MultipleChoiceQuestion question={currentQuiz} /> 
                    </div>
                </Col>
                <Col className="centered">
                    {
                        currentQuizId == Object.values(questions).length - 1 ?
                        <IconButton
                        className="orange_icon">
                            <DoneIcon />
                        </IconButton> :
                        <IconButton
                        className="orange_icon"
                        onClick={() => handleSwitch(1)}>
                            <ArrowForwardIcon />
                        </IconButton>
                    }
                    
                </Col>
            </Row>
             :
            ""
        }
        </>

        
    )
}

export default QuizGroup
