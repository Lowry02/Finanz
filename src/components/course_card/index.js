import React from 'react'
import routes from "../../pages/dashboard/routes"
import { useNavigate } from 'react-router'

import "./style.css"

function CourseCard(props) {
    let content = props.content
    let windowInfo = props.windowInfo
    let navigate = useNavigate()

    function handleClick() {
        navigate(routes.single_course.path + content.getId())
    }

    console.log(content)

    return (
        <div onClick={handleClick} className="course_card bounce">
            <img src={content.getWallpaper()} className="img-fluid wallpaper" />
            <div className="space_between date_author">
                {/* <p className="date mb-1">{content.getPublishDate()}</p> */}
                {/* <p className="author mb-1">Di {content.getAuthor()}</p> */}
            </div>
            <h5 className="title m-0">{content.getTitle()}</h5>
            <p className="description">{content.getDescription()}</p>
        </div>
    )
}

export default CourseCard
