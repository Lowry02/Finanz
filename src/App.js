import React, { useState, useEffect } from 'react';

import { Routes, Route, useLocation } from "react-router-dom";

import TestPage from './pages/test';
import routes from "./routes";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"

export const api_url = "https://finanz-developing.herokuapp.com/"

function App() {
  let location = useLocation()
  const [windowInfo, setWindowInfo] = useState({
    mobileMode : false,
    windowWidth : 0,
    windowHeight : 0,
    dashboardContainerHeight : 0
  })

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
    window.addEventListener('resize', () => updateWindowInfo())
  }, [])

  useEffect(() => {
    updateWindowInfo()
  }, [location])
  

  return (
    <Routes>
      {Object.values(routes).map((route) => 
        <Route path={route.url} element={route.component({windowInfo : windowInfo})} />
      )}
    </Routes>
  )
}

export default App;
