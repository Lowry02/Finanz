import React, { useEffect, useState } from 'react'
import { Fade } from '@material-ui/core'
import ReactTypingEffect from 'react-typing-effect'
import $ from "jquery"
import "./style.css"

import Gif from "../../media/img/perplexed.gif"

function ErrorPage(props) {
  const [firstSentence, setFirstSentence] = useState(true)
  console.log(props)

  useEffect(() => {
    setTimeout(() => setFirstSentence(false), 3000)
    setTimeout(() => $('#content_container').animate({
      scrollTop: 600
    }, 1500), 4800)
  }, [])
  
  return (
    <div id="error_page" className="centered">
      {
        firstSentence ? 
          <ReactTypingEffect 
          typingDelay={500}
          speed={200}
          text={["Mmm..."]} 
          displayTextRenderer={(text, i) => (
            <h1 className="title text-center">
	            &nbsp;
              {text.split('').map((char, i) => {
                const key = `${i}`;
                return (
                  <span
                    key={key}
                  >{char}</span>
                );
              })}
            </h1>
          )}/> :
          <>
            <Fade timeout={2000} in={!firstSentence}>
              <div>
                <h1 className="text-center title">Errore 404</h1>
                <br/>
                <img className="img-fluid" src={Gif}/>
              </div>
            </Fade>
            <br/>
            <Fade in={!firstSentence} timeout={2000} style={{transitionDelay: "2.3s"}}>
              <h1 className="text-center">Questa pagina<br/>non esiste</h1>

            </Fade>
          </>
      }
      

    </div>
  )
}

export default ErrorPage