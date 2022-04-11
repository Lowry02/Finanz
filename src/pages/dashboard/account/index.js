import { Fade } from '@mui/material'
import React, {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import routes from './routes'
import $ from "jquery"

import "./style.css"

function AccontPage(props) {
    let user = props.user
    let windowInfo = props.windowInfo

    return (
        <Fade in={true}>
        <div id="account_page">
            <Routes>
                {Object.values(routes).map((route) =>
                    <Route path={route.url} element={route.component({routes:routes, user:user, windowInfo:windowInfo})} />
                )}
            </Routes>
        </div>
        </Fade>
    )
}

export default AccontPage
