import React from 'react'

import CompactAccademyCard from './compact_layout'
import DefaultAccademyCard from './default_layout'
import SquaredAccademyCard from './squared_layout'

import { useNavigate } from 'react-router'
import routes from '../../pages/dashboard/routes'

import "./style.css"
import DesignAccademyCard from './design_layout'

function AccademyCard(props) {
    let content = props.content
    let layout = props.layout
    let windowInfo = props.windowInfo

    let navigate = useNavigate()

    let layoutObj = {
        compact : (props) => <CompactAccademyCard {...props}/>,
        default : (props) => <DefaultAccademyCard {...props}/>,
        squared : (props) => <SquaredAccademyCard {...props}/>,
        design : (props) => <DesignAccademyCard {...props}/>
    }

    function openModule() {
        navigate(routes.single_module.path + content.getId())
    }

    return (
        <div onClick={openModule}>
            {
                Object.keys(layoutObj).includes(layout) ?
                layoutObj[layout]({content: content, windowInfo : windowInfo}) :
                "ERRORE: non ho trovato nessun"
            }
        </div>
    )
}

export default AccademyCard
