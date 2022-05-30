import React, {useEffect, useState} from 'react'
import {Route, useLocation, useNavigate} from "react-router-dom"
import UserController from '../../controllers/user_controller'
import ContainerLayout from './container_layout'

import dashbaord_routes from "./routes"
import main_routes from "../../routes"
import "./style.css"
import User from '../../models/user'
import exampleUser from '../../test_data/user'
import CustomRouter from '../../components/custom_router'
import logoGif from "../../media/img/logo.gif"
import { Fade } from '@material-ui/core'

function Dashbaord(props) {
    let windowInfo = props.windowInfo
    const [user, setUser] = useState(new UserController())
    const [loading, setLoading] = useState(true)
    const { state } = useLocation()
    let navigate = useNavigate()

    useEffect(async () => {
        document.body.style.overflow = "hidden"
        user.setState(setUser)

        if(user.isLogged()) {
            await user.setInfo()
            setLoading(false)
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
        loading ?
        <Fade in={loading}>
            <div id="loading_section" className="centered">
                <img className="img-fluid" src={logoGif} width="200px"/>
            </div>
        </Fade> :
        <Fade in={!loading}>
            <div>
                <ContainerLayout windowInfo={windowInfo} user={user}>
                    <CustomRouter>
                        {Object.values(dashbaord_routes).map((route) =>
                            <Route path={route.url} element={route.component({windowInfo : windowInfo, user: user})} />
                        )}
                    </CustomRouter>
                </ContainerLayout>
            </div>
        </Fade>
    )
}

export default Dashbaord
