class CommentModel {
    constructor(id = "", title = "", author = "", date = "", content = "", author_username = "") {
        this.id = id
        this.title = title
        this.author = author
        this.date = date
        this.content = content
        this.author_username = author_username
    }

    load({id = "", title = "", author = "", date = "", content = "", author_username = ""}) {
        this.id = id
        this.title = title
        this.author = author
        this.date = date
        this.content = content
        this.author_username = author_username
    }
}

export default CommentModel