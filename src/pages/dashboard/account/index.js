import { Fade } from '@mui/material'
import React, {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import routes from './routes'
import $ from "jquery"

import "./style.css"
import CustomRouter from '../../../components/custom_router'

function AccontPage(props) {
    let user = props.user
    let windowInfo = props.windowInfo

    return (
        <Fade in={true}>
        <div id="account_page">
            <CustomRouter>
                {Object.values(routes).map((route) =>
                    <Route path={route.url} element={route.component({routes:routes, user:user, windowInfo:windowInfo})} />
                )}              
            </CustomRouter>
        </div>
        </Fade>
    )
}

export default AccontPage
