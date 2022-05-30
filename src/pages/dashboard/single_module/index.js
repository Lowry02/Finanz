import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import CustomRouter from '../../../components/custom_router'

import routes from "./routes"

import "./style.css"

function SingleModule(props) {
    let windowInfo = props.windowInfo

    return (
        <div>
            <CustomRouter>
                {Object.values(routes).map((route) =>
                    <Route path={route.url} element={route.component({windowInfo : windowInfo})} />
                )}
            </CustomRouter>
        </div>
    )
}

export default SingleModule
