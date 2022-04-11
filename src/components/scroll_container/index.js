import React, {useEffect, useRef, useState} from 'react'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import $ from "jquery"
import "./style.css"

// TODO: risolvere bug responsive(bottoni restano disabilitati)

function ScrollContainer(props) {
  const DEFAULT_TOP_ARROW = <ArrowCircleDownIcon className="bounce orange_icon" style={{transform: "rotate(180deg)"}}/>
  const DEFAULT_BOTTOM_ARROW = <ArrowCircleDownIcon className="bounce orange_icon"/>
  const DEFAULT_LEFT_ARROW = <ArrowCircleDownIcon className="bounce orange_icon" style={{transform: "rotate(90deg)"}}/>
  const DEFAULT_RIGHT_ARROW = <ArrowCircleDownIcon className="bounce orange_icon" style={{transform: "rotate(-90deg)"}}/>

  let isMobile = props.isMobile
  let children = props.children
  let style = props.style
  children = Array.isArray(children) ? children : [children]
  let direction = props.direction // horizontal - vertical
  let margin = props.margin != undefined ? props.margin : 0 
  let mustVisible = props.mustVisible
  let LeftArrow = props.leftArrow
  let RightArrow = props.rightArrow
  LeftArrow = LeftArrow == undefined ? 
                direction == "horizontal" ? 
                  DEFAULT_LEFT_ARROW : 
                  DEFAULT_TOP_ARROW 
                : LeftArrow
  RightArrow = RightArrow == undefined ? 
                direction == "horizontal" ? 
                  DEFAULT_RIGHT_ARROW : 
                  DEFAULT_BOTTOM_ARROW 
                : RightArrow

  let containerRef = useRef()
  
  const [itemsDimension, setItemsDimension] = useState([])
  const [firstInViewPort, setFirstInViewPort] = useState(undefined)
  const [lastInViewPort, setLastInViewPort] = useState(undefined)
  
  function setRef(current) {
    let list = itemsDimension
    list.push(current)
    setItemsDimension(list)
  }

  function scroll(forward, n = 1) {
    let [_firstInViewPort, _lastInViewPort] = checkContainerSize()
    if(forward) {
      let lastIndex = _lastInViewPort + n > itemsDimension.length - 1 ? itemsDimension.length - 1 : _lastInViewPort + n
      let sum = 0
      for(let i = _lastInViewPort + 1; i <= lastIndex; i++) {
        sum += direction == "horizontal" ? itemsDimension[i].clientWidth : itemsDimension[i].clientHeight
        sum += margin
      }

      if(direction == "horizontal") $(containerRef.current).animate({scrollLeft: containerRef.current.scrollLeft + sum})
      else $(containerRef.current).animate({scrollTop: containerRef.current.scrollTop + sum})

      if(_lastInViewPort < lastIndex) setFirstInViewPort(_firstInViewPort + n)
      setLastInViewPort(lastIndex)
    } else {
      let firstIndex = _firstInViewPort - n < 0 ? 0 : _firstInViewPort - n
      let sum = 0
      for(let i = _firstInViewPort; i >= firstIndex; i--) { // TODO: da sistemare(va a passi di 4)
        sum += direction == "horizontal" ? itemsDimension[i].clientWidth : itemsDimension[i].clientHeight
        sum += margin
      }

      if(direction == "horizontal") $(containerRef.current).animate({scrollLeft: containerRef.current.scrollLeft - sum})
      else $(containerRef.current).animate({scrollTop: containerRef.current.scrollTop - sum})

      setFirstInViewPort(firstIndex)
      if(_firstInViewPort > firstIndex) setLastInViewPort(_lastInViewPort - n)
    }
  }

  function checkContainerSize() {
    let first = undefined
    let last = undefined
    let containerSize = direction == "horizontal" ? containerRef.current.clientWidth : containerRef.current.clientHeight
    let containerScroll = direction == "horizontal" ? containerRef.current.scrollLeft : containerRef.current.scrollTop
    let sum = 0
    for(let item of itemsDimension) {
      sum += direction == "horizontal" ? item.clientWidth : item.clientHeight
      sum += margin
      if(first == undefined && sum >= containerScroll) {
        first = item
        setFirstInViewPort(itemsDimension.indexOf(first))
      }
      if(sum <= containerSize + containerScroll) last = item
      else {
        setLastInViewPort(itemsDimension.indexOf(last))
        break
      }
    }
    return [itemsDimension.indexOf(first), itemsDimension.indexOf(last)]
  }

  useEffect(() => {
    if(children != undefined && itemsDimension.length == children.length) {
      checkContainerSize()
    }
  }, [itemsDimension, children])

  useEffect(() => {
    if(mustVisible != undefined) {
      if(children != undefined) {
        if(mustVisible < firstInViewPort) scroll(false, firstInViewPort - mustVisible)
        else if(mustVisible > lastInViewPort) scroll(true, mustVisible - lastInViewPort)
      }
    }
  }, [mustVisible, children])
  

  return (
    <div style={style} className={direction == "horizontal" ? "scroll_container horizontal" : "scroll_container vertical"}>
      <div
      style={{display : isMobile ? "none" : ""}}
      onClick={() => scroll(false)}
      className={firstInViewPort == 0 ? "arrow disabled" : "arrow"}>
        {LeftArrow}
      </div>
      <div className={direction == "horizontal" ? "list horizontal" : "list vertical"} ref={containerRef}>
      {
        children && children.map((item, i) => {
          return <Item
                  useRef={itemsDimension[i]}
                  content={item}
                  setRef={setRef}
                  style={direction == "horizontal" ? {marginLeft : margin/2, marginRight : margin/2} : {marginTop : margin/2, marginBottom : margin/2}}/>
        })
      }
      </div>
      <div
      style={{display : isMobile ? "none" : ""}}
      onClick={() => scroll(true)}
      className={lastInViewPort == (itemsDimension.length - 1) ? "arrow disabled" : "arrow"}>
        {RightArrow}
      </div>
    </div>
  )
}

function Item(props) {
  let content = props.content
  let setRef = props.setRef
  let style = props.style
  let ref = useRef()

  useEffect(() => {
    if(ref != null) setRef(ref.current)
  }, [ref])
  
  return <div className="item" ref={ref} style={style}>
    {content}
  </div>
}

export default ScrollContainer