import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'

import routes from "./routes"

import "./style.css"

function SingleModule(props) {
    let windowInfo = props.windowInfo

    return (
        <div>
            <Routes>
                {Object.values(routes).map((route) =>
                    <Route path={route.url} element={route.component({windowInfo : windowInfo})} />
                )}
            </Routes>
        </div>
    )
}

export default SingleModule
