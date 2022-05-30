import { api_url } from "../App"
import $ from "jquery"

class PaymentsController {
  constructor() {}

  async getUserPortal() {
    let accessToken = window.localStorage.getItem('accessToken')
    let link = ""

    await $.ajax({
      type: "GET",
      url: api_url + "stripe/user_portal",
      accepts: "json",
      contentType: "json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => link = data
    })

    return link
  }

  async getProducts() {
    let accessToken = window.localStorage.getItem('accessToken')
    let list = []

    await $.ajax({
      type: "GET",
      url: api_url + "stripe/products",
      accepts: "json",
      contentType: "json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => list = data['products']
    })

    return list
  }

  async checkout(productId) {
    let accessToken = window.localStorage.getItem('accessToken')
    let link = ""
    
    await $.ajax({
      type: "POST",
      url: api_url + "/stripe/check_out/" + productId,
      accepts: "json",
      contentType: "json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => link = data
    })

    return link
  }
}

export default PaymentsController