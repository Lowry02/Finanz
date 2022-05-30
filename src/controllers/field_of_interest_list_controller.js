import FieldOfInterestController from "./field_of_interest_controller"
import $ from "jquery"
import { api_url } from "../App"
import TagController from "./tag_controller"

class FieldsOfInterestListController {
  constructor() {
    this.field_of_interest = []
    this.user_interests = []
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
      let newIntstance = new FieldsOfInterestListController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  getUserInterests() { return this.user_interests }

  getFieldOfInterest() { return this.field_of_interest }

  setUserInterests(user_interests, auto_save = true) {
    this.user_interests = user_interests
    if(auto_save) this.updateInfo()
  }

  setFieldOfInterest(field_of_interest, auto_save = true) {
    this.field_of_interest = field_of_interest
    if(auto_save) this.updateInfo()
  }

  async loadUserFieldsOfInterest() {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "GET",
      url: api_url + "user/fields_of_interest",
      accepts: "json",
      contentType: "json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => {
        let interests = data['interests']
        this.setUserInterests(interests.map(item => item.slug))
      }
    })
  }

  async loadFields() {
    let accessToken = window.localStorage.getItem("accessToken")

    if(this.field_of_interest.length == 0) {
      await $.ajax({
        type: "GET",
        url: api_url + "fields_of_interest",
        contentType: "application/json",
        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        success: (data) => {
          let fields = data['fieldsOfInterest']

          for(let field of fields) {
            let newFields = new FieldOfInterestController()
            newFields.setId(field['slug'])
            newFields.setName(field['name'])
            this.field_of_interest.push(newFields)
          }

          this.updateInfo()
          console.log(this.getFieldOfInterest())
        }
      })
    }
  }

  async create(name) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "POST",
      url: api_url + "fields_of_interest",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      data: JSON.stringify({
        name: name
      }),
      success: (data) => {
        let field = data['fieldOfInterest']
        let newField = new FieldOfInterestController()
        newField.setName(field['name'])
        newField.setId(field['slug'])
        this.field_of_interest.push(newField)
        this.updateInfo()
        console.log(this.field_of_interest)
      }
    })
  }

  async delete(id) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "DELETE",
      url: api_url + "field_of_interest/" + id,
      accepts: "json",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => {
        let fieldIndex = this.field_of_interest.map(item => item.getId()).indexOf(id)
        if(fieldIndex >= 0) {
          this.field_of_interest.splice(fieldIndex, 1)
          this.updateInfo()
        } 
      }
    })
  }

  async addUserFieldOfInterest(id) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "POST",
      url: api_url + "/field_of_interest/" + id + "/user_link",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: () => {
        this.user_interests.push(id)
        this.updateInfo()
      }
    })
  }

  async removeUserFieldOfInterest(id) {
    let accessToken = window.localStorage.getItem("accessToken")

    await $.ajax({
      type: "DELETE",
      url: api_url + "/field_of_interest/" + id + "/user_link",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: () => {
        let fieldIndex = this.user_interests.indexOf(id)
        if(fieldIndex >= 0) {
          this.user_interests.splice(fieldIndex, 1)
          this.updateInfo()
        }
      }
    })
  }

  async getTagPerField(fieldId) {
    let accessToken = window.localStorage.getItem("accessToken")
    let info = []

    await $.ajax({
      type: "GET",
      url: api_url + "/field_of_interest/" + fieldId + "/tags",
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

export default FieldsOfInterestListController