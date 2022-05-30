import React, { useState, useEffect, useRef } from 'react'
import QuestionController from '../../controllers/question_controller'
import MultipleChoiceQuestion from '../multiple_choice_question'
import { Row, Col } from "react-bootstrap"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fade, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

function QuizGroup(props) {
    let questions = props.questions

    const [currentQuizId, setCurrentQuizId] = useState(0)
    const [currentQuiz, setCurrentQuiz] = useState(new QuestionController())

    const firstLoad = useRef(true)

    function handleSwitch(i) {
        let currentIndex = Object.keys(questions).indexOf(currentQuizId)
        if(currentIndex >= 0) {
            let newId = Object.keys(questions)[currentIndex + i]
            if(newId != undefined) setCurrentQuizId(newId)
        }
    }

    useEffect(() => {
        if(currentQuizId != 0) setCurrentQuiz(questions[currentQuizId].question)
    }, [currentQuizId])

    useEffect(() => {
        if(Object.keys(questions).length != 0) {
            if(firstLoad.current) {
                let firstId = Object.keys(questions)[0]
                if(firstId != undefined) {
                    setCurrentQuizId(firstId)
                    setCurrentQuiz(questions[firstId].question) 
                    firstLoad.current = false
                }
            }
        }
    }, [questions])

    return (
        <>
        {
            currentQuiz != undefined ? 
            <Row>
                <Col className="centered">
                    {
                        currentQuizId == Object.keys(questions)[0] ?
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
                        {/* <h6 className="mb-3">{currentQuiz.getTitle()}</h6> */}
                        <MultipleChoiceQuestion question={currentQuiz} /> 
                    </div>
                </Col>
                <Col className="centered">
                    {
                        currentQuizId == Object.keys(questions)[Object.keys(questions).length - 1] ?
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
