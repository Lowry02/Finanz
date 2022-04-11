
class NewsModel{
    constructor() {
        this.id = ""
        this.title = ""
        this.description = ""
        this.publishDate = ""
        this.author = ""
        this.category = {}
        this.content = ""
        this.wallpaper = ""
        this.socialPage = ""
        this.comments = []
    }

    load({id = "", title = "", description = "", publishDate = "", author = "", category = {}, content = "", wallpaper = "", socialPage = "", comments = []}) {
        this.id = id
        this.title = title
        this.description = description
        this.publishDate = publishDate
        this.author = author
        this.category = category
        this.content = content
        this.wallpaper = wallpaper
        this.socialPage = socialPage
        this.comments = comments
    }

    // Setter
    setId(id) { this.id = id }
    setTitle(title) { this.title = title }
    setDescription(description) { this.description = description }
    setPublishDate(publishDate) { this.publishDate = publishDate }
    setAuthor(author) { this.author = author }
    setCategory(category) { this.category = category }
    setContent(content) { this.content = content }
    setWallpaper(wallpaper) { this.wallpaper = wallpaper }
    setSocialPage(socialPage) { this.socialPage = socialPage }
    setComments(comments) { this.comments = comments }
    
    // Getter
    getComments() { return this.comments}
    getId() { return this.id }
    getTitle() { return this.title }
    getDescription() { return this.description }
    getPublishDate() { return this.publishDate }
    getAuthor() { return this.author }
    getCategory() { return this.category }
    getContent() { return this.content }
    getWallpaper() { return this.wallpaper }
    getSocialPage() { return this.socialPage }

    calcPubblicationTime() {}
}

export default NewsModel