import React, {useState, useEffect} from 'react'
import {Container, Row, Col} from "react-bootstrap"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Fade from '@mui/material/Fade';

import Logo from "../../media/img/logo.png"
import MainImageHome from "../../media/img/static_home/main_image.png"
import NewsPhone from "../../media/img/static_home/news_phone.png"
import CoursePhone from "../../media/img/static_home/course_phone.png"
import AcademyPhone from "../../media/img/static_home/academy_phone.png"

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HashLink } from 'react-router-hash-link';
import routes from './routes';

function Home(props) {
  let windowInfo = props.windowInfo
  let mobileMode = windowInfo['mobileMode']

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
    <div>
      {/* NAVBAR */}
      <Container>
        {/* MAIN SECTION */}
        <Row className="main_section">
          <Col md="6" className="centered">
            <Fade in={true} style={{ transitionDelay: `0.3s` }} timeout={1000}>
              <div>
                <h1 className="main_title">Il primo metodo</h1>
                <h1 className="main_title">gratuito, divertente ed efficace</h1>
                <h1 className="main_title">per imparare la finanza</h1>
              </div>
            </Fade>
            <Fade style={{ transitionDelay: `0.3s` }} in={true} timeout={1000}>
              <p className="description">L'apprendimento <b>coinvolgente e mirato</b> con cui migliori in fretta e ottieni <b>competenze reali</b> per iniziare subito a muovere i primi passi nel <b>mondo degli investimenti</b>!</p>
            </Fade>
            <Fade style={{ transitionDelay: `0.3s` }} in={true} timeout={1000}>
              <div className="display_inline">
                <button className="bounce button">Registrati</button>
                <HashLink to={routes.home.path + "#discover"}><button className="bounce button">Scopri di più</button></HashLink>
              </div>
            </Fade>
          </Col>
          <Col md="6" className="centered">
            <Fade style={{ transitionDelay: `0.3s` }} in={true} timeout={1000}>
              <img src={MainImageHome} className="img-fluid"/>
            </Fade>
          </Col>
        </Row>

        <br/>
        <br/>
        <br/>

        <a id="discover" />
        <br/>
        {/* PERCHE' AMERAI FINANZ */}
        <div className="love ball">
          <div className="animate">
            <h6 className="sub_title">PERCHE' AMERAI FINANZ</h6>
            <h1 className="title">Il sistema educativo adatto alle esigenze di tutti</h1>
          </div>
          <Row>
            <Col md="1"></Col>
            <Col md="5">
              <div className="love_card animate">
                <span className="number mx-auto">01</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">EFFICACE</h6>
                  <p className="description">Rimani proiettato al tuo futuro! Con le nostre lezioni, brevi e intuitive, sviluppi abilità pratiche e conoscenze reali per investire subito sul tuo successo.</p>
                </div>
              </div>
            </Col>
            <Col md="5">
              <div className="love_card mt-5 animate">
                <span className="number mx-auto">02</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">STIMOLANTE</h6>
                  <p className="description">Resti sempre carico e motivato! Il nostro approccio educativo sollecita la tua attenzione e curiosità, incentivandoti a non smettere mai di imparare.</p>
                </div>
              </div>
            </Col>
            <Col md="1"></Col>
          </Row>
          <Row>
            <Col md="1"></Col>
            <Col md="5">
              <div className="love_card animate">
                <span className="number mx-auto">03</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">DIVERTENTE</h6>
                  <p className="description">Studia senza annoiarti! Migliora velocemente con un sistema di apprendimento ricreativo e frizzante, che rende lo studio un gioco.</p>
                </div>
              </div>
            </Col>
            <Col md="5">
              <div className="love_card animate">
                <span className="number mx-auto">04</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">INTELLIGENZA ARTIFICIALE</h6>
                  <p className="description">Lascia che il nostro sistema calcoli il percorso migliore per te! <br/> Segui una routine di studio adeguata al tuo livello, adatta ai tuoi impegni e alle tue abitudini.</p>
                </div>
              </div>
            </Col>
            <Col md="1"></Col>
          </Row>
        </div>

        <br/>
        <br/>
        <br/>

        {/* COSA OFFRIAMO */}
        <OfferSection />

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        {/* CORSI E CERTIFICATI */}
        <div className="courses ball">
          <div className="animate">
            {
              mobileMode ?
                <h6 className="sub_title">ACCELLERA I <br/>TUOI PROGRESSI<br/>CON FINANZ PLUS</h6> :
                <h6 className="sub_title">ACCELLERA I TUOI PROGRESSI CON FINANZ PLUS</h6>

            }
            <h1 className="title">La didattica performante che ti aiuta a raggiungere prima i tuoi obbiettivi</h1>
            <Col md="10">
              <p className="description animate"><b>Finanz plus</b> è un'esperienza unica e completa. Creata con esperti per offrire video corsi efficaci e coinvolgenti. Farai parte di una community esclusiva e imparerai dai migliori per raggiungere prima i tuoi obbiettivi.</p>
            </Col>
          </div>
          <br/>
          <Row className="animate">
            <Col md="12" >
              <Row>
                  <Col md>
                    <div className="block bounce certificate odd">
                      <h5 className="m-0">Finanza comportamentale</h5>
                    </div>
                  </Col>
                  <Col md>
                    <div className="block bounce certificate even">
                      <h5>Trading online</h5>
                    </div>
                  </Col>
                  <Col md>
                    <div className="block bounce certificate odd">
                      <h5>Titoli azionari</h5>
                    </div>
                  </Col>
                  <Col md>
                    <div className="block bounce certificate odd">
                      <h5>Mercato Forex</h5>
                    </div>
                  </Col>
                  <Col md>
                    <div className="block bounce certificate even">
                      <h5>Python per la finanza</h5>
                    </div>
                  </Col>
              </Row>
              <Row>
                <Col md>
                  <div className="block bounce certificate odd">
                    <h5 className="m-0">Excel per la finanza</h5>
                  </div>
                </Col>
                <Col md>
                  <div className="block bounce certificate even">
                    <h5>Cryptovalute</h5>
                  </div>
                </Col>
                <Col md>
                  <div className="block bounce certificate odd">
                    <h5>Macro Economia</h5>
                  </div>
                </Col>
                <Col md>
                  <div className="block bounce certificate odd">
                    <h5>Come avviare una Start-Up</h5>
                  </div>
                </Col>
                <Col md>
                  <div className="block bounce certificate even">
                    <h5>Contratti derivati</h5>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <h1 className="description text-center animate" ><b>...</b></h1>
          <br/>
          <div className="centered animate">
            <button className="button">Entra in Finanz Plus</button>
          </div>
        </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </Container>

      {/* ABBONAMENTO */}
      <a id="subscription"></a>
      <div className="subscription">
        <Container>
          <div className="animate">
            <h6 className="sub_title">ATTIVA L'ABBONAMENTO E CONSEGUI IL CERTIFINANZ</h6>
            <h1 className="title">Mostra i tuoi risultati e rafforza il tuo CV</h1>
            <p className="description">Entrando nell'area abbonati accedi ad un esclusivo percorso di Formazione con più di 25 video corsi realizzati da veri esperti e professionisti del settore che ti permettono di ottenere il nostro attestato da allegare al tuo CV o caricare su Linkedin!</p>
          </div>
          <br/>
          <Row className="animate">
            <Col md="4">
              <div className="block bounce">
                <h1 className="text-center">Gratuito</h1>
                <p className="description">
                  <h6 className="mini_title">Academy</h6>
                  Accesso illimitato all'area
                </p>
                <p className="description">
                  <h6 className="mini_title">News</h6>
                  Trend del momento e novità finanziarie
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">Video corsi</h6>
                  Accedi senza limiti a più di 25 corsi didattici online
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">Lezioni esclusive</h6>
                  Segui più di 500 lezioni dove e quando vuoi
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">Formazione pratica</h6>
                  Acquisisci competenze operative da applicare sul campo
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">Webinar settimanali</h6>
                  Partecipa a incontri ed Eventi Live tenuti da professionisti
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">Community</h6>
                  Fai domande ai docenti e ti confronti con gli esperti del settore
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">Test e Quiz</h6>
                  Esercitati e verifica i tuoi progressi per conoscere il tuo grado di separazione
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">CertiFinanZ</h6>
                  Convalida i tuoi traguardi e conquista il mondo del lavoro con il nostro attestato
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">2 Mesi Gratuiti</h6>
                  Ottieni 60 giorni di apprendimento illimitato in regalo
                </p>
                <h1 className="text-center title">&nbsp;</h1>
                <div className="centered">
                  <button className="bounce button m-0">Inizia Subito</button>
                </div>
              </div>
            </Col>
            <Col md="4">
              <div className="block bounce">
                <h1 className="text-center">Mensile</h1>
                <p className="description">
                  <h6 className="mini_title">Academy</h6>
                  Accesso illimitato all'area
                </p>
                <p className="description">
                  <h6 className="mini_title">News</h6>
                  Trend del momento e novità finanziarie
                </p>
                <p className="description">
                  <h6 className="mini_title">Video corsi</h6>
                  Accedi senza limiti a più di 25 corsi didattici online
                </p>
                <p className="description">
                  <h6 className="mini_title">Lezioni esclusive</h6>
                  Segui più di 500 lezioni dove e quando vuoi
                </p>
                <p className="description">
                  <h6 className="mini_title">Formazione pratica</h6>
                  Acquisisci competenze operative da applicare sul campo
                </p>
                <p className="description">
                  <h6 className="mini_title">Webinar settimanali</h6>
                  Partecipa  aincontri ed Eventi Live tenuti da professionisti
                </p>
                <p className="description">
                  <h6 className="mini_title">Community</h6>
                  Fai domande ai docenti e ti confronti con gli esperti del settore
                </p>
                <p className="description">
                  <h6 className="mini_title">Test e Quiz</h6>
                  Esercitati e verifica i tuoi progressi per conoscere il tuo grado di separazione
                </p>
                <p className="description">
                  <h6 className="mini_title">CertiFinanZ</h6>
                  Convalida i tuoi traguardi e conquista il mondo del lavoro con il nostro attestato
                </p>
                <p className="description disabled">
                  <h6 className="mini_title">2 Mesi Gratuiti</h6>
                  Ottieni 60 giorni di apprendimento illimitato in regalo
                </p>
                <h1 className="text-center title">9,99€</h1>
                <div className="centered">
                  <button className="bounce button m-0">Inizia Subito</button>
                </div>
              </div>
            </Col>
            <Col md="4">
              <div className="block bounce">
                <h1 className="text-center">Annuale</h1>
                <p className="description">
                  <h6 className="mini_title">Academy</h6>
                  Accesso illimitato all'area
                </p>
                <p className="description">
                  <h6 className="mini_title">News</h6>
                  Trend del momento e novità finanziarie
                </p>
                <p className="description">
                  <h6 className="mini_title">Video corsi</h6>
                  Accedi senza limiti a più di 25 corsi didattici online
                </p>
                <p className="description">
                  <h6 className="mini_title">Lezioni esclusive</h6>
                  Segui più di 500 lezioni dove e quando vuoi
                </p>
                <p className="description">
                  <h6 className="mini_title">Formazione pratica</h6>
                  Acquisisci competenze operative da applicare sul campo
                </p>
                <p className="description">
                  <h6 className="mini_title">Webinar settimanali</h6>
                  Partecipa  aincontri ed Eventi Live tenuti da professionisti
                </p>
                <p className="description">
                  <h6 className="mini_title">Community</h6>
                  Fai domande ai docenti e ti confronti con gli esperti del settore
                </p>
                <p className="description">
                  <h6 className="mini_title">Test e Quiz</h6>
                  Esercitati e verifica i tuoi progressi per conoscere il tuo grado di separazione
                </p>
                <p className="description">
                  <h6 className="mini_title">CertiFinanZ</h6>
                  Convalida i tuoi traguardi e conquista il mondo del lavoro con il nostro attestato
                </p>
                <p className="description">
                  <h6 className="mini_title">2 Mesi Gratuiti</h6>
                  Ottieni 60 giorni di apprendimento illimitato in regalo
                </p>
                
                <h1 className="text-center title" id="month_price">8,25€</h1>
                <div className="centered">
                  <button className="bounce button m-0">Inizia Subito</button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <a id="faq"/>
      <Container>
        {/* FAQ */}
        <div className="faq">
          <br/>
          <br/>
          <h1 className="main_title text-center animate">FAQ</h1>
          <br/>
          <Row className="animate">
            <Col md="1"></Col>
            <Col md="5">
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Che cos’è Finanz?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Finanz è la prima piattaforma gratuita accessibile a chiunque voglia migliorare le proprie conoscenze finanziarie e sviluppare nuove abilità pratiche da applicare nel mondo degli investimenti.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Perché scaricare l’App Finanz?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Avrai accesso gratuito a tantissimi percorsi formativi che ti garantiscono un apprendimento completo, aggiornato e adattato alle tue esigenze, per migliorare passo a passo le competenze finanziarie che vuoi tu.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Come scarico l’App di Finanz?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">L’App è disponibile gratuitamente per sistemi iOs e Android, basta aprire Apple Store o Play Store per scaricarla.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Devo pagare per scaricare l’App?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">No, il download è completamente gratuito e ti dà libero accesso a tutti i percorsi di studio disponibili.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Servono requisiti per studiare dentro Finanz?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Nessun requisito è necessario per iniziare i nostri percorsi, l’apprendimento è aperto a chiunque e soprattutto non è mai troppo tardi per cominciare a imparare!</p>
                </AccordionDetails>
              </Accordion>
            </Col>
            <Col md="5">
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Perché abbonarsi alla sezione Finanz Plus?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Solo gli abbonati hanno accesso ai video corsi disponibili e a quelli nuovi in uscita! Inoltre potrai partecipare ai Webinar settimanali e agli eventi tenuti dai nostri esperti, rivedere le registrazioni e conseguire il CertiFinanZ.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Dove posso seguire le lezioni?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Potrai seguire i contenuti video dal tuo smartphone, da pc e tablet, cambiando dispositivo ogni volta che vuoi. Dovrai semplicemente scaricare l’App ed eseguire l’accesso con le tue credenziali.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Posso continuare ad avere accesso ai video-corsi anche dopo averli completati?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Sì. Potrai continuare ad accedere al corso anche dopo averlo completato, a condizione che il tuo account sia attivo ed in regola.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Che cos’è il CertiFinanz?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Completando il tuo percorso formativo in Finanz Plus otterrai il CertiFinanz per attestare le tue nuove competenze e mostrate a tutti i traguardi che hai raggiunto.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Come si cancella l’abbonamento a Finanz Plus?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Se ci ripensi puoi annullare il tuo abbonamento in pochi e semplici click da questo link</p>
                </AccordionDetails>
              </Accordion>
            </Col>
            <Col md="1"></Col>
          </Row>

          <br/>
          <br/>
          <br/>

          {/* ALLORA CHE ASPETTI */}
          <div className="waiting_for">
            <h1 className="main_title text-center animate">Cosa stai aspettando?</h1>
            <br/>
            <Col md="6" className="mx-auto animate">
              <h1 className="text-center description">Impara tutto sul mondo della finanza e <b>conquista il tuo futuro</b></h1>
            </Col>
            <br/>
            <div className="centered animate">
              <button className="bounce button">Registrati</button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function OfferSection() {
  const [currentSection, setCurrentSection] = useState(0)

  // NOTE: to update when you add sections
  const max_section_number = 3

  // manage scroll section using arrows
  function changeSection(direction) {
    if((currentSection + direction) >= 0 && (currentSection + direction) < max_section_number)
      setCurrentSection(currentSection + direction)
  }

  return (
    <div className="offer ball">
      <h6 className="sub_title animate">COSA TROVERAI DENTRO FINANZ</h6>
      <h1 className="title animate">Un'esperienza di creascita piena di opportunità</h1>
      <p className="description animate">Entra nell'area learning gratuita! Avrai accesso ad un'ampia raccolta di contenuti formativi, originali e approfonditi, in più ricevi continui aggiornamenti sulle ultime novità finanziarie. </p>
      <br/>
      <Col md="11" className="sections block mx-auto centered animate">
        <Row>
          <Col md="5">
            <Row>
              <Col md="10" className="centered">
              {
                currentSection == 0 ?
                  <img className="img-fluid" style={{ maxHeight: "600px" }} src={AcademyPhone} /> :
                currentSection == 1 ? 
                  <img className="img-fluid" style={{ maxHeight: "600px" }} src={CoursePhone} /> :
                currentSection == 2 ?
                  <img className="img-fluid" style={{ maxHeight: "600px" }} src={NewsPhone} /> :
                ""
              }
              </Col>
              <Col md="2" className="section_items_container">
                <ArrowDropUpIcon onClick={() => changeSection(-1)} className="orange_icon first_arrow"/>
                <div 
                onClick={() => setCurrentSection(0)}
                className={"section_item " + (currentSection == 0 ? "selected" : "")}></div>
                <div 
                onClick={() => setCurrentSection(1)}
                className={"section_item " + (currentSection == 1 ? "selected" : "")}></div>
                <div 
                onClick={() => setCurrentSection(2)}
                className={"section_item " + (currentSection == 2 ? "selected" : "")}></div>
                <ArrowDropDownIcon onClick={() => changeSection(1)} className="orange_icon last_arrow"/>
              </Col>
            </Row>
          </Col>
          <Col md="7" className="centered offer_content">
            {
              currentSection == 0 ?
              <>
                <h1>ACADEMY</h1>
                <h6>Un luogo dove apprendere, esplorare e confrontarsi!</h6>
                <br/>
                <p className="description"> Una percorso formativo personalizzato per imparare attraverso lezioni brevi e scorrevoli tutto quello che c'è da sapere sull'economia, la finanza, gli investimenti e molto altro</p>
                <Row>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Una percorso formativo personalizzato per imparare attraverso lezioni brevi e scorrevoli tutto quello che c'è da sapere sull'economia, la finanza, gli investimenti e molto altro</p>
                    </div>
                  </Col>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Accesso illimitato e gratuito da qualsiasi dispositivo, senza limiti di tempo, per studiare secondo i tuoi ritmi e necessità</p>
                    </div>
                  </Col>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description"> Tanti quiz, approfondimenti ed esempi realistici che assicurano una comprensione chiara ed immediata, alla portata di tutti</p>
                    </div>
                  </Col>
                </Row>
              </> :
              currentSection == 1 ?
              <>
                <h1>FINANZ PLUS</h1>
                <p className="description">Faremo in modo che tu possa raggiungere prima i tuoi risultati professionali e personali grazie ad esclusivi programmi interattivi e ultra mirati! Una full-immersion coinvolgente e interattiva per risparmiare tempo e ottimizzare quello che hai.</p>
                <Row>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Una full-immersion coinvolgente ed interattiva, dedicata agli studenti più ambizioni che non possono aspettare ad inseguire i propri obiettivi</p>
                    </div>
                  </Col>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Più di 25 video-corsi realizzati dai grandi esperti del settore finanziario, più tanti eventi live e webinar settimanali che ti guideranno in una community vincente</p>
                    </div>
                  </Col>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Dopo aver completato il corso riceverai il tuo personale CertiFinanz, che potrai condividere sui social ed allegare al CV per attestare le tue nuove competenze</p>
                    </div>
                  </Col>
                </Row>
              </> : 
              <>
                <h1>BREAKING NEWS</h1>
                <p className="description">Resta aggiornato in ogni momento con notizie più utili e importanti. Un team di esperti seleziona i fatti in tempo reale per tenerti informato su ciò che accade nel mondo: ovunque tu sia, sarai sempre a conoscenza dei trend di mercato più attuali.</p>
                <Row>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Resta aggiornato costantemente con le notizie più importanti ed interessanti sul mondo dell’economia, della finanza e del trading</p>
                    </div>
                  </Col>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Un team di esperti valuta e seleziona i fatti in tempo reale, per tenerti informato e fornirti un report di notizie completo</p>
                    </div>
                  </Col>
                  <Col xl="4">
                    <div class="block">
                      {/* <h5>Titolo 1</h5> */}
                      <p class="description">Ovunque tu sia sarai sempre a conoscenza dei trend di mercato e delle novità internazionali, senza che tu debba cercare tra tanti siti, app e giornali</p>
                    </div>
                  </Col>
                </Row>
              </>
            }
          </Col>
        </Row>
      </Col>
    </div>
  )
}

export default Home