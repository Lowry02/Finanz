import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router'
import CreateSchoolController from '../../../../controllers/create_school_controller'
import {Container, Row, Col} from "react-bootstrap"
import { TextField } from '@material-ui/core'
import "./style.css"
import Popup from '../../../../components/popup'
import { default as home_routes } from "../home/routes"

function SchoolCreation(props) {
  let user = props.user
  let routes = props.routes

  let { state } = useLocation()
  let navigate = useNavigate()

  const [school, setSchool] = useState(new CreateSchoolController())
  const [popupContent, setPopupContent] = useState()

  function publish() {
    let error = school.isContentValid()

    if(error['error']) {
      // show error message
      setPopupContent(error)
    } else {
      // publish school
      setPopupContent({error: false, message: "Creazione in corso..."})
      school.publish()
      .then(() => {
        setPopupContent({error: false, message: "Creazione completata"})
        setTimeout(() => navigate(home_routes.school.path), 1000)
      })
      .catch((error) => {
        console.warn(error)
        setPopupContent({error: true, message: "Errore, riprovare"})
      })
    }
  }

  // setting up 
  useEffect(() => {
    school.setState(setSchool)
    if(state != undefined) {
      let schoolObj = state['school']
      // edit mode
      school.setId(schoolObj['id'])
      school.setName(schoolObj['name'])
      school.setQuizNumber(schoolObj['quizNumber'])
      school.setCode(schoolObj['code'])
    }
  }, [])

  useEffect(() => {
    if(user) {
      if(!user.canI("create_tag")) navigate(routes.home.path)
    }
  }, [user])
  

  return (
    <Container id="school_creation" className="creation">
      <div className="space_between">
        <h1>Informazioni scuola</h1>
      </div>
      <Row>
        <Col md>
          <TextField
            className="my_input"
            margin="normal"
            fullWidth={true}
            label="Nome"
            variant="outlined"
            value={school.getName()}
            onChange={(e) => school.setName(e.target.value)}
          />
        </Col>
        <Col md>
          <TextField
            className="my_input"
            type="number"
            margin="normal"
            fullWidth={true}
            label="Numero quiz"
            variant="outlined"
            value={school.getQuizNumber()}
            onChange={(e) => school.setQuizNumber(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md="3"></Col>
        <Col md="6">
          <TextField
            className="my_input"
            type="text"
            margin="normal"
            fullWidth={true}
            label="Codice"
            variant="outlined"
            value={school.getCode()}
            onChange={(e) => school.setCode(e.target.value)}
          />
        </Col>
        <Col md="3"></Col>
      </Row>
      <br/>
      <div className="centered">
        <button className="button" onClick={() => publish()}>Pubblica</button>
      </div>
      {
        popupContent != undefined ?
          <Popup 
            isError={popupContent && popupContent['error']}
            message={popupContent && popupContent['message']}
            removeFunction={() => setPopupContent()}/> :
          ""
      }
    </Container>
  )
}

export default SchoolCreation