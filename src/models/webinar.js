class WebinarModel {
    constructor(id, title, description, date, authors, wallpaper) {
        this.id = id != undefined ? id : undefined
        this.title = title != undefined ? title : ""
        this.description = description != undefined ? description : ""
        this.date = date != undefined ? date : ""
        this.authors = authors != undefined ? authors : ""
        this.wallpaper = wallpaper != undefined ? wallpaper : ""
    }
}

export default WebinarModel