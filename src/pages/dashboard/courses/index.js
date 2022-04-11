import React, { useEffect, useState } from 'react'
import CoursesBlock from '../../../components/courses_block'
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@material-ui/core';

import "./style.css"
import { Fade } from '@mui/material';

function CoursesPage(props) {
    let user = props.user
    let courses = user && props.user.courses
    let windowInfo = props.windowInfo
    const [firstLoad, setFirstLoad] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("")

    useEffect(() => {
        if(firstLoad && courses) {
            courses.loadCoursesPerCategory(10, "Nuovi")
            courses.loadCoursesPerCategory(10, "Per iniziare")
            courses.loadCoursesPerCategory(10, "I più seguiti")
            courses.loadCategories()
            setFirstLoad(false)
        }
    }, [courses])

    // function manageCategories(category) {
    //     let _temp = [...selectedCategories]
    //     if(selectedCategories.includes(category)) {
    //         let index = _temp.indexOf(category)
    //         if(index > -1) _temp.splice(index, 1)
    //     } else {
    //         _temp.push(category)
    //     }
    //     setSelectedCategories(_temp)
    // }

    return (
        <Fade in={true}>
        <div id="course_page">
            <div className="search_bar">
                <input placeholder="Cerca..."/>
                {!windowInfo.mobileMode ? <SearchIcon className="orange_icon"/> : ""}
                <div className={!windowInfo.mobileMode ? "centered" : ""}>
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
                </div>
                
            </div>
            <CoursesBlock
            id={'one'}
            content={courses && courses.getCoursesPerCategory()['Nuovi']}
            title={"Nuovi"}
            layout="long_right"
            windowInfo={windowInfo}
            />
            <CoursesBlock
            id={'two'}
            content={courses && courses.getCoursesPerCategory()['Per iniziare']}
            title={"Per iniziare"}
            layout="squared_left"
            windowInfo={windowInfo}
            />
            <CoursesBlock
            id={'two'}
            content={courses && courses.getCoursesPerCategory()['I più seguiti']}
            title={"I più seguiti"}
            layout="squared_left"
            windowInfo={windowInfo}
            />
        </div>
        </Fade>
    )
}

export default CoursesPage
