import { push } from "draft-js/lib/EditorState"
import webinarData from "../test_data/webinar"
import WebinarController from "./webinar"
import moment from "moment"
import $ from "jquery"
import { api_url } from "../App"

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

    async loadCreatedWebinar(n = 10) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false
        let info = undefined

        await $.ajax({
            type: "GET",
            url: api_url + "webinars",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => info = data['webinar'],
            error: () => error = true
        })
        
        if(error) throw Error("Errore nell'ottenere i webinar creati")
        // loading webinars
        for(let webinar of info) {
            let newWebinar = new WebinarController()
            newWebinar.setId(webinar['slug'])
            newWebinar.setTitle(webinar['title'])
            this.createdWebinar.push(newWebinar)
        }

        this.updateInfo()
    }

    async deleteWebinar(webinar) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        console.log(webinar)

        await $.ajax({
            type: "DELETE",
            url: api_url + "webinar/" + webinar.getId(),
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            error: () => error = true
        })

        if(error) throw Error("Errore nell'eliminazione")
        // updating list
        let webinarIndex = this.createdWebinar.indexOf(webinar)
        this.createdWebinar.splice(webinarIndex, 1)
        this.updateInfo()
    }
}

export default WebinarList