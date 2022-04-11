import React, {useEffect, useState} from 'react'
import {Routes, Route, useLocation, useNavigate} from "react-router-dom"
import UserController from '../../controllers/user_controller'
import ContainerLayout from './container_layout'

import dashbaord_routes from "./routes"
import main_routes from "../../routes"
import "./style.css"
import User from '../../models/user'
import exampleUser from '../../test_data/user'

function Dashbaord(props) {
    let windowInfo = props.windowInfo
    const [user, setUser] = useState(new UserController())
    const { state } = useLocation()
    let navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = "hidden"
        user.setState(setUser)

        if(user.isLogged()) {
            user.setInfo()
        } else {
            navigate(main_routes.login.path)
        }
    }, [])

    useEffect(() => {
        if(user === null) {
            navigate(main_routes.login.path)
        }
    }, [user])

    return (
        <div>
            <ContainerLayout windowInfo={windowInfo} user={user}>
                <Routes>
                    {Object.values(dashbaord_routes).map((route) =>
                        <Route path={route.url} element={route.component({windowInfo : windowInfo, user: user})} />
                    )}
                </Routes>
            </ContainerLayout>
        </div>
    )
}

export default Dashbaord
