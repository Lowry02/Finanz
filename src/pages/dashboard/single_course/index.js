import React from 'react'
import {Routes, Route} from "react-router-dom"

import course_routes from "./routes"

function SingleCourse(props) {
    let windowInfo = props.windowInfo

    return (
        <Routes>
            {Object.values(course_routes).map((route) =>
                <Route path={route.url} element={route.component({windowInfo:windowInfo})} />
            )}
        </Routes>
    )
}

export default SingleCourse
