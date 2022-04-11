import React, { useState, useEffect, useRef, forwardRef } from 'react'
import {Row, Col} from 'react-bootstrap'
import InfoIcon from '@mui/icons-material/Info';
import Fade from '@mui/material/Fade';
import { Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import "./style.css"
import CustomCalendar from '../../../components/calendar';
import ScrollContainer from '../../../components/scroll_container';
import { SwipeableDrawer } from '@material-ui/core';

function WebinarPage(props) {
    let windowInfo = props.windowInfo
    let user = props.user
    let webinar = user ? user.webinar : undefined
    let ref = useRef()
    const [height, setHeight] = useState(windowInfo.dashboardContainerHeight)
    const [webinarLoaded, setWebinarLoaded] = useState(false)
    const [selectedWebinar, setSelectedWebinar] = useState(undefined)
    const [fadeIn, setFadeIn] = useState(true)
    const [date, setDate] = useState()
    const [mustVisible, setMustVisible] = useState(0)

    function getMustVisible() {
        if(webinar != undefined) {
            for(let item of webinar.getList())
                if(item.getDate() == date) return webinar.getList().indexOf(item)
        }
    }
    
    useEffect(() => {
        if(mustVisible != undefined && webinar != undefined)
            setSelectedWebinar(webinar.getList()[mustVisible])
    }, [mustVisible])
    

    useEffect(() => {
        setMustVisible(getMustVisible())
    }, [date])

    useEffect(() => {
        if(webinar != undefined && !webinarLoaded) {
            webinar.loadWebinar()
            setSelectedWebinar(webinar.getList()[0])
            setWebinarLoaded(true)
        }
    }, [webinar])

    useEffect(() => {
        setFadeIn(false)
        setTimeout(() => setFadeIn(true), 400)
    }, [selectedWebinar])
    
    
    useEffect(() => {
        if(!windowInfo.mobileMode)
            setHeight(windowInfo.dashboardContainerHeight + 'px')
        else 
            setHeight('auto')
    }, [windowInfo.dashboardContainerHeight])

    return (
        <div id="webinar_page">
            {
                !windowInfo.mobileMode ? 
                <div className="content_container" style={{height: height}}>
                    <Row className="content">
                        <Col md="8" className="wallpaper_container">
                            <Fade in={fadeIn} timeout={300}>
                                <img src={selectedWebinar && selectedWebinar.getWallpaper()} className="wallpaper" />
                            </Fade>
                            <div className="vertical_gradient_effect"></div>
                            <div className="horizontal_gradient_effect"></div>
                            <div className="webinar_info">
                                <h2 className="title">{selectedWebinar && selectedWebinar.getTitle()}</h2>
                                <h6 className="date">{selectedWebinar && selectedWebinar.getDate()}</h6>
                                <div className="separator"></div>
                                <p className="description">{selectedWebinar && selectedWebinar.getDescription()}</p>
                            </div>
                        </Col>
                        <Col md="4" className="side_bar">
                            <div className="list_container">
                                <h5>Calendario</h5>
                                <div className="indented">
                                    <div className="calendar_container">
                                        <CustomCalendar
                                        ref={ref}
                                        date={webinar && webinar.getDate()}
                                        setDate={setDate}/>
                                    </div>
                                </div>
                                <hr />
                                <h6>Webinar in programma</h6>
                                <div style={{height: 300}}>
                                    <ScrollContainer
                                    mustVisible={mustVisible}
                                    direction="vertical"
                                    margin={10}>
                                        {
                                            webinar && webinar.getList().map((item) => 
                                                <div
                                                onClick={() => setSelectedWebinar(item)}
                                                className={selectedWebinar === item ? "webinar_item bounce selected" : "webinar_item bounce"}>
                                                    <h6 className="title">{item.getTitle()}</h6>
                                                    <p className="date m-0">{item.getDate()}</p>
                                                </div>
                                            )
                                        }
                                    </ScrollContainer>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div> : 
                <MobileView webinar={webinar} setDate={setDate} setSelectedWebinar={setSelectedWebinar} selectedWebinar={selectedWebinar}/>
            }
        </div>
    )
}

function MobileView(props) {
    let webinar = props.webinar 
    let setDate = props.setDate
    let selectedWebinar = props.selectedWebinar
    let setSelectedWebinar = props.setSelectedWebinar
    const [panelOpen, setPanelOpen] = useState(false)
    
    return (
        <>
        <div id="mobile_mode">
            <CustomCalendar
                date={webinar && webinar.getDate()}
                setDate={setDate}/>
            <hr/>
            <div className="list_container">
            {
                webinar && webinar.getList().map((item) => 
                    <div
                    onClick={() => {
                        setSelectedWebinar(item)
                        setPanelOpen(true)
                    }}
                    className={selectedWebinar === item ? "webinar_item bounce selected" : "webinar_item bounce"}>
                        <h6 className="title">{item.getTitle()}</h6>
                        <p className="date m-0">{item.getDate()}</p>
                    </div>
                )
            }
            </div>
        </div>
        <SwipeableDrawer
        anchor={'bottom'}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        style={{background: "transparent"}}>
            <div className="sliding_panel">
                <div className="swipable_area">
                    <div className="swipe_icon"></div>
                </div>
                <div className="wallpaper_container">
                    <img src={selectedWebinar && selectedWebinar.getWallpaper()} className="wallpaper"/>
                </div>
                <div className="info_container">
                    <h3>{selectedWebinar && selectedWebinar.getTitle()}</h3>
                    <h6>{selectedWebinar && selectedWebinar.getDate()}</h6>
                    <p className="thin">{selectedWebinar && selectedWebinar.getDescription()}</p>
                </div>
            </div>
        </SwipeableDrawer>
        </>
    )
}

export default WebinarPage
