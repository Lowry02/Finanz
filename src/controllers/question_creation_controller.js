import QuestionController from "./question_controller"
import $ from "jquery"
import {api_url} from "../App"
import {urlToFile} from "../utils"

class QuestionCreationController {
    constructor(question = new QuestionController(), correctChoices = [], state = undefined, overrideState = undefined) {
        this.question = question
        question.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
        this.correctChoices = correctChoices
        this.state = state
        this.overrideState = overrideState
    }

    setState(state) {
        this.state = state
    }

    load({question, correctChoices}) {
        if(question != undefined)
            this.question.load(question)
        if(correctChoices != undefined)
            this.setCorrectChoices(correctChoices)

        this.updateInfo()
    }

    setOverrideState(callback) {
        this.overrideState = callback
    }

    updateInfo() {
        if(this.state != undefined)
            this.state(new QuestionCreationController(this.question, this.correctChoices, this.state, this.overrideState))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    getCorrectChoices() {
        return this.correctChoices
    }

    getQuestion() {
        return this.question
    }

    setCorrectChoices(list, _auto_save) {
        this.correctChoices = list
        if(_auto_save) this.updateInfo()
    }

    setQuestion(question, _auto_save = true) {
        this.question = question
        if(_auto_save) this.updateInfo()
    }

    addCorrectChoice(choiceId) {
        let _correctChoices = this.getCorrectChoices()
        _correctChoices.push(choiceId)
        this.setCorrectChoices(_correctChoices)
    }

    removeCorrectChoice(choiceId) {
        let _correctChoices = this.getCorrectChoices()
        let index = _correctChoices.indexOf(choiceId)
        if(index > -1) _correctChoices.splice(index, 1)
        this.setCorrectChoices(_correctChoices)
    }

    deleteItem(id) {
        let _choices = this.question.getChoices()
        delete _choices[id]
        this.question.setChoices(_choices)
    }

    addItem(item, id = undefined) {
        let _choices = this.question.getChoices()
        let newId
        if(id == undefined)
            newId = Math.max(...Object.keys(_choices).map((n) => Number(n))) + 1 
        else
            newId = id
        if(newId == -Infinity) newId = 0
        _choices[newId] = item
        console.log(newId)
        this.question.setChoices(_choices)
    }

    async postQuestion(updateMode, quizType = "academy") {
        let accessToken = window.localStorage.getItem('accessToken')
        let quizSlug = undefined

        let requestType = ""
        let requestLink = ""

        if(updateMode) {
            requestType = "PUT"
            if(quizType == "course") {
                // course quiz
                requestLink = "course/quiz/" + this.question.getId()
            } else if(quizType == "academy"){
                // normal quiz
                requestLink = "quiz/" + this.question.getId()
            } else if(quizType == "school") {
                // normal quiz
                requestLink = "school/quiz/" + this.question.getId()
            }
        } else {
            requestType = "POST"
            if(quizType == "course") {
                // course quiz
                requestLink = "/course/quiz"
            } else if(quizType == "academy") {
                // normal quiz
                requestLink = "quiz"
            } else if(quizType == "school") {
                // normal quiz
                requestLink = "school/quiz"
            }
        }

        // used to send file
        let formData = new FormData()
        formData.append('question', this.question.getTitle())
        if(this.question.getImage().slice(0,5) != "https") {
            formData.append('picture', urlToFile(this.question.getImage()))
        }

        // deleting image
        if(this.question.getImage() == "" && updateMode) {
            let deleteLink = ""
            if(quizType == "course") {
                // course quiz
                deleteLink = "course/quiz/" + this.question.getId() +  "/image"
            } else if(quizType == "academy") {
                // acadmy quiz
                deleteLink = "/quiz/" + this.question.getId() +  "/image"
            } else if(quizType == "school") {
                // school quiz
                deleteLink = "school/quiz/" + this.question.getId() +  "/image"
            }

            $.ajax({
                type: "DELETE",
                url: api_url + deleteLink,
                accepts: "application/json",
                contentType: false,
                processData: false,
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            })
        }

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: false,
            processData: false,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: formData,
            success: (data) => {
                if(data['quiz'] == undefined) {
                    quizSlug = data['slug']
                } else {
                    quizSlug = data['quiz']['slug']
                }
                this.question.setId(quizSlug)
            },
            error: (message) => console.log(message)
        })

