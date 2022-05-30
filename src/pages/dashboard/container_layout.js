import React, {useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router'

import {Col} from "react-bootstrap"
import routes from './routes'

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DashboardHeader from './header'
import { Tooltip } from '@mui/material';


function ContainerLayout(props) {
    let windowInfo = props.windowInfo
    let content = props.children
    let user = props.user

    return (
        <div id="container_layout">
            <Col id="page_content_container" md="11" className="p-0 order-md-2">
                <PageContent windowInfo={windowInfo} content={content} user={user}></PageContent>
            </Col>
            <Col id="navbar_container" className="content_center p-0 order-md-1" md="1">
                <NavBar windowInfo={windowInfo} user={user}/>
            </Col>
        </div>
    )
}

function NavBar(props) {
    let windowInfo = props.windowInfo
    let user = props.user

    return (
        <div id="navbar">
            <div id="logo">
                <h1>Fi</h1>
            </div>
            <div className="routes">
                {Object.values(routes).map((item) => {
                    if(typeof item['icon'] != "undefined")
                        return <NavBarItem icon={item.icon} link={item.path} key={item.path} title={item.title}/>
                })}
            </div>
            <NavBarItem icon={<LogoutRoundedIcon className="orange_icon"/>} id="logout" onClick={() => user.logout()} link={'/'}  title="Esci"/>
        </div>
    )
}

function NavBarItem(props) {
    const [isActive, setIsActive] = useState(false)
    
    let icon = props.icon
    let link = props.link
    let title = props.title
    let id = props.id
    let onClick = props.onClick
    
    let navigate = useNavigate()
    let location = useLocation()

    useEffect(() => {
        if(location.pathname == link) setIsActive(true)
        else setIsActive(false)
    }, [location])
    
    return (
        <Tooltip title={title} placement="right" arrow>
            <div id={id == undefined ? "" : id} className={'navbar_item' + (isActive ? ' active' : '')} onClick={() => {
                if(onClick) onClick()
                if(link != undefined) navigate(link)
            }}>
                {icon}
            </div>
        </Tooltip>
    )
}

function PageContent(props) {
    let windowInfo = props.windowInfo
    let content = props.content
    let user = props.user
    const [_contentContainerHeight, set_contentContainerHeight] = useState('')

    useEffect(() => {
        if(windowInfo.mobileMode) {
            let newContentContainerHeight = windowInfo.windowHeight - 102 + "px"
            set_contentContainerHeight(newContentContainerHeight)
        } else set_contentContainerHeight('')
    }, [windowInfo])

    return (
        <div id="content_container" style={{height: _contentContainerHeight}}>
            <DashboardHeader user={user}/>
            {content}
        </div>
    )
}

export default ContainerLayout
