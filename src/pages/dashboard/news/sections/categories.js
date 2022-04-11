import React, {useState, useEffect} from 'react';
import {Col, Row} from "react-bootstrap"
import News from '../../../../components/news_card';
import ScrollContainer from '../../../../components/scroll_container';
import Menu from "@mui/icons-material/Menu"
import { Box } from '@mui/system';
import { List, ListItem, Modal, Divider } from '@material-ui/core';
import { Dialog, ListItemButton, ListItemText } from '@mui/material';

function NewsCategories(props) {
    let content = props.content
    let windowInfo = props.windowInfo

    function range(end, step) {
        let list = []
        for(let i = 0; i < end; i + step) list.push(i)
        return list
    }

    useEffect(() => {
        if(content != undefined) {
            content.loadCategories()
        }
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

    const [firstLoad, setFirstLoad] = useState(true)
    const [height, setHeight] = useState("auto")
    const [categoryId, setCategoryId] = useState(0)
    const [news, setNews] = useState([])

    useEffect(() => {
        if(content != undefined && firstLoad) {
            setCategoryId(Object.keys(content.getCategories())[0])
            setFirstLoad(false)
        }
    }, [content])
    

    useEffect(() => {
        function manageHeight() {
            let contentContainer = document.getElementById("content_container")
            let height = contentContainer.offsetHeight  
            if(!windowInfo.mobileMode)
                setHeight(height)
            else
                setHeight("auto")
        }

        setNews(Object.values(content.getNewsPerCategory(categoryId)))
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
                    <ScrollContainer
                    style={{marginTop: "auto", marginBottom: "auto"}}
                    direction="horizontal">
                        {[1,2,3].map(
                            (i) => <div style={{padding:20}}>
                            <Col md="12"><News content={news[0]} windowInfo={windowInfo} layout="squared"/></Col>
                            <Row>
                                <Col md="6"><News content={news[1]} windowInfo={windowInfo} layout="squared"/></Col>
                                <Col md="6"><News content={news[2]} windowInfo={windowInfo} layout="squared"/></Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <News content={news[3]} windowInfo={windowInfo} layout="rectangular"/>
                                    <News content={news[4]} windowInfo={windowInfo} layout="rectangular"/>
                                </Col>
                                <Col md="4">
                                    <News content={news[5]} windowInfo={windowInfo} layout="rectangular"/>
                                    <News content={news[6]} windowInfo={windowInfo} layout="rectangular"/>
                                </Col>
                                <Col md="4">
                                    <News content={news[7]} windowInfo={windowInfo} layout="rectangular"/>
                                    <News content={news[8]} windowInfo={windowInfo} layout="rectangular"/>
                                </Col>
                            </Row>
                        </div>
                        )}
                        
                        
                    </ScrollContainer>
                </Col>
                
            </Row>
        </div>
    </div>;
}

function MobileLayout(props) {
    let content = props.content
    let windowInfo = props.windowInfo
    const [categoryId, setCategoryId] = useState(10)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        console.log(content.getNewsPerCategory(categoryId))
    }, [categoryId])
    

    return (
        <div>
            <h6 className="section_title mb-1 mt-3">Per categoria <Menu onClick={() => setOpenDialog(true)}/></h6>
            <Dialog 
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            >
                <h6 className="m-3 mb-0">Categorie</h6>
                <List>
                    {
                        content && Object.keys(content.getCategories()).map(category => {
                            return (
                                <ListItemButton onClick={() => {
                                        setCategoryId(category)
                                        setOpenDialog(false)
                                    }}>
                                    <ListItemText primary={content.getCategories()[category]}/>
                                </ListItemButton>
                            )
                        })
                    }
                </List>
            </Dialog>
            <div>
                {/* {
                    content && Object.values(content.getNewsPerCategory(categoryId)).map((news) => {
                        return <News
                        layout="rectangular_img"
                        content={news}
                        windowInfo={windowInfo}/>
                    })
                } */}
            </div>
        </div>
    )
}

export default NewsCategories;
