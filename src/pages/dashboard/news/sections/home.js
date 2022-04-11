import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import News from '../../../../components/news_card';
import { Col, Row } from "react-bootstrap"
import $ from "jquery"

function NewsHome(props) {
    let content = props.content
    let windowInfo = props.windowInfo
    let scrollTo = props.scrollTo
    
    useEffect(() => {
        content.loadGeneralNews(6)
    }, []);

    return (
        <>
            {
                windowInfo['mobileMode'] ? 
                    <MobileLayout content={content} windowInfo={windowInfo} scrollTo={scrollTo} /> :
                    <DesktopLayout content={content} windowInfo={windowInfo} scrollTo={scrollTo} />
            }
        </>
    )
  
}

function DesktopLayout(props) { 
    let content = props.content
    let windowInfo = props.windowInfo
    let scrollTo = props.scrollTo

    return <div id="news-home">
        <div className="centered">
            <h1 className="text-shadow text-center">News</h1>
            <div className="search_bar text-center">
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
            <div className="text-center"> 
                <button className="button" onClick={() => scrollTo("daily")}>Del giorno</button>
                <button className="button" onClick={() => scrollTo("for_you")}>Per i tuoi gusti</button>
                <button className="button" onClick={() => scrollTo("categories")}>Per categoria</button>
            </div>
        </div>
        <div className="small_news_container">
            <Row>
                <Col md="1"></Col>
                <Col md="4">
                    <News
                    content={Object.values(content.getGeneralNews())[0]}
                    windowInfo={windowInfo}
                    layout="squared"
                    selected={true}/>
                    <News
                    content={Object.values(content.getGeneralNews())[1]}
                    windowInfo={windowInfo}
                    layout="squared"
                    selected={true}/>
                </Col>
                <Col md="2">
                    <News
                    content={Object.values(content.getGeneralNews())[2]}
                    windowInfo={windowInfo}
                    layout="squared"
                    selected={true}/>
                    <News
                    content={Object.values(content.getGeneralNews())[3]}
                    windowInfo={windowInfo}
                    layout="squared"
                    selected={true}/>
                </Col>
                <Col md="4">
                    <News
                    content={Object.values(content.getGeneralNews())[4]}
                    windowInfo={windowInfo}
                    layout="squared"
                    selected={true}/>
                    <News
                    content={Object.values(content.getGeneralNews())[5]}
                    windowInfo={windowInfo}
                    layout="squared"
                    selected={true}/>
                </Col>
                <Col md="1"></Col>
            </Row>
        </div>
    </div>;
}

function MobileLayout(props) {
    let content = props.content
    let windowInfo = props.windowInfo
    let scrollTo = props.scrollTo

    return (
        <div id="news-home">
            <div className="search_bar text-center">
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
            <h6 className="section_title">Panoramica</h6>
            {
                content && Object.values(content.getGeneralNews()).map((item) => {
                    return (
                        <News
                        content={Object.values(content.getGeneralNews())[4]}
                        windowInfo={windowInfo}
                        layout="rectangular"/>
                    )
                })
            }
        </div>
    )
}

export default NewsHome;
