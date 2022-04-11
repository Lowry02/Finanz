import React, {useState, useEffect} from 'react';
import {Row, Col} from "react-bootstrap"
import News from '../../../../components/news_card';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ScrollContainer from '../../../../components/scroll_container';
import { Fade } from '@mui/material';

function NewsForYou(props) {
    let windowInfo = props.windowInfo
    let content = props.content
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
      if(firstLoad && content != undefined) {
        content.loadPersonalNews()
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
      console.log(personalNews)
      if(personalNews.length > 0) {
        setSelectedNews(personalNews[0])
        setFirstLoad(false)
      }
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
        let index = Object.values(content.getPersonalNews()).findIndex(item => item === selectedNews)
        index = (index + 1) % Object.values(content.getPersonalNews()).length
        if(!isHover) {
          setSelectedNews(Object.values(content.getPersonalNews())[index])
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
      <Fade timeout={300} in={fadeIn}>
        <img className="wallpaper" src={selectedNews && selectedNews.getWallpaper()}/>
      </Fade>
    </div>
    <div className="content">
      <div className="section_title_container p-5">
        <h1 className="section_title">Per i tuoi gusti</h1> 
      </div>
      <Col md="4" className="info_container m-5">
        <div className="space_between">
          <h2 className="title space_between">{selectedNews && selectedNews.getTitle()}</h2>
          <div className="centered">
            <ArrowCircleRightIcon className="orange_icon bounce"/>
          </div>
        </div>
        <div className="separator"></div>
        <h6 className="author">Di {selectedNews && selectedNews.getAuthor()}</h6>
        <h6 className="time">{selectedNews && selectedNews.getPublishDate()}</h6>
      </Col>
      <ScrollContainer
      direction="horizontal"
      margin={15}
      mustVisible={Object.values(content.getPersonalNews()).indexOf(selectedNews)}>
        {
          content && Object.values(content.getPersonalNews()).map((item) => {
            return <div
                    style={{width: 400}}
                    className="m-2"
                    onMouseEnter={() => {
                      setSelectedNews(item)
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
          content && Object.values(content.getPersonalNews()).map((news) => {
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
