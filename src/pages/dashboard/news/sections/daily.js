import React, {useState, useEffect} from 'react';
import {Row, Col} from "react-bootstrap"
import News from '../../../../components/news_card';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScrollContainer from "../../../../components/scroll_container"
import Fade from '@mui/material/Fade';
import { Skeleton } from '@mui/material';

function DailyNews(props) {
  let windowInfo = props.windowInfo
  let content = props.content

  useEffect(() => {
      content.loadNewsPerCategory("economia") // daily news
  }, []);

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
  let windowInfo = props.windowInfo
  let content = props.content

  const [firstLoad, setFirstLoad] = useState(true)
  const [selectedNews, setSelectedNews] = useState(null);
  const [sidebarListHeight, setSidebarListHeight] = useState("auto")
  const [isHover, setIsHover] = useState(false)
  const [isEffectRunning, setIsEffectRunning] = useState(true)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    if(content && firstLoad) {
      if(Object.values(content.getDailyNews()).length > 0) {
        setFadeIn(false)
        setSelectedNews(Object.values(content.getDailyNews())[0])
        setFirstLoad(false)
      }
    }

    if(selectedNews == null && content.getNewsPerCategory("economia").length != 0) {
      setFadeIn(false)
      setSelectedNews(content.getNewsPerCategory("economia")[0])
    }
  }, [content]);

  useEffect(() => {
    if(!windowInfo.mobileMode) {
      setSidebarListHeight(windowInfo.dashboardContainerHeight + "px")
    } else {
      setSidebarListHeight("auto")
    }
  }, [windowInfo.dashboardContainerHeight])
  

  useEffect(() => {
    let timer = setInterval(() => {}, 3000);

    if(selectedNews != null) {
        timer = setInterval(() => {
        let index = content.getNewsPerCategory("economia").findIndex(item => item === selectedNews)
        index = (index + 1) % content.getNewsPerCategory("economia").length
        if(!isHover) {
          setFadeIn(false)
          setTimeout(() => setSelectedNews(content.getNewsPerCategory("economia")[index]), 200)
        } else setIsEffectRunning(!isEffectRunning)
      }, 3000)
    }

    return () => clearInterval(timer)
  }, [selectedNews, isEffectRunning])
  
  useEffect(() => {
    setFadeIn(false)
    setTimeout(() => setFadeIn(true), 500)
  }, [selectedNews])
  

  return <div id="daily_news" style={{height: windowInfo.dashboardContainerHeight}}>
      <Row className="content">
        <Col md="8" className="p-0">
        <div className="daily_news_info">
          <div className="vertical_gradient"></div>
          <div className="horizontal_gradient"></div>
          {
            selectedNews ? 
              <>
                <Fade in={fadeIn}>
                  <img src={selectedNews.getWallpaper()} />
                </Fade>
                <div className="info">
                  <div>
                    <h2 className="text-center">{selectedNews.getTitle()}</h2>
                    <div className="separator"></div>
                    <h6 className="text-center author">{selectedNews.getPublishDate()} - Di {selectedNews.getAuthor()}</h6>
                    <div className="text-center read_news bounce"><VisibilityIcon /></div>
                  </div>
                  <br/>
                </div>
              </>
            : ""
          }
        </div>
        </Col>
        <Col md="4" className="sidebar" style={{height: sidebarListHeight}}>
          <br/>
          <h4 className="text-center">News del giorno</h4>
          <div id="list">
            {
              content.getNewsPerCategory("economia") == 0 ?
              <div>
                <Skeleton sx={{ bgcolor: "grey.900"}} variant={"rectangular"} height={"150px"} />
                <br/>
                <Skeleton sx={{ bgcolor: "grey.900"}} variant={"rectangular"} height={"150px"} />
                <br/>
                <Skeleton sx={{ bgcolor: "grey.900"}} variant={"rectangular"} height={"150px"} />
                <br/>
                <Skeleton sx={{ bgcolor: "grey.900"}} variant={"rectangular"} height={"150px"} />
                <br/>
              </div> :
              <ScrollContainer
              isMobile={windowInfo.mobileMode}
              direction={windowInfo.mobileMode ? "horizontal" : "vertical"}
              margin={15}
              mustVisible={content.getNewsPerCategory("economia").indexOf(selectedNews)}>
                {content.getNewsPerCategory("economia").map((news, i) => {
                    return <div
                            id={i}
                            key={i}
                            onMouseEnter={() => {
                              setFadeIn(false)
                              setTimeout(() => setSelectedNews(news), 200)
                              setIsHover(true)
                              }}
                            onMouseLeave={() => setIsHover(false)}>
                              <News
                                layout="rectangular_img"
                                content={news}
                                windowInfo={windowInfo}
                                selected={selectedNews == news}/>
                            </div>
                  })}
                </ScrollContainer>
            }
          </div>
        </Col>
      </Row>
  </div>;
}

function MobileLayout(props) {
  let windowInfo = props.windowInfo
  let content = props.content

  return (
    <div>
      <h6 className="section_title mb-1 mt-1">Notizie del giorno</h6>
      <div className="mobile_news_list">
        {
          content && Object.values(content.getNewsPerCategory("economia")).map((news) => {
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

export default DailyNews;
