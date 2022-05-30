import React, {useState, useEffect, useRef} from 'react';
import {Col, Row} from "react-bootstrap"
import News from '../../../../components/news_card';
import ScrollContainer from '../../../../components/scroll_container';
import Menu from "@mui/icons-material/Menu"
import { Box } from '@mui/system';
import { List, ListItem, Modal, Divider, Chip } from '@material-ui/core';
import { Dialog, ListItemButton, ListItemText } from '@mui/material';
import { Skeleton } from '@mui/material';

function NewsCategories(props) {
    let content = props.content
    let windowInfo = props.windowInfo

    useEffect(() => {
        if(content != undefined) content.loadCategories()
    }, [])

    return (
        <>
            {
                windowInfo.mobileMode ?
                <MobileLayout windowInfo={windowInfo} content={content} /> :
                <DesktopLayout windowInfo={windowInfo} content={content} />
            }
        </>
    )
}

function DesktopLayout(props) {
    let content = props.content
    let windowInfo = props.windowInfo

    const [loading, setLoading] = useState(false)
    const [height, setHeight] = useState("auto")
    const [categoryId, setCategoryId] = useState(0)
    const lastNewsBlock = useRef()
    const othersNewsBlock = useRef() // used to prevent errors
    const observer = useRef(new IntersectionObserver(() => {}))
    
    useEffect(() => {
        observer.current.disconnect()
        observer.current = new IntersectionObserver(async (e) => {
            let entity = e[0]
            let isIntersecting = entity['isIntersecting']

            if(isIntersecting) {
                // setLoading(true)
                await content.loadNewsPerCategory(categoryId)
                setLoading(false)
            }
        })

        if(lastNewsBlock.current != undefined) observer.current.observe(lastNewsBlock.current)
    }, [content.getNewsPerCategory(categoryId)])
    
    useEffect(() => {
        if(content && Object.values(content.getCategories()).length != 0 && categoryId == 0) {
            setCategoryId(Object.keys(content.getCategories())[0])
        }
    }, [content])

    useEffect(() => {
        if(categoryId != 0 && lastNewsBlock.current == undefined) content.loadNewsPerCategory(categoryId)
    }, [categoryId])
    
    
    useEffect(() => {
        function manageHeight() {
            let contentContainer = document.getElementById("content_container")
            let height = contentContainer.offsetHeight  
            if(!windowInfo.mobileMode) setHeight(height)
            else setHeight("auto")
        }

        window.addEventListener('resize', manageHeight)
        manageHeight()
    }, [])

    return <div id="news_categories" style={{height: height}}>
        <div id="gradient_effect"></div>
        <div className="content_container">
            <Row className="content_row">
                <Col md="4" className="sidebar" style={{height: height}}>
                    <div className="centered">
                        <h3>Categorie</h3>
                        <div className="search_bar text-center">
                            <input placeholder="Cerca..."/><br/>
                        </div>
                        <div className="list">
                            {
                                content && Object.keys(content.getCategories()).map(
                                    (key) => <div
                                              className={categoryId == key ? "bounce category_item selected" : "bounce category_item"}
                                              onClick={() => setCategoryId(key)}>
                                                    {content.getCategories()[key]}
                                            </div>
                                )
                            }
                        </div>
                    </div>
                </Col>
                <Col md="8" style={{display:"grid"}}>
                    {
                        content.getNewsPerCategory(categoryId).length != 0 ?
                            <ScrollContainer
                            style={{marginTop: "auto", marginBottom: "auto"}}
                            direction="horizontal">
                                {
                                    [...Array(Math.trunc(content.getNewsPerCategory(categoryId).length / 8) + 1)].map(
                                        (i, index) => <div style={{padding:20}} ref={index == Math.trunc(content.getNewsPerCategory(categoryId).length / 8) ? lastNewsBlock : othersNewsBlock}>
                                            <Col md="12"><News content={content.getNewsPerCategory(categoryId)[(index * 8) + 0]} windowInfo={windowInfo} layout="squared"/></Col>
                                            <Row>
                                                <Col md="6"><News content={content.getNewsPerCategory(categoryId)[(index * 8) + 1]} windowInfo={windowInfo} layout="squared"/></Col>
                                                <Col md="6"><News content={content.getNewsPerCategory(categoryId)[(index * 8) + 2]} windowInfo={windowInfo} layout="squared"/></Col>
                                            </Row>
                                            <Row>
                                                <Col md="4">
                                                    <News content={content.getNewsPerCategory(categoryId)[(index * 8) + 3]} windowInfo={windowInfo} layout="rectangular"/>
                                                    <News content={content.getNewsPerCategory(categoryId)[(index * 8) + 4]} windowInfo={windowInfo} layout="rectangular"/>
                                                </Col>
                                                <Col md="4">
                                                    <News content={content.getNewsPerCategory(categoryId)[(index * 8) + 5]} windowInfo={windowInfo} layout="rectangular"/>
                                                    <News content={content.getNewsPerCategory(categoryId)[(index * 8) + 6]} windowInfo={windowInfo} layout="rectangular"/>
                                                </Col>
                                                <Col md="4">
                                                    <News content={content.getNewsPerCategory(categoryId)[(index * 8) + 7]} windowInfo={windowInfo} layout="rectangular"/>
                                                    <News content={content.getNewsPerCategory(categoryId)[(index * 8) + 8]} windowInfo={windowInfo} layout="rectangular"/>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) 
                                }
                            </ScrollContainer> : 
                            <div className="p-5">
                                <Col md="12"><Skeleton height="200px" /></Col>
                                <Row>
                                    <Col md="6"><Skeleton height="200px" /></Col>
                                    <Col md="6"><Skeleton height="200px" /></Col>
                                </Row>
                                <Row>
                                    <Col md="4">
                                        <Skeleton height="200px" />
                                        <Skeleton height="200px" />
                                    </Col>
                                    <Col md="4">
                                        <Skeleton height="200px" />
                                        <Skeleton height="200px" />
                                    </Col>
                                    <Col md="4">
                                        <Skeleton height="200px" />
                                        <Skeleton height="200px" />
                                    </Col>
                                </Row>
                            </div>
                    }
                </Col>
                
            </Row>
        </div>
    </div>;
}

