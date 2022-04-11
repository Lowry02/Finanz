import WebinarModel from "../models/webinar";

class WebinarController {
    constructor(webinarInfo = new WebinarModel(), state = undefined, overrideState = undefined) {
        this.webinar = webinarInfo
        this.state = state
        this.overrideState = overrideState
    }

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
            this.state(new WebinarController(this.webinar, this.state, this.overrideState))
        if(this.overrideState != undefined)
            this.overrideState()
    }

    getId() { return this.webinar.id }
    getTitle() { return this.webinar.title }
    getDescription() { return this.webinar.description }
    getDate() { return this.webinar.date }
    getAuthors() { return this.webinar.authors }
    getWallpaper() { return this.webinar.wallpaper }

    setId(id) {
        this.webinar.id = id
        this.updateInfo()
    }

    setTitle(title) {
        this.webinar.title = title
        this.updateInfo()
    }

    setDescription(description) {
        this.webinar.description = description
        this.updateInfo()
    }

    setDate(date) {
        this.webinar.date = date
        this.updateInfo()
    }
    
    setAuthors(authors) {
        this.webinar.authors = authors
        this.updateInfo()
    }

    setWallpaper(wallpaper) {
        this.webinar.wallpaper = wallpaper
        this.updateInfo()
    }

    checkContentValidity() {
        // date check
        if(this.getDate() == "") return { error : true, message : "Data non inserita"}
        // title check
        if(this.getTitle().replaceAll(" ", "") == "") return { error : true, message : "Titolo non inserita"}
        // description check
        if(this.getDescription().replaceAll(" ", "") == "") return { error : true, message : "Descrizione non inserita"}
        // author check
        if(this.getAuthors().replaceAll(" ", "") == "") return { error : true, message : "Autori non inseriti"}
        return { error : false, message : "Tutto apposto"}
    }
}

export default WebinarController