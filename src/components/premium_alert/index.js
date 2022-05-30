import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import "./style.css"
import { useNavigate } from 'react-router';
import { Fade } from '@mui/material';

// link to payments section is static

function PremiumAlert(props) {
  let closeFunction = props.closeFunction
  let navigate = useNavigate()

  function goToSectionPage() {
    closeFunction()
    navigate("/dashboard/account/payments")
  }

  return (
    <Fade in={true} style={{ transitionDuration: "1s"}}>
      <div id="premium_alert" className="">
        <div className="content centered">
          <CloseIcon className="close_icon bounce" onClick={closeFunction}/>
          <h1 className="small_title">Funzionalità Premium!</h1>
          <p>Stai cercando di accedere a una funzionalità Premium</p>
          <p>Decine di corsi, webinar con personaggi esclusivi e programmi su misura per te!</p>
          <div className="centered">
            <button className="button bounce" onClick={goToSectionPage}>Passa a Premium</button>
          </div>
        </div>
      </div>
    </Fade>
  )
}

export default PremiumAlert