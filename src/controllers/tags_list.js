import $, { post } from "jquery"
import { api_url } from "../App"
import TagController from "./tag_controller"

class TagListController {
  constructor() {
    this.list = []
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
      let newIntstance = new TagListController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  getList() { return this.list }

  setList(list, auto_save = true) {
    this.list = list
    if(auto_save) this.updateInfo()
  }

  async loadTags() {
    let accessToken = window.localStorage.getItem("accessToken")

    if(this.list.length == 0) {
      await $.ajax({
        type: "GET",
        url: api_url + "tags",
        contentType: "application/json",
        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        success: (data) => {
          let fields = data['tags']

          for(let field of fields) {
            let newFields = new TagController()
            newFields.setId(field['slug'])
            newFields.setName(field['name'])
            this.list.push(newFields)
          }

          this.updateInfo()
          console.log(this.getList())
        }
      })
    }
  }

  async create(name) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "POST",
      url: api_url + "tags",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      data: JSON.stringify({
        name: name
      }),
      success: (data) => {
        let newFields = new TagController()
        newFields.setId(data['slug'])
        newFields.setName(data['name'])
        this.list.push(newFields)
        this.updateInfo()
      }
    })
  }

  async delete(id) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "DELETE",
      url: api_url + "tag/" + id,
      accepts: "json",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => {
        let tagIndex = this.list.map(tag => tag.getId()).indexOf(id)
        console.log(tagIndex)
        if(tagIndex >= 0) {
          this.list.splice(tagIndex, 1)
          this.updateInfo()
        }
      }
    })
  }

  async getTagPerArgument(argumentId) {
    let accessToken = window.localStorage.getItem("accessToken")
    let info = []

    await $.ajax({
      type: "GET",
      url: api_url + "/academy/argument/" + argumentId + "/tags",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => {
        info = data['tags'].map((tag) => {
          let newTag = new TagController()
          newTag.setName(tag.name)
          newTag.setId(tag.slug)
          return newTag
        })
      }
    })

    return info
  }

  async getTagPerNews(newsId) {
    let accessToken = window.localStorage.getItem("accessToken")
    let info = []

    await $.ajax({
      type: "GET",
      url: api_url + "/news/" + newsId + "/tags",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => {
        info = data['tags'].map((tag) => {
          let newTag = new TagController()
          newTag.setName(tag.name)
          newTag.setId(tag.slug)
          return newTag
        })
      }
    })

    return info
  }
}

export default TagListController