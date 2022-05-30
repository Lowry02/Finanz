import React, { useEffect, useState } from 'react'
import PaymentsController from '../../../../../controllers/payments_controller'
import {Row, Col} from "react-bootstrap"
import { Skeleton } from '@mui/material'
import Popup from '../../../../../components/popup'

function Payments() {
  const [payments, setPayments] = useState(new PaymentsController())
  const [products, setProducts] = useState([])
  const [userPortal, setUserPortal] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  async function openInfo() {
    setShowPopup(true)
    window.open(userPortal, "blank")
  }

  async function buy(productId) {
    setShowPopup(true)
    let link = await payments.checkout(productId)
    window.open(link, "blank")
  }

  useEffect(async () => {
    let list = await payments.getProducts()
    setProducts(list)
    let link = await payments.getUserPortal()
    setUserPortal(link)
  }, [])
  
  return (
    <div id={"payments"}>
      <div className="space_between">
        <h2 className="m-0 centered">Abbonamento</h2>
        <div className="centered">
          {
            userPortal != "" ?
              <button className="button" onClick={openInfo}>Info</button> : 
              ""

          }
        </div> 
      </div>
      <br/>
      <div className="grid">
        {
          products.length != 0 ? 
            products.map((item, i) => (
              <div className="block bounce m-2" onClick={() => buy(item.price.id)}>
              <h1 className="text-center">{i + 1}</h1>
              <h5 className="text-center">{item.product_name}</h5>
              <p className="text-center m-0">{item.price.amount}€</p>
            </div>
          )) :
          <div>
            <Skeleton height="100px" className="m-0" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </div>
        }
      </div>
      {
        showPopup ?
          <Popup removeFunction={() => setShowPopup(false)} isError={false} message={"Caricamento..."}/> :
          ""
      }
    </div>
  )
}

export default Payments