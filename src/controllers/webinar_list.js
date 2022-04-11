import { push } from "draft-js/lib/EditorState"
import webinarData from "../test_data/webinar"
import WebinarController from "./webinar"
import moment from "moment"

class WebinarList {
    constructor(list = [], createdWebinar = [], savedWebinar = [], state = undefined, overrideState = undefined) {
        this.list = list
        this.createdWebinar = createdWebinar
        this.savedWebinar = savedWebinar
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
            this.state(new WebinarList(this.list, this.createdWebinar, this.savedWebinar, this.state, this.overrideState))
        if(this.overrideState != undefined)
            this.overrideState()
    }

    getList() { return this.list }
    getCreatedWebinar() { return this.createdWebinar }
    getSavedWebinar() { return this.savedWebinar }
    
    setList(list) {
        this.list = list
        this.updateInfo()
    }

    setCreatedWebinar(createdWebinar) {
        this.createdWebinar = createdWebinar
        this.updateInfo()
    }

    setSavedWebinar(savedWebinar) {
        this.savedWebinar = savedWebinar
        this.updateInfo()
    }

    getDate() {
        let date = []
        this.getList().forEach((item) => date.push(item.getDate()))
        date.sort((a, b)=> moment(a, "DD/MM/YYYY").diff(moment(b, "DD-MM-YYYY")))
        return date
    }

    // API

    loadWebinar(n = 10) {
        let list = []

        for(let i = 0; i < n; i++) {
            let webinarExample = new WebinarController()
            let date = moment().add(i, 'days').format("DD/MM/YYYY")
            webinarExample.setId(webinarData.id)
            webinarExample.setTitle(webinarData.title)
            webinarExample.setDescription(webinarData.description)
            webinarExample.setDate(date)
            webinarExample.setAuthors(webinarData.authors)
            webinarExample.setWallpaper(webinarData.wallpaper)
            list.push(webinarExample)
        }
        this.list = list
        this.updateInfo()
    }

    loadSavedWebinar(n = 10) {
        let list = []

        for(let i = 0; i < n; i++) {
            let webinarExample = new WebinarController()
            webinarExample.setId(webinarData.id)
            webinarExample.setTitle(webinarData.title)
            webinarExample.setDescription(webinarData.description)
            webinarExample.setDate(webinarData.date)
            webinarExample.setAuthors(webinarData.authors)
            webinarExample.setWallpaper(webinarData.wallpaper)
            list.push(webinarExample)
        }
        this.savedWebinar = list
        this.updateInfo()
    }

    loadCreatedWebinar(n = 10) {
        let list = []

        for(let i = 0; i < n; i++) {
            let webinarExample = new WebinarController()
            webinarExample.setId(webinarData.id)
            webinarExample.setTitle(webinarData.title)
            webinarExample.setDescription(webinarData.description)
            webinarExample.setDate(webinarData.date)
            webinarExample.setAuthors(webinarData.authors)
            webinarExample.setWallpaper(webinarData.wallpaper)
            list.push(webinarExample)
        }
        this.createdWebinar = list
        this.updateInfo()
    }

    deleteWebinar(id) {
        this.list = this.list.map((webinar) => { if(webinar.getId() != id) return webinar})
        this.createdWebinar = this.createdWebinar.map((webinar) => { if(webinar.getId() != id) return webinar})
        this.savedWebinar = this.savedWebinar.map((webinar) => { if(webinar.getId() != id) return webinar})
        this.updateInfo()
    }
}

export default WebinarList