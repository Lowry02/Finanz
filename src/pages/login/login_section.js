import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Popup from '../../components/popup'

function LoginSection(props) {
    let user = props.user
    let routes = props.routes
    let setIsSigninIn = props.setIsSigninIn
    let navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [checking, setChecking] = useState(false)
    const [theresError, setTheresError] = useState(false)

    function removePopup() {
        setTheresError(false)
    }

    function manageError(isError) {
        if(isError) setTheresError(true)
        else navigate(routes.dashboard.path, {state: {user : user.exportInfo()}})
        setChecking(false)
    }

    function isCorrect() {
        setChecking(true)
        user.areCredentialsCorrect(username, password, manageError)
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
                <button className="button bounce" onClick={isCorrect}>Accedi</button>
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

export default LoginSection
