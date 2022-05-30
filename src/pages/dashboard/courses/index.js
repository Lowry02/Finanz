import React, { useEffect, useState } from 'react'
import CoursesBlock from '../../../components/courses_block'
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@material-ui/core';

import "./style.css"
import { Fade, Skeleton } from '@mui/material';

function CoursesPage(props) {
    let user = props.user
    let courses = user && props.user.courses
    let windowInfo = props.windowInfo
    const [firstLoad, setFirstLoad] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("")

    useEffect(async () => {
        if(firstLoad && courses) {
            await courses.loadCategories()
            await courses.loadAllCourses()
            // courses.loadCoursesPerCategory(10, "Nuovi")
            // courses.loadCoursesPerCategory(10, "Per iniziare")
            // courses.loadCoursesPerCategory(10, "I più seguiti")
            setFirstLoad(false)
        }
    }, [courses])

    return (
        <Fade in={true}>
            <div id="course_page">
                <div className="display_inline">
                    <div className="search_bar">
                        <input placeholder="Cerca..."/>
                        {!windowInfo.mobileMode ? <SearchIcon className="orange_icon"/> : ""}
                    </div>
                    {/* <div className={!windowInfo.mobileMode ? "" : ""}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label" className="label_orange">Categoria</InputLabel>
                            <Select
                            className="select my_input"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {
                                    courses && Object.keys(courses.getCategories()).map(
                                        (categoryId) => <MenuItem value={categoryId}>{courses.getCategories()[categoryId]}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                    </div> */}
                </div>
                {   firstLoad ? 
                    <div>
                        <Skeleton height={"200px"} style={{ marginBottom: "-50px"}}/>
                        <Skeleton height={"200px"} style={{ marginBottom: "-50px"}}/>
                        <Skeleton height={"200px"} style={{ marginBottom: "-50px"}}/>
                        <Skeleton height={"200px"} style={{ marginBottom: "-50px"}}/>
                    </div> :
                    courses && Object.keys(courses.getCategories()).map(categoryId => (
                        <CoursesBlock
                            id={categoryId}
                            content={courses && courses.getCoursesPerCategory()[categoryId]}
                            title={courses.getCategories()[categoryId]}
                            layout="long_right"
                            windowInfo={windowInfo}
                            />
                    ))
                }
            </div>
        </Fade>
    )
}

export default CoursesPage
