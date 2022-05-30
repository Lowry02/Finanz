class Module {
    constructor() {
        this.id = ""
        this.author = ""
        this.socialPage = ""
        this.argument = ""
        this.difficultyLevel = ""
        this.position = 1
        this.n_modules = 0
        this.time = 30
        this.wallpaper = ""
        this.title = ""
        this.description = ""
        this.modules = {}
        this.publishDate = ""
        this.completedNotes = []
        this.quiz_type = "academy"
    }

    load({id = "", author = "", socialPage = "", argument = "", wallpaper = "", title = "", description = "", difficultyLevel = "", position = 1, modules = {}, publishDate = "", n_modules = "", time = 30, completedNotes = [], quiz_type = "academy"}) {
        this.id = id
        this.author = author
        this.socialPage = socialPage
        this.argument = argument
        this.wallpaper = wallpaper
        this.title = title
        this.description = description
        this.difficultyLevel = difficultyLevel
        this.position = position
        this.modules = modules
        this.publishDate = publishDate
        this.n_modules = n_modules
        this.time = time
        this.position = position
        this.completedNotes = completedNotes
        this.quiz_type = quiz_type
    }

    getId() {return this.id} 
    getAuthor() {return this.author}
    getSocialPage() {return this.socialPage}
    getArgument() {return this.argument}
    getWallpaper() {return this.wallpaper}
    getTitle() {return this.title}
    getDescription() {return this.description}
    getDifficultyLevel() {return this.difficultyLevel}
    getPosition() {return this.position}
    getModules() {return this.modules}
    getPublishDate() { return this.publishDate }
    getNModules() { return this.n_modules }
    getTime() { return this.time }
    getPosition() { return this.position }
    getCompletedNotes() { return this.completedNotes }
    getQuizType() { return this.quiz_type }

    setId(id) {this.id = id}
    setAuthor(author) {this.author = author}
    setSocialPage(socialPage) {this.socialPage = socialPage}
    setArgument(argument) {this.argument = argument}
    setWallpaper(wallpaper) {this.wallpaper = wallpaper}
    setTitle(title) {this.title = title}
    setDescription(description) {this.description = description}
    setDifficultyLevel(difficultyLevel) {this.difficultyLevel = difficultyLevel}
    setPosition(position) {this.position = position}
    setModules(modules) {this.modules = modules}
    setPublishDate(publishDate) { this.publishDate = publishDate }
    setNModules(n_modules) { this.n_modules = n_modules }
    setTime(time) { this.time = time }
    setPosition(position) { this.position = position }
    setCompletedNotes(completedNotes) { this.completedNotes = completedNotes }
    setQuizType(quiz_type) { this.quiz_type = quiz_type }
}

export default Module