import React from 'react'
import { Routes, Route } from 'react-router'
import ErrorPage from '../../pages/404'

function CustomRouter(props) {
  let children = props.children

  return (
    <Routes>
      {children}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default CustomRouter