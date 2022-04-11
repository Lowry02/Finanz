import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import routes from './routes'

function DashboardHeader(props) {
    const [title, setTitle] = useState("")
    const [isAccountPage, setIsAccountPage] = useState(false)
    let user = props.user
    
    let navigate = useNavigate()
    let location = useLocation()

    function openAccountPage() {
        navigate(routes.account.path)
    }

    useEffect(() => {
        Object.values(routes).map((route) => {
            if(location.pathname.includes(route.path)) setTitle(route.title)
        })

        if(location.pathname.includes(routes.account.path)) setIsAccountPage(true)
        else setIsAccountPage(false)
    }, [location])

    useEffect(() => {
        document.title = title
    }, [title])

    return (
        <div id="dashboard_header" className="">
            <h1 className="m-0">{title}</h1>
            {
                user === null || user === undefined ?
                "" :
                <div className={"profile_button display_inline bounce " + (isAccountPage ? "active" : "")} onClick={openAccountPage}>
                    <div className="info-container">
                        <h6 className="name">{user.getSurname()} {user.getName()}</h6>
                        <p className="username">{user.getUsername()}</p>
                    </div>
                    <div className="avatar_container">
                        <img src={user.getAvatar()} className=" avatar" />
                    </div>
                </div>
            }
        </div>
    )
}

export default DashboardHeader
