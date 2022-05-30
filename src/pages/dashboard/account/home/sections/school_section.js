import React, {useState, useEffect} from 'react'
import SchoolListController from '../../../../../controllers/school_list_controller'
import {Row, Col} from "react-bootstrap"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import routes from '../../routes';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import QuestionCreator from '../../../../../components/question_creator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router";
import Popup from '../../../../../components/popup';
import ConfirmAction from '../../../../../components/confirm_action';

function SchoolSection(props) {
  // sections tag
  const SCHOOL_LIST_TAG = "list"
  const QUIZ_LIST_TAG = "quiz"
  
  let navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(SCHOOL_LIST_TAG)
  const [schoolList, setSchoolList] = useState(new SchoolListController())
  const [searchValue, setSearchValue] = useState("")
  const [popupContent, setPopupContent] = useState({})
  const [confirmInfo, setConfirmInfo] = useState({confirm: undefined, refute: undefined})

  let user = props.user

  // redirect to school creation page
  function createSchool() {
    navigate(routes.school_creation.path)
  }

  // redirect to school creation page
  function editSchool(school) {
    navigate(routes.school_creation.path, { state : { school : school.exportInfo() }})
  }

  // delete quiz from quiz list
  function deleteQuiz(e, quiz) {
    e.stopPropagation()
    setConfirmInfo({
      confirm: () => schoolList.deleteQuiz(quiz),
      refute: undefined
    })
  }

  // delete school from school list
  function deleteSchool(e, schoolId) {
    e.stopPropagation()
    setConfirmInfo({
      confirm: () => schoolList.deleteSchool(schoolId),
      refute: undefined
    })
  }

  async function publishQuiz(quiz) {
    setPopupContent({ error: false, message: "Pubblicazione in corso..."})
    quiz.publish("school")
    .then(() => setPopupContent({ error: false, message: "Pubblicazione completata"}))
    .catch((message) => {
      setPopupContent({ error: true, message: "Errore"})
      console.warn(message)
    })
  }

  // setting up schoolList and getting from server
  useEffect(() => {
    schoolList.setState(setSchoolList)
    if(user && user.canI("create_school")) schoolList.loadList()
  }, [])

  useEffect(() => {
    if(currentSection == QUIZ_LIST_TAG) {
      if(user && user.canI("create_school")) schoolList.loadQuiz()
    }
  }, [currentSection])

  useEffect(() => {
    if(user) {
      if(!user.canI("create_school")) navigate(routes.home.path)
    }
  }, [user])
  
  
  
  return (
    <div id="school_section">
      <div className="space_between">
        <h2>Scuola</h2>
        {
          currentSection == SCHOOL_LIST_TAG && user && user.canI("create_school") ? 
          <div className="centered">
            <AddCircleIcon className="orange_icon" onClick={() => createSchool()}/>
          </div>
          : ""
        }
      </div>
      <Tabs value={currentSection} onChange={(e, value) => setCurrentSection(value)} scrollButtons="auto" >
        <Tab label="Scuole" value={SCHOOL_LIST_TAG} />
        <Tab label="Quiz" value={QUIZ_LIST_TAG} />
      </Tabs>
      <br/>
      {
        currentSection == SCHOOL_LIST_TAG ? 
          <>
            <Row>
              <Col md="6">
                <h5>Nome</h5>
              </Col>
              <Col md="3">
                <h5>Codice</h5>
              </Col>
            </Row>
            <div className="list_container m-2">
              {
                schoolList.getList().map(school => (
                  <>
                    <Row className="bounce" onClick={() => editSchool(school)}>
                      <Col md="6">
                        <p className="m-0">{school.getName()}</p>
                      </Col>
                      <Col md="4">
                        <p className="m-0">{school.getCode()}</p>
                      </Col>
                      <Col md="2">
                        <DeleteIcon className="orange_icon" onClick={(e) => deleteSchool(e, school)}/>
                        <ArrowCircleRightIcon className="orange_icon m-0"/>
                      </Col>
                    </Row>
                    <hr/>
                  </>
                ))
              }
            </div>
          </> : 
          <>
            <div className="block">
              <Row>
                <Col md="8">
                  <h5>Quiz</h5>
                </Col>
                <Col md="4">
                  <input className="input" placeholder="Cerca..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                </Col>
              </Row>
              <br/>
              {
                schoolList.getQuiz().map(quiz => (
                  quiz.question.getTitle().includes(searchValue) ?
                    <Accordion className="accordion">
                      <AccordionSummary expandIcon={<ExpandMoreIcon className="orange_icon"/>}>
                        <div className="space_between" style={{ width: "100%"}}>
                          <h6 className="m-2">{quiz.question.getTitle()}</h6>
                          <div className="centered">
                            <DeleteIcon className="orange_icon" onClick={(e) => deleteQuiz(e, quiz)}/>
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <QuestionCreator question={quiz}/>
                        <div className="centered">
                        <button className="button" onClick={() => publishQuiz(quiz)}>Salva</button>
                        </div>
                      </AccordionDetails>
                      <br/>
                      <hr/>
                      <br/>
                    </Accordion>
                    : ""
                ))
              }
              <div className="centered">
                <button className="button" onClick={() => schoolList.addQuiz()}>Aggiungi domanda</button>
              </div> 
            </div>
          </>
      }
      {
        popupContent['error'] != undefined ?
          <Popup
            error={popupContent['error']}
            message={popupContent['message']}
            removePopup={() => setPopupContent({})}
            />
          : ""
      }
      <ConfirmAction action={confirmInfo} closeFunction={() => setConfirmInfo({confirm: undefined, refute: undefined})} />

    </div>
  )
}

export default SchoolSection