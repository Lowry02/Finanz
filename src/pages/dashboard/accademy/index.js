import React, {useState, useEffect} from 'react'
import SearchIcon from '@mui/icons-material/Search';

import { Row, Col } from "react-bootstrap"
import AccademyCard from '../../../components/accademy_card'

import "./style.css"
import { Fade } from '@mui/material'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
import ScrollContainer from '../../../components/scroll_container';

function AccademyPage(props) {
    let user = props.user
    let accademy = user ? user.modules : undefined
    let windowInfo = props.windowInfo

    const GENERAL_SECTION_FLAG = "Panoramica"
    const PERSONAL_SECTION_FLAG = "Scelti per Te"
    const CATEGORY_SECTION_FLAG = "Categorie"

    const [firstLoad, setFirstLoad] = useState(true)
    const [selectedSection, setSelectedSection] = useState(GENERAL_SECTION_FLAG)
    const [selectedCategory, setSelectedCategory] = useState(undefined)
    const [generalSectionContent, setGeneralSectionContent] = useState({})
    const [fadeIn, setFadeIn] = useState(true)

    function setGeneralNewsInfo() {
        if(accademy != undefined) {
            let list = {
                "Nuovi" : accademy.getModulesPerCategory()['Nuovi'],
                "I più seguiti" : accademy.getModulesPerCategory()['I più seguiti'],
                "Da vedere" : accademy.getModulesPerCategory()['Da vedere'],
            }
            setGeneralSectionContent(list)
        } else setGeneralSectionContent({})
    }

    useEffect(() => {
        if(firstLoad && accademy != undefined) {
            accademy.loadModulesPerCategory(10, 'Nuovi')
            accademy.loadModulesPerCategory(10, 'I più seguiti')
            accademy.loadModulesPerCategory(10, 'Da vedere')
            accademy.loadPersonalModules()
            accademy.loadInfoPersonalModules()
            accademy.loadCategories()
            console.log(accademy.getCategories())
            setSelectedCategory(Object.keys(accademy.getCategories())[0])
            setGeneralNewsInfo()
            setFirstLoad(false)
        }
    }, [accademy])

    useEffect(() => {
        setFadeIn(false)
        setTimeout(() => setFadeIn(true), 300)
    }, [selectedCategory])

    return (
        <div id="accademy_page">
            <div className="search_bar">
                <input placeholder="Cerca..."/>
                {
                    !windowInfo.mobileMode ?
                    <>
                        <SearchIcon className="orange_icon"/>
                        <br/>
                    </> : 
                    ""
                }
            </div>
            <div id="categories">
                <ScrollContainer
                isMobile={windowInfo.mobileMode}
                direction="horizontal"
                margin={0}>
                {
                    accademy && Object.keys(accademy.getCategories()).map((key) => {
                        if(key == "general")
                            return <div
                                    className={selectedSection == GENERAL_SECTION_FLAG ? "category_item bounce selected" : "category_item bounce"}
                                    onClick={() => setSelectedSection(GENERAL_SECTION_FLAG)}>
                                        <h5>Panoramica</h5>
                                    </div>
                        else if( key == "personal")
                            return <div
                                    className={selectedSection == PERSONAL_SECTION_FLAG ? "category_item bounce selected" : "category_item bounce"}
                                    onClick={() => setSelectedSection(PERSONAL_SECTION_FLAG)}>
                                        <h5>Scelti per Te</h5>
                                    </div>
                        else return <div
                                className={selectedCategory == key ? "category_item bounce selected" : "category_item bounce"}
                                onClick={() => {
                                    setSelectedSection(CATEGORY_SECTION_FLAG)
                                    setSelectedCategory(key)
                                    accademy.loadModulesPerCategory(10, key)
                                }}>
                                    <h5>{accademy.getCategories()[key]}</h5>
                                </div>
                    })
                }
                </ScrollContainer>
            </div>
            <div className="content_container">
                <Fade in={fadeIn} timeout={300}>
                    <div>
                        <FiremanPole
                        modulesList={accademy && accademy.getPersonalModules()}
                        modulesInfo={accademy && accademy.getInfoPersonalModules()}/>
                    </div>
                </Fade>
            </div>
        </div>
    )
}

function GeneralModules(props) {
    let content = props.content

    return <div id="general_modules">
        {
            Object.keys(content).map((title) => {
                return <div className="section_container">
                            <h3>{title}</h3>
                            <ScrollContainer
                            direction="horizontal">
                                {
                                    content[title][0].map((module) => {
                                        return <AccademyCard layout="design" content={module} />
                                    })
                                }
                            </ScrollContainer>
                       </div>
            })
        }
    </div>
}

function FiremanPole(props) {
    let modulesList = props.modulesList
    let modulesInfo = props.modulesInfo
    let windowInfo = props.windowInfo

    const [surveyAnswer, setSurveyAnswer] = useState(null)

    return (
        <Fade in={true} timeout={1000}>
            <Row className="mt-3">
                <Col md="5" id="right_bar" className="order-md-2">
                    <div className="program_info block">
                        <h1>{modulesInfo && "Ragiungerai i tuoi obbiettivi in " + modulesInfo['time']}</h1>
                        <p className="description">{modulesInfo && "Alla fine del tuo percorso potrai stupire chiunque tu voglia parlando di " + modulesInfo['args']}</p>
                    </div>
                    <br/>
                    <div className="survey block">
                        <h5>Quanto pensi che questo programma si addica alle tue necessità?</h5>
                        <div className="centered">
                            <div className="display_inline">
                                {
                                    [1,2,3,4,5].map((number) => 
                                        <div
                                        keys={number}
                                        className={"number centered bounce " + (surveyAnswer == number ? "selected" : "")}
                                        onClick={() => setSurveyAnswer(surveyAnswer == number ? null : number)}>
                                            <h5 className="m-0">{number}</h5>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <br/>
                </Col>
                <Col md="7" className="personal_courses order-md-1">
                    {
                        modulesList && Object.keys(modulesList).map((id, index) =>
                            <Row>
                                <Col xs="2" className="timeline">
                                    <div className="course_number">
                                        <h5 className="m-0">{index + 1}</h5>
                                    </div>
                                </Col>
                                <Col xs="10" keys={id}>
                                    <AccademyCard
                                    windowInfo={windowInfo}
                                    content={modulesList[id]}
                                    layout="default"/>
                                    <br />
                                </Col>
                            </Row>
                        )
                    }
                    <br/>
                    <br/>
                </Col>
            </Row>
        </Fade>
    )
}

function PerCategory(props) {
    let content = props.content

    return <div id="per_category">
        {
            content && content[0].map((module) => {
                return <AccademyCard layout="squared" content={module}/>
            })
        }
    </div>
}

export default AccademyPage
