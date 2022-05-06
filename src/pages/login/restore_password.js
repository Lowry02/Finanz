import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Col } from 'react-bootstrap'
import Popup from '../../components/popup'
import UserController from '../../controllers/user_controller'
import routes from '../../routes'

function RestorePassword() {
  let { pathname } = useLocation()
  let { code } = useParams()
  let navigate = useNavigate()

  let user = new UserController()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [popupInfo, setPopupInfo] = useState({})
  const [finish, setFinish] = useState(false)

  async function updatePassword() {
    if(password == confirmPassword && password != "") {
      setLoading(true)
      if(await user.isPasswordValid(password)) {
        // request
        let error = await user.recoverPassword(password, confirmPassword, code)
        if(error) {
          setPopupInfo({ error: true, message: "Link non valido"})
          setLoading(false)
        }
        else {
          setPopupInfo({ error: false, message: "Password modificata!" })
          setFinish(true)
          setTimeout(() => navigate(routes.login.path), 4000)
        }
      } else {
        // password non valida
        setPopupInfo({error: true, message: "Password non valida"})
        setLoading(false) 
      }
    } else {
      setPopupInfo({error: true, message: "Le password non sono uguali"})
      setLoading(false) 

    }
  }

  return (
    <div id="registration"> 
      <div className={"content" + (finish ? " animate" : "")}>
        <h1>Recupera password</h1>
        <p className="thin">Codice: {code}</p>
        <Col md="8" className="centered" onKeyDown={(e) => e.key == "Enter" ? updatePassword() : null}>
          <input
              className="input"
              placeholder="Password"
              type="password"
              autoFocus={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
          <input
          className="input"
          placeholder="Conferma password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className="description" style={{ color: "var(--details_color)", fontSize: "12px"}}>* la password deve essere lunga almeno 8 caratteri e deve contenere: maiuscole, minuscole, numeri, e caratteri speciali(_, @, $, .)</p>
        </Col>
        {
          loading ? 
            <div className="loading"></div> :
            <button className="button" onClick={() => updatePassword()}>Invia</button>
        }
      </div>
      {
        Object.keys(popupInfo).length != 0 ?
        <Popup isError={popupInfo['error']} message={popupInfo['message']} removeFunction={() => setPopupInfo({})}/>
        : ""
      }

    </div>
  )
}

export default RestorePassword