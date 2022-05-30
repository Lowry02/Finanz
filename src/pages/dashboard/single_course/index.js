import React from 'react'
import {Route} from "react-router-dom"
import CustomRouter from '../../../components/custom_router'

import course_routes from "./routes"

function SingleCourse(props) {
    let windowInfo = props.windowInfo

    return (
        <CustomRouter>
            {Object.values(course_routes).map((route) =>
                <Route path={route.url} element={route.component({windowInfo:windowInfo})} />
            )}
        </CustomRouter>
    )
}

export default SingleCourse
