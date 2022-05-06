import React, { useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Row, Col, Container } from 'react-bootstrap';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link } from 'react-router-dom';

function AboutUs(props) {
  let windowInfo = props.windowInfo
  let mobileMode = windowInfo.mobileMode
  
  // seciton state
  const [currentSection, setCurrentSection] = useState(0)  

  // change section handler
  function changeSection(e, newValue) {
    setCurrentSection(newValue)
  }

  // manage animations
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      // Loop over the entries
      entries.forEach(entry => {
        // If the element is visible
        if (entry.isIntersecting) {
          // Add the animation class
          entry.target.style.opacity = 1
        }
      })
    })
    
    let animatedElement = [...document.querySelectorAll('.animate')]
    for(let element of animatedElement) observer.observe(element)
  }, [])

  return (
    <div className="info_section animate">
      <Container id="about_us">
        <br/>
        <h1 className="main_title text-center animate">Chi siamo</h1>

          {/* TABBAR */}
        <Tabs centered variant={mobileMode ? "scrollable" : "standard"} value={currentSection} onChange={changeSection} className="animate">
          <Tab label={"Mission"} value={0}/>
          <Tab label={"Il nostro approccio"} value={1}/>
          <Tab label={"Contattaci"} value={2}/>
        </Tabs>
        <hr className="m-0"/>
        <br/>

        {/* CONTENT */}
        <Col md="10" className="mx-auto mission animate">
          {
            currentSection == 0 ?
              /* MISSION SECTION */
              <div>
                <Row>
                  <Col md="3" className="vertical_middle">
                    <h1 className="title_orange m-3">L'inizio</h1>
                  </Col>
                  <Col md="7">
                    <p className="description m-3">Delusi dalla fatica con cui viene affronta l’educazione finanziaria in Italia e consapevoli di quanto sia difficile trovare materiale didattico utile e di qualità per imparare a gestione dei propri risparmi, i fondatori di Finanz si sono riuniti per trovare una soluzione. <br/> L’enorme buco nero di analfabetizzazione economica andava colmato una volta per tutte!</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="3" className="vertical_middle">
                    <h1 className="title_orange m-3">Il problema</h1>
                  </Col>
                  <Col md="7">
                    <p className="description m-3">Quasi tutti i giovani sviluppano l’idea che investire sia una “faccenda” molto complicata e rischiosa, da cui tenersi alla larga, oppure sono convinti che questi concetti non li riguardano perché sono rivolti esclusivamente a milionari, ricchi imprenditori e broker.</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="3" className="vertical_middle">
                    <h1 className="title_orange m-3">La nostra idea</h1>
                  </Col>
                  <Col md="7">
                    <p className="description m-3">La verità è che sapere come fare a gestire i propri soldi è un’abilità che dovrebbe essere insegnata fin dal primo anno delle scuole superiori. E’ proprio questa l’età giusta per imparare le prime nozioni finanziarie, evitando di diventare pedine del marketing, dell’inflazione o dei sistemi monetari. <br/> La finanza è parte integrante della nostra vita ed è quindi bene iniziare a conoscerne i principi il prima possibile!</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="3" className="vertical_middle">
                    <h1 className="title_orange m-3">La nostra anima</h1>
                  </Col>
                  <Col md="7">
                    <p className="description m-3">Così ci siamo rimboccati le maniche e abbiamo lanciato questo progetto per riuscire a coinvolgere quante più persone possibili, creando un’opportunità di apprendimento inclusiva, stimolante e di alto livello! <br/> Finanz vuole spiegare davvero a tutti, in modo chiaro e corretto, come utilizzare al meglio il proprio denaro, preparando attraverso corsi efficaci come un libro ma ricreativi come un gioco, per facilitare l’apprendimento di questa materia tanto sconosciuta quanto necessaria.</p>
                  </Col>
                </Row>
              </div> :
            currentSection == 1 ? 
              /* "IL NOSTRO APPROCCIO" SECTION */
              <Col md="10" className="approach mx-auto">
                <Timeline position="right">
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h5 className="section_title">Una sfida didattica di grande valore</h5>
                      <p className="description">Offriamo un apprendimento intuitivo e funzionale, dedicato ai ragazzi che vogliono compiere scelte rilevanti per il loro benessere economico. <br/>I nostri contenuti sono stati redatti e progettati da un team di professionisti ed esperti che hanno creato percorsi formativi di alto livello che si adattano, grazie all’intelligenza artificiale, alle esigenze di ogni studente.</p>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h5 className="section_title">Educare bene significa anche coinvolgere</h5>
                      <p className="description">Siamo consapevoli che la chiave giusta per istruire i giovani sia attraverso l’intrattenimento, per mantenere viva la loro motivazione e spingerli verso i progressi e le vittorie che meritano. Per questo abbiamo pianificato lezioni di breve durata, alternate a quiz e curiosità, così da mantenere esplosiva l’attenzione dei ragazzi.</p>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h5 className="section_title">Aiutare i ragazzi a costruirsi un futuro finanziario migliore</h5>
                      <p className="description">Utilizziamo un approccio innovativo e originale, che si pone l’obiettivo di costruire, potenziare ed espandere le conoscenze economiche dei più giovani in maniera da impattare positivamente sul loro presente e soprattutto sul loro futuro. <br/>Finanz è un nuovo capitolo, in cui il mondo della finanza e quello degli studenti si unisce per rimettere moto le loro opportunità e speranze.</p>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Col>
               :
            currentSection == 2 ?
              /* CONTACT US SECTION */
              <div className="centered text-center">
                <h5>Per informazioni</h5>
                <p className="description"><a href={"mailto:info@finan-z.com"}>info@finan-z.com</a></p>
                <h5>Per investitori</h5>
                <p className="description"><a href={"mailto: lorenzoperotta@gmail.com"}>lorenzoperotta@gmail.com</a></p>
                <hr/>
                <div className="display_inline mx-auto">
                  <a href={"https://www.youtube.com/channel/UCSC55Kl1-pWl2ncJrxwUZng"}><YouTubeIcon className="orange_icon m-1" style={{ color: "var(--details_color)"}} /></a>
                  <a href={"https://instagram.com/finanz_app?igshid=YmMyMTA2M2Y="}><InstagramIcon className="orange_icon m-1" /></a>
                  <a href={"https://www.linkedin.com/company/finanz-app/"}><LinkedInIcon className="orange_icon m-1" /></a>
                </div>
              </div> :
              ""
          }
        </Col>
      </Container>
    </div>
  )
}

export default AboutUs