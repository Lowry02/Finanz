import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import UserController from '../../controllers/user_controller'
import routes from "../../routes"
import LoginSection from './login_section'
import SignInSection from './signin_section'

import "./style.css"

function LoginPage(props) {
    const [user, setUser] = useState(new UserController())
    const [isLogged, setIsLogged] = useState(undefined)
    const [isSigninIn, setIsSigninIn] = useState(false)
    let navigate = useNavigate()

    useEffect(() => {
        user.setState(setUser)
    }, [])

    useEffect(() => {
        if(user.isLogged())
            user.getUserInfo(() => navigate(routes.dashboard.path, {state: {user : user.exportInfo()}}) )
        else setIsLogged(false)
    }, [user])

    return (
        <div id="registration">
            {
                isLogged == undefined ?
                "Loading..." :
                <>
                    <div className="content">
                        {
                            isSigninIn ? 
                            <SignInSection user={user} routes={routes} setIsSigninIn={setIsSigninIn} /> : 
                            <LoginSection user={user} routes={routes} setIsSigninIn={setIsSigninIn} />
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default LoginPage
