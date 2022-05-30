import Tag from "../models/tag"
import $ from "jquery"
import { api_url } from "../App"


class TagController extends Tag {
  constructor() {
    super()
    this.state = undefined
    this.overrideState = undefined
  }

  setState(state) {
    this.state = state
  }

  setOverrideState(overrideState) {
    this.overrideState = overrideState
  }

  updateInfo() {
    if(this.state != undefined) {
      let newIntstance = new TagController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  getName() { return this.name }
  getId() { return this.id }

  setName(name, auto_save = true) {
    this.name = name
    if(auto_save) this.updateInfo()
  }

  setId(id, auto_save = true) {
    this.id = id
    if(auto_save) this.updateInfo()
  }

  async linkFieldToTag(fieldId) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "POST",
      url: api_url + "/field_of_interest/" + fieldId + "/tag/" + this.id,
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => console.log(data)
    })
  }

  async unlinkFieldToTag(fieldId) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "DELETE",
      url: api_url + "/field_of_interest/" + fieldId + "/tag/" + this.id,
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => console.log(data)
    })
  }

  async linkTagToArg(argId) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "POST",
      url: api_url + "/academy/argument/" + argId + "/tag/" + this.id,
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => console.log(data)
    })
  }

  async unlinkTagToArg(argId) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "DELETE",
      url: api_url + "/academy/argument/" + argId + "/tag/" + this.id,
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => console.log(data)
    })
  }


  async linkTagToNews(newsId) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "POST",
      url: api_url + "/news/" + newsId + "/tag/" + this.id,
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => console.log(data)
    })
  }

  async unlinkTagToNews(newsId) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "DELETE",
      url: api_url + "/news/" + newsId + "/tag/" + this.id,
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => console.log(data)
    })
  }

}

export default TagController