import WebinarModel from "../models/webinar";
import { api_url } from "../App"
import $ from "jquery"

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

    async loadById(id) {
        let accessToken = window.localStorage.getItem('accessToken')

        await $.ajax({
            type: "GET",
            url: api_url + "webinar/" + id,
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                console.log(this)
                let auto_save = false
                this.setId(data['slug'], auto_save)
                this.setWallpaper(data['coverImage'], auto_save)
                this.setDescription(data['description'], auto_save)
                this.setEventChatIframe(data['eventChatIframe'], auto_save)
                this.setEventId(data['eventId'], auto_save)
                this.setEventVideoIframe(data['eventVideoIframe'], auto_save)
                this.setFInalVideoId(data['finalVideoId'], auto_save)
                this.setFinalVideoIFrame(data['finalVideoIframe'], auto_save)
                this.setGuest(data['guest'], auto_save)
                this.setGuestLink(data['guestLink'], auto_save)
                this.setIsFree(data['isFree'], auto_save)
                this.setDate(data['liveDatetime'].replaceAll(" ", "T").slice(0, this.getDate().length - 3), auto_save)
                this.setSociety(data['society'], auto_save)
                this.setSocietyLink(data['societyLink'], auto_save)
                this.setTitle(data['title'], auto_save)

                this.updateInfo()
                console.log()
            }
        })
    }

    getId() { return this.webinar.id }
    getTitle() { return this.webinar.title }
    getDescription() { return this.webinar.description }
    getDate() { return this.webinar.date }
    getAuthors() { return this.webinar.authors }
    getWallpaper() { return this.webinar.wallpaper }
    getSociety() { return this.webinar.society }
    getSocietyLink() { return this.webinar.societyLink }
    getGuest() { return this.webinar.guest }
    getGuestLink() { return this.webinar.guestLink }
    getIsFree() { return this.webinar.isFree }
    getEventId() { return this.webinar.eventId }
    getEventVideoIframe() { return this.webinar.eventVideoIframe }
    getEventChatIframe() { return this.webinar.eventChatIframe }
    getFinalVideoIframe() { return this.webinar.finalVideoIframe }
    getFinalVideoId() { return this.webinar.finalVideoId }

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

    setSociety(society) {
        this.webinar.society = society
        this.updateInfo()
    }

    setSocietyLink(societyLink) {
        this.webinar.societyLink = societyLink
        this.updateInfo()
    }

    setGuest(guest) {
        this.webinar.guest = guest
        this.updateInfo()
    }

    setGuestLink(guestLink) {
        this.webinar.guestLink = guestLink
        this.updateInfo()
    }

    setIsFree(isFree) {
        this.webinar.isFree = isFree
        this.updateInfo()
    }

    setEventId(eventId) {
        this.webinar.eventId = eventId
        this.updateInfo()
    }

    setEventVideoIframe(eventVideoIframe) {
        this.webinar.eventVideoIframe = eventVideoIframe
        this.updateInfo()
    }

    setEventChatIframe(eventChatIframe) {
        this.webinar.eventChatIframe = eventChatIframe
        this.updateInfo()
    }

    setFinalVideoIFrame(finalVideoIframe) {
        this.webinar.finalVideoIframe = finalVideoIframe
        this.updateInfo()
    }

    setFInalVideoId(finalVideoId) {
        this.webinar.finalVideoId = finalVideoId
        this.updateInfo()
    }

    checkContentValidity() {
        // wallpaper check 
        if(this.getWallpaper().replaceAll(" ", "") == "") return { error : true, message : "Wallpaper non inserito"}
        // date check
        if(this.getDate() == "") return { error : true, message : "Data non inserita"}
        // title check
        if(this.getTitle().replaceAll(" ", "") == "") return { error : true, message : "Titolo non inserito"}
        // description check
        if(this.getDescription().replaceAll(" ", "") == "") return { error : true, message : "Descrizione non inserita"}
        // check society
        if(this.getSociety().replaceAll(" ", "") == "") return { error : true, message : "Società non inserita"}
        // check societyLink
        if(this.getSocietyLink().replaceAll(" ", "") == "") return { error : true, message : "Link Società non inserito"}
        // check eventId
        if(this.getEventId().replaceAll(" ", "") == "") return { error : true, message : "Id evento non inserito"}
        // check guest
        if(this.getGuest().replaceAll(" ", "") == "") return { error : true, message : "Guest non inserito"}
        // check guestLink
        if(this.getGuestLink().replaceAll(" ", "") == "") return { error : true, message : "Link Guest non inserito"}
        // check eventId        
        if(this.getGuestLink().replaceAll(" ", "") == "") return { error : true, message : "Id evento non inserito"}
        // check eventVideoIframe
        if(this.getEventVideoIframe().replaceAll(" ", "") == "") return { error : true, message : "Iframe del video dell'evento non inserito"}
        // check eventChatIframe
        if(this.getEventChatIframe().replaceAll(" ", "") == "") return { error : true, message : "Iframe della chat non inserito"}
        // check finalVideoIframe
        if(this.getFinalVideoIframe().replaceAll(" ", "") == "") return { error : true, message : "Iframe del video finale non inserito"}
        // check finalVideoId
        if(this.getFinalVideoId().replaceAll(" ", "") == "") return { error : true, message : "Id del video finale non inserito"}

        return { error : false, message : "Tutto apposto"}
    }
}

export default WebinarController