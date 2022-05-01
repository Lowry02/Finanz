import React from 'react'
import {Container, Navbar, Nav} from "react-bootstrap"
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import {Row, Col} from "react-bootstrap"
import { useLocation } from 'react-router';

import Logo from "../../media/img/logo.png"

import routes from "./routes";
import "./style.css"

function Home(props) {
  let windowInfo = props.windowInfo
  const { pathname } = useLocation()

  return (
    <div id="home">
      <a id={"start"}/>

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
                <Nav.Link href="" className={"nav_item" + (pathname == routes.home.path ? " selected" : "")}><Link to={routes.home.path}>Home</Link></Nav.Link>
                <Nav.Link href="" className="nav_item"><HashLink to={routes.home.path + "#subscription"}>Prezzi</HashLink></Nav.Link>
                <Nav.Link href="" className="nav_item">Blog</Nav.Link>
                <Nav.Link href="" className={"nav_item" + (pathname == routes.aboutus.path ? " selected" : "")}><Link to={routes.aboutus.path}>Chi siamo</Link></Nav.Link>
              </Nav>
              <button className="bounce button">Accedi</button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>

      {/* BODY */}
      <Routes>
        {Object.values(routes).map((route) => 
          <Route path={route.url} element={route.component({windowInfo: windowInfo})} />
        )}
      </Routes>

      {/* INFO SECTION */}
      <div className="info_section">
        <Container>
          <Row>
            <Col md="3">
              <div className="logo centered mx-auto">
                <img src={Logo} />
              </div> 
            </Col>
            <Col md="3">
              <h5><b>ABOUT</b></h5>
              <HashLink to={routes.home.path + "#start"}><p>Home</p></HashLink>
              <HashLink to={routes.aboutus.path + "#start"}><p>Chi siamo</p></HashLink>
            </Col>
            <Col md="3">
              <h5><b>SOCIAL</b></h5>
              <a href={"https://www.linkedin.com/company/finanz-app/"}><p>Linkedin</p></a>
              <a href={"https://instagram.com/finanz_app?igshid=YmMyMTA2M2Y="}><p>Instagram</p></a>
              <a href={"https://www.youtube.com/channel/UCSC55Kl1-pWl2ncJrxwUZng"}><p>Youtube</p></a>
              
            </Col>
            <Col md="3">
              <h5><b>SUPPORTO</b></h5>
              <HashLink to={routes.home.path + "#faq"}><p>Faq e Assistenza</p></HashLink>
              {/* <a href={""}><p>Login</p></a> */}
              <p>Login</p>
            </Col>
          </Row>
          <br/>
          <p className="description text-center m-0">NOVA CAPITAL SRL SB - Capitale sociale 10.000€ - Partita IVA: 12358930969 - PEC novacapitalmi@legalmail.it</p>
        </Container>
      </div>

    </div>
  )
}
export default Home