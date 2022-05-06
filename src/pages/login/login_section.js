import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Popup from '../../components/popup'

function LoginSection(props) {
    let user = props.user
    let routes = props.routes
    let setIsSigninIn = props.setIsSigninIn
    let navigate = useNavigate()

    const [showRestorePassword, setShowRestorePassword] = useState(false)

    return (
        <div>
            {
                showRestorePassword ? 
                    <RestorePassword user={user}/> :
                    <InsertCredentials setIsSigninIn={setIsSigninIn} user={user} routes={routes} setShowRestorePassword={setShowRestorePassword}/>
            }
            
        </div>
    )
}

function InsertCredentials(props) {
    let user = props.user
    let routes = props.routes
    let setIsSigninIn = props.setIsSigninIn
    let setShowRestorePassword = props.setShowRestorePassword
    let navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [checking, setChecking] = useState(false)
    const [theresError, setTheresError] = useState(false)

    function isCorrect() {
        setChecking(true)
        user.areCredentialsCorrect(username, password, manageError)
    }

    function manageError(isError) {
        if(isError) setTheresError(true)
        else navigate(routes.dashboard.path, {state: {user : user.exportInfo()}})
        setChecking(false)
    }

    function removePopup() {
        setTheresError(false)
    }

    return (
        <div onKeyDown={(e) => e.key == "Enter" ? isCorrect() : null}>
            <h1>Login</h1>
            <input
            className="input"
            placeholder="Username"
            autoFocus={true}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            {
                checking ?
                <div className="loading m-auto"></div> :
                <>
                    <button className="button bounce" onClick={isCorrect}>Accedi</button>
                    <p className="thin_orange" onClick={() => setShowRestorePassword(true)}>Password dimenticata?</p>
                    <br/>
                </>
            }
            <p className="thin_orange" onClick={() => setIsSigninIn(true)}>Registrati</p>
            {
                theresError ?
                <Popup isError={true} message="Username o password errati" removeFunction={removePopup}/>:
                ""
            }
        </div>
    )
}

function RestorePassword(props) {
    let user = props.user

    const [email, setEmail] = useState("")
    const [sentMail, setSentMail] = useState(false)
    const [theresError, setTheresError] = useState(false)
    const [showResend, setShowResend] = useState(false)

    function sendMail() {
        if(user.isValidEmail(email)) {
            setSentMail(true)
            user.sendMail(email)
            .then((data) => {
                console.log(data)
            })
            .catch((message) => {
                console.warn(message)
            })
            setInterval(() => setShowResend(true), 5000)
        } else {
            setTheresError(true)
        }
    }

    function removePopup() {
        setTheresError(false)
    }

    return (
        <div id="restore_password">
            <h1>Recupero Password</h1>
            <br/>
            {
                !sentMail ?
                    <>
                        <p className="m-0 thin">Non ti preoccupare!</p>
                        <p className="thin">Ti manderemo una mail con tutte le informazioni</p>
                        <input
                        className="input"
                        placeholder="Email"
                        type="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key == "Enter" ? sendMail() : null}
                        />
                        <br/>
                        <br/>
                        <button className="button" onClick={sendMail}>Conferma</button>

                    </> :
                    <>
                        <p className="thin">Email inviata a {email}!<br/>Controlla la tua casella di posta elettronica.</p>
                        <div className="centered">
                            <div className="loading"></div>
                        </div>
                        {
                            showResend ?
                                <button className="button" onClick={sendMail}>Invia di nuovo</button>:
                                ""
                        }
                    </>
            }
            <br/>
            {
                theresError ?
                <Popup isError={true} message="Email non inserita" removeFunction={removePopup}/>:
                ""
            }
        </div>
    )
}

export default LoginSection
