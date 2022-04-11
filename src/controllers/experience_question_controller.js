import QuestionController from "./question_controller"

const _question1 = {
    id: "1",
    title: "Cosa vorresti studiare?",
    choices: {
        1 : "Pino",
        2 : "Maria",
        3 : "Pierangelo"
    }
}

const _question2 = {
    id: "2",
    title: "Cosa vorresti assaggiare?",
    choices: {
        1 : "Pinoaaaa",
        2 : "Artura",
        3 : "fiordilatte"
    }
}

const _question3 = {
    id: "3",
    title: "Cosa vorresti mangiare?",
    choices: {
        1 : "Pino",
        2 : "Anto",
        3 : "Ioooo"
    }
}

class ExperienceQuestion{
    constructor(questions = [], state = undefined) {
        this.questions = questions
        this.state = state
    }

    setState(state) {
        this.state = state
    }

    updateInfo() {
        if(this.state !== undefined)
            this.state(new ExperienceQuestion(this.questions, this.state))
    }

    load(callback = undefined) {
        // API CALL
        let question1 = new QuestionController()
        question1.load(_question1)
        let question2 = new QuestionController()
        question2.load(_question2)
        let question3 = new QuestionController()
        question3.load(_question3)
        this.questions = [question1, question2, question3]
        this.updateInfo()
        if(callback !== undefined) callback()
    }

    getQuestions() {return this.questions}
}

export default ExperienceQuestion