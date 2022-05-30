import React, {useState, useEffect} from 'react';
import {Row, Col} from "react-bootstrap"
import News from '../../../../components/news_card';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ScrollContainer from '../../../../components/scroll_container';
import { Fade, Skeleton } from '@mui/material';

function NewsForYou(props) {
    let windowInfo = props.windowInfo
    let content = props.content
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
      if(firstLoad && content != undefined) {
        content.loadNewsPerCategory("finanza") // personal news
        setFirstLoad(false)
      }
    }, [content])

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
  const [height, setHeight] = useState("auto")
  const [selectedNews, setSelectedNews] = useState(undefined)
  const [isHover, setIsHover] = useState(false)
  const [isEffectRunning, setIsEffectRunning] = useState(true)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    if(firstLoad && content != undefined) {
      let personalNews = Object.values(content.getPersonalNews())
      if(personalNews.length > 0) {
        setFadeIn(false)
        setSelectedNews(personalNews[0])
        setFirstLoad(false)
      }
    }

    if(selectedNews == null && content.getNewsPerCategory("finanza").length != 0) {
      setFadeIn(false)
      setSelectedNews(content.getNewsPerCategory("finanza")[0])
    }
  }, [content])

  useEffect(() => {
    if(windowInfo != undefined) {
      if(!windowInfo.mobileMode) setHeight(windowInfo.dashboardContainerHeight)
      else setHeight("auto")
    }
  }, [windowInfo.dashboardContainerHeight])

  useEffect(() => {
    let timer = setInterval(() => {}, 3000);

    if(selectedNews != null) {
        timer = setInterval(() => {
        let index = content.getNewsPerCategory("finanza").findIndex(item => item === selectedNews)
        index = (index + 1) % content.getNewsPerCategory("finanza").length
        if(!isHover) {
          setFadeIn(false)
          setTimeout(() => setSelectedNews(content.getNewsPerCategory("finanza")[index]), 200)
        } else setIsEffectRunning(!isEffectRunning)
      }, 3000)
    }

    return () => clearInterval(timer)
  }, [selectedNews, isEffectRunning])

  useEffect(() => {
    setFadeIn(false)
    setTimeout(() => setFadeIn(true), 400)
  }, [selectedNews])
  
  
  return <div id="for_you_section" style={{height: height}}>
    <div className="top_gradient"></div>
    <div className="bottom_gradient"></div>
    <div className="wallpaper_container">
      {
        selectedNews && selectedNews.getWallpaper() != "" ? 
        <Fade timeout={300} in={fadeIn}>
          <img className="wallpaper" src={selectedNews && selectedNews.getWallpaper()}/>
        </Fade> : 
        ""
      }
    </div>
    <div className="content">
      <div className="section_title_container p-5">
        <h1 className="section_title">Per i tuoi gusti</h1> 
      </div>
      <Col md="4" className="info_container m-5">
        <div className="space_between">
          <h2 className="title space_between">{selectedNews && selectedNews.getTitle()}</h2>
          <p>{selectedNews && selectedNews.getDescription()}</p>
          <div className="centered">
            <ArrowCircleRightIcon className="orange_icon bounce"/>
          </div>
        </div>
        <div className="separator"></div>
        <h6 className="author">Di {selectedNews && selectedNews.getAuthor()}</h6>
        <h6 className="time">{selectedNews && selectedNews.getPublishDate()}</h6>
      </Col>
      {
        content.getNewsPerCategory("finanza").length == 0 ?
        <div className="display_inline">
          <Skeleton width="200px" height={"100px"} className="m-2"/>
          <Skeleton width="200px" height={"100px"} className="m-2"/>
          <Skeleton width="200px" height={"100px"} className="m-2"/>
          <Skeleton width="200px" height={"100px"} className="m-2"/>
        </div> : 
        <ScrollContainer
        direction="horizontal"
        margin={15}
        mustVisible={content.getNewsPerCategory("finanza").indexOf(selectedNews)}>
          {
            content && content.getNewsPerCategory("finanza").map((item) => {
              return <div
                      style={{width: 400}}
                      className="m-2"
                      onMouseEnter={() => {
                        setFadeIn(false)
                        setTimeout(() => setSelectedNews(item), 200)
                        setIsHover(true)
                      }}
                      onMouseLeave={() => setIsHover(false)}>
                      <News
                        layout="rectangular"
                        content={item}
                        windowInfo={windowInfo}
                        selected={selectedNews && item.getId() == selectedNews.getId()}/>
                    </div>
            })
          }
        </ScrollContainer>
      }
    </div>
  </div>;
}

function MobileLayout(props) {
  let windowInfo = props.windowInfo
  let content = props.content

  return (
    <div>
      <h6 className="section_title mb-1 mt-3">Scelte per te</h6>
      <div className="mobile_news_list">
        {
          content && Object.values(content.getNewsPerCategory("finanza")).map((news) => {
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

export default NewsForYou;
