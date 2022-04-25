import React from 'react'
import "./style.css"
import routes from '../../routes'
import { useNavigate } from 'react-router'
import { Container } from '@material-ui/core'
import { Col } from 'react-bootstrap'

function StaticHome() {
    let navigate = useNavigate()

    return (
        <div id="static_home">
            <div className="container">
                <br/>
                <h1 className="m-0">Beta testing Finanz v1.4.2</h1>
                <h3 className="allert ">Il sito non è ancora pronto per telefoni e tablet</h3>
                <Col md="6">
                    <p className="thin">Per comunicarmi la vostra opinione ho create questo file. Vi basterà accedere e inserire ciò che notate nelle apposite tabelle</p>
                    <p>-> <a target="_blank" href="https://docs.google.com/document/d/1KVoSZUC17b0TyqphgY5HTvw_ZOwqLpT6i5SjGIIjkso/edit?usp=sharing">Documento Beta testing</a></p>
                    <p>-> <a onClick={() => navigate("/home")}>Pagina home statica</a></p>
                    <p>-> <a onClick={() => navigate("/dashboard")}>Accedi alla dashboard</a></p>
                    <p>-> <a onClick={() => navigate("/login")}>Fai il login o registrati </a></p>
                    <p>--------------</p>
                    <p><b>Creazione e modifica account abilitata</b></p>
                    <p><b>Creazione e modifica academy abilitata</b></p>
                    <p><b>Creazione e modifica news abilitata</b></p>
                    <p>--------------</p>

                </Col>
            </div>
        </div>
    )
}

export default StaticHome
