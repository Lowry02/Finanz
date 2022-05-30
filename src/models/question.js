class Question {
    constructor() {
        this.id = ""
        this.title = ""
        this.image = ""
        this.choices = {}
        this.acceptedChoices = 1
        this.type = undefined
    }

    load({id = "", title = "", image = "", choices = {}, acceptedChoices = [], type = undefined}) {
        this.id = id
        this.title = title
        this.image = image
        this.choices = choices
        this.acceptedChoices = acceptedChoices
        this.type = type
    }

    getId() {return this.id}
    getTitle() {return this.title}
    getImage() {return this.image}
    getChoices() {return this.choices}
    getAcceptedChoices() {return this.acceptedChoices}
    getType() {return this.type}

    setId(id) {this.id = id}
    setTitle(title) {this.title = title}
    setImage(image) {this.image = image}
    setChoices(choices) {this.choices = choices}
    setAcceptedChoices(acceptedChoices) {this.acceptedChoices = acceptedChoices}
    setType(type) {this.type = type}
}

export default Question