import QuestionCreationController from "./question_creation_controller";
import SchoolController from "./school_controller";
import $ from "jquery"
import { api_url } from "../App"
import { urlToFile } from "../utils";

class CreateSchoolController extends SchoolController {
  constructor() {
    super()
  }

  updateInfo() {
    if(this.state != undefined) {
      let newIntstance = new CreateSchoolController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  async postSchool(updateMode) {
    let accessToken = window.localStorage.getItem('accessToken')
    let info = undefined
    let error = false

    let requestType = ""
    let requestLink = ""

    if(updateMode) {
      // updating
      requestType = "PUT"
      requestLink = "school/" + this.getId()
    } else {
      // posting
      requestType = "POST"
      requestLink = "schools"
    }

    await $.ajax({
        type: requestType,
        url: api_url + requestLink,
        accepts: "application/json",
        contentType: "application/json",
        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        data: JSON.stringify({
          schoolName: this.getName(),
          quizNumber: this.getQuizNumber(),
          code: this.getCode()
        }),
        success: (data) => info = data['school'] == undefined ? data : data['school'],
        error: () => error = true
    })

    return { error: error, info: info }
  }

  async publish() {
    // setting update mode
    let updateMode = this.getId() != ""
    // posting school
    let { error, info } = await this.postSchool(updateMode)
    if(error) throw Error("Errore nella pubblicazione")

    let auto_save = false

    this.setId(info['slug'], auto_save)
    this.setName(info['schoolName'], auto_save)
    this.setCode(info['code'], auto_save)
    this.setQuizNumber(info['quizNumber'], auto_save)

    this.updateInfo()
  }

  isContentValid() {
    // name check
    if(this.getName().replaceAll(" ", "") == "") return { error : true, message : "Nome non inserito"}
    // number check
    if(this.getQuizNumber() == "" || isNaN(this.getQuizNumber()) || this.getQuizNumber() < 0) return { error : true, message : "Numero quiz è minore di zero"}
    // all right
    return { error : false, message : "Nessun errore"}
  }
}

export default CreateSchoolController