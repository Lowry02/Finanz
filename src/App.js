import React, { useState, useEffect, useRef } from 'react';

import { Route, useLocation } from "react-router-dom";
import routes from "./routes";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"
import CustomRouter from './components/custom_router';

export const api_url = "https://apifinanz.com/"

function App() {
  let location = useLocation()
  const [windowInfo, setWindowInfo] = useState({
    mobileMode : false,
    windowWidth : 0,
    windowHeight : 0,
    dashboardContainerHeight : 0
  })

  const observer = useRef()

  function updateWindowInfo() {
    let dashboardContainer = document.getElementById('content_container')
    let height = 0
    if(dashboardContainer != null) height = dashboardContainer.clientHeight

    setWindowInfo({
      mobileMode : window.innerWidth <= 768,
      windowWidth : window.innerWidth,
      windowHeight : window.innerHeight,
      dashboardContainerHeight : height
    })
  }
  
  useEffect(() => {
    updateWindowInfo()
  }, [location])
  
  useEffect(() => {
    updateWindowInfo()
    window.addEventListener('resize', () => updateWindowInfo())
    
    observer.current = new MutationObserver((e) => {
      if(document.getElementById('content_container') != undefined) {
        console.log(document.getElementById('content_container'))
        updateWindowInfo()
        observer.current.disconnect()
      }
    })

    observer.current.observe(document.body, { childList: true, subtree: true })
  }, [])

  return (
    <CustomRouter>
      {Object.values(routes).map((route) => 
        <Route path={route.url} element={route.component({windowInfo : windowInfo})} />
      )}
    </CustomRouter>
  )
}

export default App;
