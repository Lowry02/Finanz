import React, {useState, useEffect} from 'react'
import {Container, Navbar, Nav, Row, Col} from "react-bootstrap"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Fade from '@mui/material/Fade';

import Logo from "../../media/img/logo.png"
import MainImageHome from "../../media/img/main_image_home.png"
import ImmagineDettaglio from "../../media/img/nel_dettaglio.png"

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import "./style.css"

function Home() {

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
    <div id="home">

      {/* NAVBAR */}
      <Container>
        <Navbar bg="light" expand="lg" className="navbar ball">
          <Container fluid>
            <Navbar.Brand href="#">
              <div className="logo centered">
                <img src={Logo} />
              </div> 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                <Nav.Link href="" className="nav_item">Home</Nav.Link>
                <Nav.Link href="" className="nav_item">Menu 1</Nav.Link>
                <Nav.Link href="" className="nav_item">Menu 2</Nav.Link>
                <Nav.Link href="" className="nav_item">Chi siamo</Nav.Link>
              </Nav>
              <button className="bounce button">Accedi</button>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* MAIN SECTION */}
        <Row className="main_section">
          <Col md="6" className="centered">
            <Fade in={true} style={{ transitionDelay: `0.3s` }} timeout={1000}>
              <div>
                <h1 className="main_title">Prima</h1>
                <h1 className="main_title">Seconda</h1>
                <h1 className="main_title">Parolalunga</h1>
              </div>
            </Fade>
            <Fade style={{ transitionDelay: `0.3s` }} in={true} timeout={1000}>
              <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id mattis eget odio molestie praesent fermentum mauris. Lobortis in proin lectus ultrices rhoncus nec molestie a vulputate</p>
            </Fade>
            <Fade style={{ transitionDelay: `0.3s` }} in={true} timeout={1000}>
              <div className="display_inline">
                <button className="bounce button">Registrati</button>
                <button className="bounce button">Scopri di più</button>
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
        <br/>

        {/* PERCHE' AMERAI FINANZ */}
        <div className="love ball">
          <div className="animate">
            <h6 className="sub_title">PERCHE' AMERAI FINANZ</h6>
            <h1 className="title">Lorem ipsum dolor</h1>
          </div>
          <Row>
            <Col md="1"></Col>
            <Col md="5">
              <div className="love_card animate">
                <span className="number mx-auto">01</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor at nulla neque sit pellentesque ipsum enim ut. Gravida viverra egestas tincidunt faucibus venenatis.</p>
                </div>
              </div>
            </Col>
            <Col md="5">
              <div className="love_card mt-5 animate">
                <span className="number mx-auto">02</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor at nulla neque sit pellentesque ipsum enim ut. Gravida viverra egestas tincidunt faucibus venenatis.</p>
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
                  <h6 className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor at nulla neque sit pellentesque ipsum enim ut. Gravida viverra egestas tincidunt faucibus venenatis.</p>
                </div>
              </div>
            </Col>
            <Col md="5">
              <div className="love_card animate">
                <span className="number mx-auto">04</span>
                <div className="content block">
                  <div className="icon_container"><SportsEsportsIcon className="icon"/></div>
                  <h6 className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor at nulla neque sit pellentesque ipsum enim ut. Gravida viverra egestas tincidunt faucibus venenatis.</p>
                </div>
              </div>
            </Col>
            <Col md="1"></Col>
          </Row>
        </div>

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
            <h6 className="sub_title">CORSI E CERTIFICATI</h6>
            <h1 className="title">Lorem ipsum dolor</h1>
          </div>
          <br/>
          <Row className="animate">
            <Col md="4" className="centered">
              <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
              <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor at nulla neque sit pellentesque ipsum enim ut. Gravida viverra egestas tincidunt faucibus venenatis.</p>
            </Col>
            <Col md="8" className="centered">
              <Row>
                <Col md="4" className="centered">
                  <div className="block bounce certificate odd">
                    <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
                  </div>
                </Col>
                <Col md="4" className="centered">
                  <div className="block bounce certificate even">
                    <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
                  </div>
                </Col>
                <Col md="4" className="centered">
                  <div className="block bounce certificate odd">
                    <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4" className="centered">
                  <div className="block bounce certificate even">
                    <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
                  </div>
                </Col>
                <Col md="4" className="centered">
                  <div className="block bounce certificate odd">
                    <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
                  </div>
                </Col>
                <Col md="4" className="centered">
                  <div className="block bounce certificate even">
                    <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </Container>

      {/* ABBONAMENTO */}
      <div className="subscription">
        <Container>
          <div className="animate">
            <h6 className="sub_title">ABBONAMENTO</h6>
            <h1 className="title">Lorem ipsum dolor</h1>
          </div>
          <br/>
          <Row className="animate">
            <Col md="4">
              <div className="block bounce">
                <h1 className="text-center">Titolo</h1>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description disabled">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description disabled">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description disabled">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description disabled">Lorem ipsum dolor sit amet, consectetur</p>
                <h1 className="text-center title">19€</h1>
                <div className="centered">
                  <button className="bounce button m-0">Inizia Subito</button>
                </div>
              </div>
            </Col>
            <Col md="4">
              <div className="block bounce">
                <h1 className="text-center">Titolo</h1>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description disabled">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description disabled">Lorem ipsum dolor sit amet, consectetur</p>
                <h1 className="text-center title">19€</h1>
                <div className="centered">
                  <button className="bounce button m-0">Inizia Subito</button>
                </div>
              </div>
            </Col>
            <Col md="4">
              <div className="block bounce">
                <h1 className="text-center">Titolo</h1>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <p className="description">Lorem ipsum dolor sit amet, consectetur</p>
                <h1 className="text-center title">19€</h1>
                <div className="centered">
                  <button className="bounce button m-0">Inizia Subito</button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <br/>
      <br/>
      <br/>

      <Container>
        {/* ALLORA CHE ASPETTI */}
        <div className="waiting_for">
          <h1 className="main_title text-center animate">Allora che aspetti?</h1>
          <br/>
          <Row>
            <Col md="4" className="centered animate">
              <div className="icon_container bounce ">
                <SportsEsportsIcon className="icon" />
              </div>
                <h3>Divertimento</h3>
            </Col>
            <Col md="4" className="centered animate">
              <div className="icon_container bounce">
                <SportsEsportsIcon className="icon" />
              </div>
                <h3>Apprendimento</h3>
            </Col>
            <Col md="4" className="centered animate">
              <div className="icon_container bounce">
                <SportsEsportsIcon className="icon" />
              </div>
                <h3>Certificazioni</h3>
            </Col>
          </Row>
          <br/>
          <div className="centered animate">
            <button className="bounce button">Registrati</button>
          </div>
        </div>

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
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
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
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
              <Accordion className="block my_accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="orange_icon"/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h5>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</p>
                </AccordionDetails>
              </Accordion>
            </Col>
            <Col md="1"></Col>
          </Row>
        </div>
      </Container>

      <br/>
      <br/>
      <br/>

    </div>
  )
}

