import React, {useState, useEffect} from 'react'
import CourseCard from '../course_card'
import ScrollContainer from '../scroll_container'

import "./style.css"

function CoursesBlock(props) {
    let id = props.id
    let content = props.content
    let windowInfo = props.windowInfo
    let title = props.title

    return (
        <div className="courses_block">
            <h2 className="title">{title}</h2>
            <div className="content_list">
                <ScrollContainer
                isMobile={windowInfo.mobileMode}
                direction="horizontal"
                margin={20}>
                    {
                        content && content.map((course) => {
                            return <div style={{width : windowInfo.mobileMode ? 300 : 350}}>
                                        <CourseCard
                                        windowInfo={windowInfo}
                                        content={course} />
                                    </div>
                        })
                    }
                </ScrollContainer>
            </div>
        </div>
    )
}

export default CoursesBlock
