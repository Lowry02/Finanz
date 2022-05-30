
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
        this.comment_page_index = 1
        this.isSaved = false
        this.isLiked = false
    }

    load({id = "", title = "", description = "", publishDate = "", author = "", category = {}, content = "", wallpaper = "", socialPage = "", comments = [], comment_page_index = 1, isSaved = false, isLiked = false}) {
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
        this.comment_page_index = comment_page_index
        this.isSaved = isSaved  
        this.isLiked = isLiked
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
    setCommentPageIndex(comment_page_index) { this.comment_page_index = comment_page_index }
    setIsSaved(isSaved) { this.isSaved = isSaved }
    setIsLiked(isLiked) { this.isLiked = isLiked }
    
    // Getter
    getComments() { return this.comments}
    getCommentPageIndex() { return this.comment_page_index}
    getId() { return this.id }
    getTitle() { return this.title }
    getDescription() { return this.description }
    getPublishDate() { return this.publishDate }
    getAuthor() { return this.author }
    getCategory() { return this.category }
    getContent() { return this.content }
    getWallpaper() { return this.wallpaper }
    getSocialPage() { return this.socialPage }
    getIsSaved() { return this.isSaved }
    getIsLiked() { return this.isLiked }

    calcPubblicationTime() {}
}

export default NewsModel