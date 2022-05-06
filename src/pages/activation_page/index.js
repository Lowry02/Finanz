import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import UserController from '../../controllers/user_controller'
import routes from '../../routes'
import { Fade } from '@mui/material'

function ActivationPage() {
  const STATUS_LOADING = "loading"
  const STATUS_ERROR = "error"
  const STATUS_OK = "ok"
  
  let { code } = useParams()
  const [status, setStatus] = useState(STATUS_LOADING)
  let navigate = useNavigate()


  useEffect(async () => {
    if(code != undefined) {
      let user = new UserController()
      let error = await user.activateUser(code)

      if(error) setStatus(STATUS_ERROR)
      else {
        setStatus(STATUS_OK)
        setTimeout(() => navigate(routes.login.path), 3000)
      }
    }
  }, [code])
  

  return (
    <div id="registration" >
      <div className="content animate" >
        <Fade in={true} style={{ transitionDuration: "500ms"}} >
          <div>
            <h1>Attivazione account</h1>
            {
              status == STATUS_LOADING ?
              <p className="description">Attivazione del codice in corso...</p> :
              status == STATUS_ERROR ?
              <p className="description">Attenzione! Link non valido</p> :
              status == STATUS_OK ?
              <p className="description">Account attivato. Buon divertimento!</p> :
              ""
            }
          </div>
        </Fade>
      </div>
    </div>
  )
}

export default ActivationPage