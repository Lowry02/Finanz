import SchoolController from "./school_controller"
import QuestionCreationController from "./question_creation_controller"
import $ from "jquery"
import { api_url } from "../App"

class SchoolListController {
  constructor() {
    this.quiz = []      // list of quiz
    this.list = []      // list of Schools
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
      let newIntstance = new SchoolListController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  // getter
  getList() { return this.list }
  getQuiz() { return this.quiz }

  // setter
  setList(list, auto_save = true) {
    this.list = list
    if(auto_save) this.updateInfo()
  }

  setQuiz(quiz, auto_save = true) {
    this.quiz = quiz
    if(auto_save) this.updateInfo()
  }

  addQuiz() {
    let newQuiz = new QuestionCreationController()
    newQuiz.question.setTitle("Nuovo quiz")
    newQuiz.setOverrideState((() => this.updateInfo()).bind(this))
    this.quiz.push(newQuiz)
    this.updateInfo()
  }

  async deleteQuiz(quiz) {
    let accessToken = window.localStorage.getItem('accessToken')
    let error = false

    // TODO: cancellare quiz non pubblicato
    if(quiz.question.getId() != "") {
      await $.ajax({
        type: "DELETE",
        url: api_url + "school/quiz/" + quiz.question.getId(),
        accepts: "application/json",
        contentType: "application/json",
        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        error: () => error = true
      })
    }

    if(error) throw Error("Errore nell'eliminazione")
    else {
      let quizIndex = this.quiz.indexOf(quiz)
      this.quiz.splice(quizIndex, 1)
      this.updateInfo()
    }
  }

  async deleteSchool(school) {
    let accessToken = window.localStorage.getItem('accessToken')
    let error = false

    await $.ajax({
      type: "DELETE",
      url: api_url + "school/" + school.getId(),
      accepts: "application/json",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      error: () => error = true
    })

    console.log('eliminato')

    if(error) throw Error("Errore nell'eliminazione")
    else {
      let schoolIndex = this.list.indexOf(school)
      this.list.splice(schoolIndex, 1)
      this.updateInfo()
      console.log('eliminato') 
    }
  }


  // API
  async loadList() {
    let accessToken = window.localStorage.getItem('accessToken')
    let info = {}
    let error = false 

    await $.ajax({
      type: "GET",
      url: api_url + "schools",
      accepts: "application/json",
      contentType: "application/json",
      beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
      success: (data) => info = data['schools'],
      error: () => error = true
    })

    for(let school of info) {
      let newSchool = new SchoolController()
      newSchool.setId(school['slug'])
      newSchool.setName(school['schoolName'])
      newSchool.setCode(school['code'])
      newSchool.setQuizNumber(school['quizNumber'])
      this.list.push(newSchool)
    }

    this.updateInfo()
    return { error: error, info: info }
  }

  async loadQuiz(forceLoad = false) {
    let accessToken = window.localStorage.getItem('accessToken')
    let info = {}
    let error = false

    if(this.quiz.length == 0) {
      await $.ajax({
        type: "GET",
        url: api_url + "school/quiz",
        accepts: "application/json",
        contentType: "application/json",
        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        success: (data) => info = data['quiz'],
        error: () => error = true
      })

      for(let quiz of info) {
        let newQuiz = new QuestionCreationController()
        newQuiz.setOverrideState((() => this.updateInfo()).bind(this))
        newQuiz.question.setId(quiz['slug'])
        newQuiz.question.setTitle(quiz['question'])
        newQuiz.question.setImage(quiz['coverImageLink'])

        for(let answer of quiz['answers']) {
          newQuiz.question.addChoice({
            title: answer['answer'],
            description: answer['description']
          }, answer['slug'])
          if(answer['isCorrect']) newQuiz.question.addSelectedChoice(answer['slug'])
        }


        this.quiz.push(newQuiz)
        this.updateInfo()
      }
    }

    return { error: error, info: info }
  }

  async publishQuiz() {
    // posting quiz 
    let quizType = "school"
    for(let quiz of this.getQuiz()) {
      let quizSlug = await quiz.publish(quizType)
    }
  }
}

export default SchoolListController