function OfferSection() {
  const [currentSection, setCurrentSection] = useState(0)

  // NOTE: to update when you add sections
  const max_section_number = 4

  // manage scroll section using arrows
  function changeSection(direction) {
    if((currentSection + direction) >= 0 && (currentSection + direction) < max_section_number)
      setCurrentSection(currentSection + direction)
  }

  return (
    <div className="offer ball">
      <h6 className="sub_title animate">COSA OFFRIAMO</h6>
      <h1 className="title animate">Nel dettaglio</h1>
      <br/>
      <Col md="10" className="sections block mx-auto centered animate">
        <Row>
          <Col md="6">
            <Row>
              <Col md="10" className="centered">
                <img src={ImmagineDettaglio} />
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
                <div 
                onClick={() => setCurrentSection(3)}
                className={"section_item " + (currentSection == 3 ? "selected" : "")}></div>
                <ArrowDropDownIcon onClick={() => changeSection(1)} className="orange_icon last_arrow"/>
              </Col>
            </Row>
          </Col>
          <Col md="6" className="centered offer_content">
            <h1>Sezione News</h1>
            <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id mattis eget odio molestie praesent fermentum mauris. Lobortis in proin lectus ultrices rhoncus nec molestie a vulputate</p>
            <Row>
              <Col md="4">
                <div className="block">
                  <h5>Titolo 1</h5>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id mattis eget</p>
                </div>
              </Col>
              <Col md="4">
                <div className="block">
                  <h5>Titolo 2</h5>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id mattis eget</p>
                </div>
              </Col>
              <Col md="4">
                <div className="block">
                  <h5>Titolo 3</h5>
                  <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id mattis eget</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </div>
  )
}

export default Home