function MobileLayout(props) {
    let content = props.content
    let windowInfo = props.windowInfo
    const [categoryId, setCategoryId] = useState(-1)

    const observer = useRef(new IntersectionObserver(() => {}))
    const list_ref = useRef()

    useEffect(() => {
        observer.current.disconnect()

        observer.current = new IntersectionObserver((e) => {
            let info = e[0]
            if(info['isIntersecting']) content.loadNewsPerCategory(categoryId)
        })

        let element = list_ref.current.children[list_ref.current.children.length - 1]

        if(element != undefined) observer.current.observe(element)

    }, [content.getNewsPerCategory(categoryId)])

    useEffect(() => {
        if(Object.values(content.getCategories()).length != 0 && categoryId == -1)
            setCategoryId(Object.keys(content.getCategories())[0])
    }, [content])
    
    

    return (
        <div id="news_categories_mobile">
            <h6 className="section_title mb-1 mt-3">Per categoria</h6>
            <div className="categories_container">
                {
                    Object.keys(content.getCategories()).map(category => (
                        <Chip
                        className={"my_chip m-2 " + (categoryId == category ? "orange" : "")}
                        label={content.getCategories()[category]}
                        onClick={() => setCategoryId(category)}/>
                    ))
                }
            </div>
            <div className="mobile_news_list" ref={list_ref}>
                {
                    content && Object.values(content.getNewsPerCategory(categoryId)).map((news) => {
                        return <News
                        layout="rectangular_img"
                        content={news}
                        windowInfo={windowInfo}/>
                    })
                }
            </div>
        </div>
    )
}

export default NewsCategories;
