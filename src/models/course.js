class CourseModel {
    constructor() {
        this.id = ""
        this.title = ""
        this.argument = ""
        this.wallpaper = ""
        this.description = ""
        this.presentationVideo = ""
        this.presentationVideoId = ""
        this.professors = []
        this.offeredBy = [] //
        this.syllabus = ""
        this.publishDate = ""
        this.content = {}
        this.time = ""
        this.star = ""
        this.author = "" //
        this.n_video = 0 //
        this.comments = []
    }

    load({id = "", title = "", argument = "", description = "", presentationVideo = "", presentationVideoId = "", professors = "", syllabus = "", publishDate = "", content = {}, time = "", star = "", wallpaper = "", offeredBy = "", author = "", n_video = 0, comments = []}) {
        this.id = id
        this.title = title
        this.argument = argument
        this.presentationVideo = presentationVideo
        this.presentationVideoId = presentationVideoId
        this.professors = professors
        this.syllabus = syllabus
        this.description = description
        this.publishDate = publishDate
        this.time = time
        this.star = star
        this.wallpaper = wallpaper
        this.offeredBy = offeredBy
        this.author = author
        this.n_video = n_video
        this.content = content
        this.comments = comments
    }

    // Setter
    setId(id) { this.id = id }
    setTitle(title) { this.title = title }
    setArgument(argument) { this.argument = argument }
    setPresentationVideo(presentationVideo) { this.presentationVideo = presentationVideo }
    setPresentationVideoId(presentationVideoId) { this.presentationVideoId = presentationVideoId }
    setProfessors(professors) { this.professors = professors }
    setSyllabus(syllabus) { this.syllabus = syllabus }
    setDescription(description) { this.description = description }
    setPublishDate(publishDate) { this.publishDate = publishDate }
    setContent(content) { this.content = content }
    setTime(time) { this.time = time }
    setStar(star) { this.star = star }
    setWallpaper(wallpaper) { this.wallpaper = wallpaper }
    setOfferedBy(offeredBy) { this.offeredBy = offeredBy }
    setAuthor(author) { this.author = author }
    setNVideo(n_video) { this.n_video = n_video }
    setComments(comments) { this.comments = comments }
    
    // Getter
    getId() { return this.id }
    getTitle() { return this.title }
    getArgument() { return this.argument }
    getPresentationVideo() { return this.presentationVideo }
    getPresentationVideoId() { return this.presentationVideoId }
    getProfessors() { return this.professors }
    getSyllabus() { return this.syllabus }
    getDescription() { return this.description }
    getPublishDate() { return this.publishDate }
    getContent() { return this.content }
    getTime() { return this.time }
    getStar() { return this.star }
    getWallpaper() { return this.wallpaper }
    getOfferedBy() { return this.offeredBy }
    getAuthor() { return this.author }
    getNVideo() { return this.n_video }
    getCommentts() { return this.comments }

}

export default CourseModel