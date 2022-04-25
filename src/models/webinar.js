class WebinarModel {
    constructor(id, title, description, date, authors, wallpaper) {
        this.id = id != undefined ? id : ""
        this.title = title != undefined ? title : ""
        this.description = description != undefined ? description : ""
        this.date = date != undefined ? date : ""
        this.authors = authors != undefined ? authors : ""
        this.wallpaper = wallpaper != undefined ? wallpaper : ""

        this.society = ""
        this.societyLink = ""
        this.guest = ""
        this.guestLink = ""
        this.isFree = false
        this.eventId = ""
        this.eventVideoIframe = ""
        this.eventChatIframe = ""
        this.finalVideoIframe = ""
        this.finalVideoId = ""
    }
}

export default WebinarModel