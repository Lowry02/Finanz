import React, { forwardRef, useEffect, useRef, useState } from 'react'
import NewsHome from './sections/home'
import DailyNews from './sections/daily'
import NewsCategories from './sections/categories'
import NewsForYou from './sections/for_you'
import "./style.css"

import $ from "jquery"
import NewsListController from '../../../controllers/news_list_controller'
import { TextField } from '@material-ui/core'
import { Fade } from '@mui/material'

function NewsPage(props) {
    let windowInfo = props.windowInfo
    const [content, setContent] = useState(new NewsListController())
    const homeContainer = useRef()
    const dailyContainer = useRef()
    const categoriesContainer = useRef()
    const forYouContainer = useRef()
    const currentSection = useRef()
    const timestamp = useRef(0)

    function scrollTo(sectionName) {
        let section
        let scrollQuantity
        if(sectionName == "home") {
            scrollQuantity = 0
            currentSection.current.section = homeContainer
            section = homeContainer.current
        }
        if(sectionName == "daily") {
            currentSection.current.section = dailyContainer
            section = dailyContainer.current
        }
        if(sectionName == "for_you") {
            currentSection.current.section = forYouContainer
            section = forYouContainer.current
        } 
        if(sectionName == "categories") {
            currentSection.current.section = categoriesContainer
            section = categoriesContainer.current
        }
        scrollQuantity = scrollQuantity != 0 ? $('#content_container').scrollTop() + $(section).offset().top : 0
        console.log($(section).offset().top)
        $('#content_container').animate({
            scrollTop : scrollQuantity
        })
    }

    function autoScroll(e) {
        if(!windowInfo.mobileMode) {
            let _timestamp = e.timeStamp
            console.log(e)
            if(_timestamp - timestamp.current > 100) {
                let target = e.currentTarget
                let sections = [homeContainer, dailyContainer, forYouContainer, categoriesContainer]
        
                if(!currentSection.current.isScrolling) {
                    let isScrollDown = e.deltaY > 0
                    let newIndexSection = sections.indexOf(currentSection.current.section)
                    if(isScrollDown) {
                        if(newIndexSection < 3) newIndexSection += 1
                    } else {
                        if(newIndexSection > 0) newIndexSection -= 1
                    }
                    currentSection.current.section = sections[newIndexSection]
                    currentSection.current.isScrolling = true
                    if(newIndexSection == 0) scrollTo('home')
                    if(newIndexSection == 1) scrollTo('daily')
                    if(newIndexSection == 2) scrollTo('for_you')
                    if(newIndexSection == 3) scrollTo('categories')
                    setTimeout(() => {
                        currentSection.current.isScrolling = false
                    }, 800)
                }
            }
            timestamp.current = _timestamp
        } else {
            document.querySelector("#content_container").style.overflowY = "auto"
        }
        
    }

    useEffect(() => {
        content.setState(setContent)
        currentSection.current = {
            section : homeContainer,
            isScrolling : false,
        }

        return () => {
            let container = document.querySelector("#content_container")
            if(container != undefined) container.style.overflow = ""
        }
    }, [])

    useEffect(() => {
        console.log('ciao')
        if(windowInfo.mobileMode) {
            document.querySelector("#content_container").style.overflowY = "auto"
        } else {
            document.querySelector("#content_container").style.overflowY = "hidden"
        }
        document.querySelector("#content_container").style.overflowX = "hidden"
    }, [{...windowInfo}])
    
    
    return (
        <Fade in={true}>
            <div id="news_page" onWheel={autoScroll}>
                <div ref={homeContainer}>
                    <NewsHome content={content} windowInfo={windowInfo} scrollTo={scrollTo}/>
                    <br />
                </div>
                <div ref={dailyContainer}>
                    <DailyNews content={content} windowInfo={windowInfo} useRef={homeContainer}/>
                </div>
                <div ref={forYouContainer}>
                    <NewsForYou content={content} windowInfo={windowInfo} useRef={homeContainer}/>
                </div>
                <div ref={categoriesContainer}>
                    <NewsCategories content={content} windowInfo={windowInfo} useRef={homeContainer}/>
                </div>
            </div>
        </Fade>
    )
}


export default NewsPage
