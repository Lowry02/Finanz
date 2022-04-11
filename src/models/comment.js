class CommentModel {
    constructor(id = "", title = "", author = "", date = "", content = "") {
        this.id = id
        this.title = title
        this.author = author
        this.date = date
        this.content = content
    }

    load({id = "", title = "", author = "", date = "", content = ""}) {
        this.id = id
        this.title = title
        this.author = author
        this.date = date
        this.content = content
    }
}

export default CommentModel