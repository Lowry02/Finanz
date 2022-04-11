import QuestionCreationController from "./question_creation_controller"

class LoginQuestionController {
    constructor(list = [], state = undefined, overrideState = undefined) {
        this.list = list
        this.state = state
        this.overrideState = overrideState
    }

    // state management
    setState(state) {
        this.state = state
        this.updateInfo()
    }

    setOverrideState(overrideState) {
        this.overrideState = overrideState
        this.updateInfo()
    }

    updateInfo() {
        if(this.state != undefined)
            this.state(new LoginQuestionController(this.list, this.state, this.overrideState))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    // GET
    getList() { return this.list}

    // SET
    setList(list) {
        this.list = list
        this.updateInfo()
    }

    // manage list
    addQuestion() {
        let newQuestion = new QuestionCreationController()
        let id = this.getList().length + 1
        newQuestion.setOverrideState((() => this.updateInfo()).bind(this))
        newQuestion.question.setId(id)
        this.list.push(newQuestion)
        this.updateInfo()
    }

    removeQuestion(item) {
        let index = this.list.indexOf(item)
        this.list.splice(index,1)
        this.updateInfo()
    }
}

export default LoginQuestionController