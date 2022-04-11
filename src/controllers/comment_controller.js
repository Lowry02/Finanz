import CommentModel from "../models/comment";

class CommentController {
    constructor(comment = new CommentModel(), state = undefined, overrideState = undefined) {
        this.comment = comment
        this.state = state
        this.overrideState = state
    }

    load(info) {
        this.comment.load(info)
    }

    updateInfo() {
        if(this.state != undefined)
            this.state(new CommentController(this.comment, this.state, this.overrideState))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    setState(state) {
        this.state = state
    }

    setOverrideState(overrideState) {
        this.overrideState = overrideState
    }

    getId() { return this.comment.id }
    getTitle() { return this.comment.title }
    getAuthor() { return this.comment.author }
    getDate() { return this.comment.date }
    getContent() { return this.comment.content }

    setId(id, _auto_save) {
        this.comment.id = id
        if(_auto_save) this.updateInfo()
    }

    setTitle(title, _auto_save = true) {
        this.comment.title = title
        if(_auto_save) this.updateInfo()
    }
    
    setAuthor(author, _auto_save = true) {
        this.comment.author = author
        if(_auto_save) this.updateInfo()
    }

    setDate(date, _auto_save = true) {
        this.comment.date = date
        if(_auto_save) this.updateInfo()
    }

    setContent(content, _auto_save = true) {
        this.comment.content = content
        if(_auto_save) this.updateInfo()
    }

    exportInfo() {
        return {
            id : this.getId(),
            title : this.getTitle(),
            content : this.getContent(),
            date : this.getDate(),
            author : this.getAuthor()
        }
    }
}

export default CommentController