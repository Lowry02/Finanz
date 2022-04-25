
import Question from "../models/question"
import { api_url } from "../App"
import $ from "jquery"

class QuestionController {
    constructor(question = new Question(), selectedChoices = [], state = undefined, overrideUpdateInfo = undefined) {
        this.question = question
        this.selectedChoices = selectedChoices       // contains selected choices ID
        this.state = state
        this.overrideUpdateInfo = overrideUpdateInfo
    }

    load({id, title, image, choices, acceptedChoices = 1, selectedChoices = []}) {
        this.question.load({id, title, image, choices, acceptedChoices})
        this.selectedChoices = selectedChoices
        this.updateInfo()
    }

    async loadById(id, quizType = "academy") {
        // checking quizType validity 
        let acceptedQuizType = ["academy", "course", "school"]
        if(!acceptedQuizType.includes(quizType)) {
            console.warn("quizType is not valid - " + quizType)
            throw Error("Internal error")
        }

        // TODO: (if necessary) settare parametri
        let accessToken = window.localStorage.getItem("accessToken")
        let quizInfo = {}
        let requestLink = ""

        if(quizType == "course") {
            // course quiz
            requestLink = "course/quiz/" + id
        } else if(quizType == "academy"){
            // nromal quiz
            requestLink = "/quiz/" + id
        } else if(quizType == "school") {
            // school quiz
            requestLink = "school/quiz/" + id
        }
        
        await $.ajax({
            type: "GET",
            url: api_url + requestLink,
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                quizInfo = data['quiz']
            }
        })

        return quizInfo
    }

    setOverrideUpdateInfo(callback) {
        this.overrideUpdateInfo = callback
    }

    updateInfo() {
        if(this.state != undefined) {
            this.state(new QuestionController(this.question, this.selectedChoices, this.state, this.overrideUpdateInfo))
        }
        else if(this.overrideUpdateInfo != undefined) {
            this.overrideUpdateInfo()
        }
    }

    getId() {return this.question.getId()}
    getTitle() {return this.question.getTitle()}
    getChoices() {return this.question.getChoices()}
    getImage() { return this.question.getImage() }
    getAcceptedChoices() {return this.question.getAcceptedChoices()}
    getSelectedChoices() {return this.selectedChoices}

    setId(id, _auto_save = true) {
        this.question.setId(id)
        if(_auto_save) this.updateInfo()
    }

    setTitle(title, _auto_save = true) {
        this.question.setTitle(title)
        if(_auto_save) this.updateInfo()
    }

    setChoices(choices, _auto_save = true) {
        this.question.setChoices(choices)
        if(_auto_save) this.updateInfo()
    }

    setImage(image, _auto_save = true) {
        this.question.setImage(image)
        if(_auto_save) this.updateInfo()
    }

    setAcceptedChoices(acceptedChoices, _auto_save = true) {
        this.question.setAcceptedChoices(acceptedChoices)
        if(_auto_save) this.updateInfo()
    }
    setSelectedChoices(selectedChoices, _auto_save = true) {
        this.selectedChoices = selectedChoices
        if(_auto_save) this.updateInfo()
    }

    setState(state) {
        this.state = state
    }

    addChoice(choice, id = undefined) {
        /**
         * choiche = {
         *  title: str,
         *  description: str,
         * }
         */
        let newId = ""

        if(id == undefined){
            newId = "_0"
            while(Object.keys(this.getChoices()).includes(newId)) newId = "_" + Math.random() * 10
        } else {
            newId = id
        }

        let _newChoices = this.getChoices()
        _newChoices[newId] = choice
        this.updateInfo()
    }

    addSelectedChoice(id, _auto_save = true) {
        if(id in this.getChoices()) {
            let _temp = this.getSelectedChoices()
            if(this.getAcceptedChoices())
                if(this.getSelectedChoices().length + 1 > this.getAcceptedChoices()) {
                    _temp = _temp.slice(1)
                }
            
            if(!_temp.includes(id)) _temp.push(id)
            
            this.setSelectedChoices(_temp, _auto_save)
        }
        if(_auto_save) this.updateInfo()
    }

    removeSelectedChoice(id, _auto_save = true) {
        let index = this.selectedChoices.indexOf(id)
        if(index > -1) this.selectedChoices.splice(index, 1)
        if(_auto_save) this.updateInfo()
    }

    isChoiceSelected(id) {return this.getSelectedChoices().includes(id)}

    exportQuestion() {
        return {
            title: this.getTitle(),
            image: this.getImage(),
            choices: this.getChoices(),
            acceptedChoices: this.getAcceptedChoices(),
            selectedChoices: this.getSelectedChoices()
        }
    }

    areChoicesSelected() {
        return this.getSelectedChoices().length == this.getAcceptedChoices()
    }
}

export default QuestionController