        return quizSlug
    }

    async postAnswer(questionSlug, answerId, updateMode, quizType = "academy") {
        let accessToken = window.localStorage.getItem('accessToken')
        let answerSlug = undefined
        
        let requestType = ""
        let requestLink = ""
        
        if(updateMode) {
            requestType = "PUT"
            if(quizType == "course") {
                // quiz course
                requestLink = "course/quiz/answer/" + answerId
            } else if(quizType == "academy") {
                // academy quiz
                requestLink = "quiz/answer/" + answerId
            } else if(quizType == "school") {
                // school quiz
                requestLink = "/school/quiz/answer/" + answerId
            }
        } else {
            requestType = "POST"
            if(quizType == "course") {
                // quiz course
                requestLink = "course/quiz/" + questionSlug + "/answer"
            } else if(quizType == "academy") {
                // normal quiz
                requestLink = "quiz/" + questionSlug + "/answers"
            } else if(quizType == "school") {
                // school quiz
                requestLink = "/school/quiz/" + questionSlug + "/answers"
            }
        }

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                answer: this.question.getChoices()[answerId]['title'],
                isCorrect: this.question.getSelectedChoices().includes(answerId),
                description: this.question.getChoices()[answerId]['description']
            }),
            success: (data) => {
                answerSlug = data['slug']
            },
            error: (message) => console.log(message)
        })

        return answerSlug
    }

    async publish(quizType = "academy") {
        // quizType validity check
        let acceptedQuizType = ["academy", "course", "school"]
        if(!acceptedQuizType.includes(quizType)) {
            console.warn("quizType is not valid - " + quizType)
            throw Error("Internal error")
        }

        let updateMode = this.question.getId() != ""

        // creating question
        let questionSlug = await this.postQuestion(updateMode, quizType)
        if(questionSlug == undefined) throw Error()

        // posting answers
        for(let answerId of Object.keys(this.question.getChoices())) {
            if(answerId[0] != "_" && updateMode) updateMode = true
            else updateMode = false

            let answerSlug = await this.postAnswer(questionSlug, answerId, updateMode, quizType)
            if(answerSlug == undefined) throw Error()
            
            // updating answers object
            this.question.getChoices()[answerSlug] = this.question.getChoices()[answerId]
            if(answerId != answerSlug)delete this.question.getChoices()[answerId]
        }

        let accessToken = window.localStorage.getItem('accessToken')

        // deleting answers
        let quizInfo = await this.question.loadById(this.question.getId(), quizType)
        let localAnsers = Object.keys(this.question.getChoices())
        let serverAnswers = Object.values(quizInfo['answers']).map(item => item?.slug)
        console.log(serverAnswers)

        let requestLink = ""
        if(quizType == "academy") {
            // academy quiz
            requestLink = "quiz/answer/"
        } else if(quizType == "course") {
            // course quiz
            requestLink = "course/quiz/answer/"
        } else if(quizType == "school") {
            // school quiz
            requestLink = "school/quiz/answer/"
        }

        for(let answerId of serverAnswers) {
            if(!localAnsers.includes(answerId)) {
                await $.ajax({
                    type: "DELETE",
                    url: api_url + requestLink + answerId,
                    accepts: "application/json",
                    contentType: "application/json",
                    beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                    error: () => questionSlug = undefined,
                })

                if(questionSlug == undefined) throw Error()
            }
        }

        return questionSlug
    }
}

export default QuestionCreationController