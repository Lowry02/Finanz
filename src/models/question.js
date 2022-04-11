class Question {
    constructor() {
        this.id = ""
        this.title = ""
        this.image = ""
        this.choices = {}
        this.acceptedChoices = 1
    }

    load({id = "", title = "", image = "", choices = {}, acceptedChoices = []}) {
        this.id = id
        this.title = title
        this.image = image
        this.choices = choices
        this.acceptedChoices = acceptedChoices
    }

    getId() {return this.id}
    getTitle() {return this.title}
    getImage() {return this.image}
    getChoices() {return this.choices}
    getAcceptedChoices() {return this.acceptedChoices}

    setId(id) {this.id = id}
    setTitle(title) {this.title = title}
    setImage(image) {this.image = image}
    setChoices(choices) {this.choices = choices}
    setAcceptedChoices(acceptedChoices) {this.acceptedChoices = acceptedChoices}
}

export default Question