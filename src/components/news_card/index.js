import React, {useState} from 'react'
import { useNavigate } from 'react-router'
import CompactRectangularNews from "./compact_rectangular_news"
import RectangularNews from "./rectangular_news"
import SquaredNews from "./squared_news"
import routes from '../../pages/dashboard/routes'

import "./style.css"

function News(props) {
    let navigate = useNavigate()

    let selectedLayout = props.layout
    let content = props.content
    let windowInfo = props.windowInfo
    let selected = props.selected

    let newsLayout = {
        "squared" : (props) => <SquaredNews {...props}/>,
        "rectangular_img": (props) => <RectangularNews {...props}/>,
        "rectangular" : (props) => <CompactRectangularNews {...props}/>,
    }
        
    function handleClick() {
        navigate(routes.single_news.path + content.getId())
    }

    return (
            <>
                {
                    content != undefined ?
                        (Object.keys(newsLayout).includes(selectedLayout) ?
                            newsLayout[selectedLayout]({content : content, onClick : handleClick, windowInfo : windowInfo, selected: selected}) :
                            "ERRORE: non ho trovato alcun layout per la news") :
                        ""
                }
            </>
    )
}

export default News
