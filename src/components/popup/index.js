import React, { useEffect } from 'react'

import xIcon from "../../media/icons/x.png"
import "./style.css"

function Popup(props) {
    let isError = props.isError
    let message = props.message
    let removePopup = props.removeFunction

    useEffect(() => {
        setTimeout(removePopup, 4000)
    }, [])

    return (
        <div id="popup-container">
            <div id="popup" className={"display_inline " + (isError ? 'red' : 'green')}>
                <p className="message">{message}</p>
                <div className="close" onClick={removePopup}>
                    <img src={xIcon} className="img-fluid"/>
                </div>
            </div>
        </div>
        
    )
}

export default Popup
