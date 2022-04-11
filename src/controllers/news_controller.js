import News from "../models/news"
import CommentController from "./comment_controller"
import {api_url} from "../App"
import $ from "jquery"

class NewsController {
    constructor(news = new News(), state = undefined, overrideState = undefined) {
        this.news = news
        this.state = state
        this.overrideState = overrideState
    }

    setState(state) {
        this.state = state
    }

    updateState() {
        if(this.state !== undefined) {
            this.state(new NewsController(this.news, this.state, this.overrideState))
        } else if(this.overrideState != undefined) {
            this.overrideState()
        }
    }

    load(info) {
        this.news.load(info)
        this.updateState()
    }

    loadById(slug) {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "GET",
            url: api_url + "news/article/" + slug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let info = data['news']
                let auto_save = false

                this.setCategory(info['categories'], auto_save)
                this.setTitle(info['title'], auto_save)
                this.setWallpaper(info['coverImageLink'])
                this.setDescription(info['description'], auto_save)
                this.setContent(info['content'], auto_save)
                this.setId(info['slug'], auto_save)

                this.updateState()
            },
            error: (message) => console.log(message)
        })
    }

    // getCategories() {return this.categories}
    getId() { return this.news.getId() }
    getTitle() { return this.news.getTitle() }
    getDescription() { return this.news.getDescription() }
    getPublishDate() { return this.news.getPublishDate() }
    getAuthor() { return this.news.getAuthor() }
    getCategory() { return this.news.getCategory() }
    getContent() { return this.news.getContent() }
    getWallpaper() { return this.news.getWallpaper() }
    getSocialPage() { return this.news.getSocialPage() }
    getComments() { return this.news.getComments() }

    setId(id, _auto_save = true) {
        this.news.setId(id)
        if(_auto_save) this.updateState()
    }
    setTitle(title, _auto_save = true) {
        this.news.setTitle(title)
        if(_auto_save) this.updateState()
    }
    setDescription(description, _auto_save = true) {
        this.news.setDescription(description)
        if(_auto_save) this.updateState()
    }
    setPublishDate(publishDate, _auto_save = true) {
        this.news.setPublishDate(publishDate)
        if(_auto_save) this.updateState()
    }
    setAuthor(author, _auto_save = true) {
        this.news.setAuthor(author)
        if(_auto_save) this.updateState()
    }
    setCategory(category, _auto_save = true) {
        this.news.setCategory(category)
        if(_auto_save) this.updateState()
    }
    setWallpaper(wallpaper, _auto_save = true) {
        this.news.setWallpaper(wallpaper)
        if(_auto_save) this.updateState()
    }
    setSocialPage(socialPage, _auto_save = true) {
        this.news.setSocialPage(socialPage)
        if(_auto_save) this.updateState()
    }
    setComments(comments, _auto_save = true) {
        this.news.setComments(comments)
        if(_auto_save) this.updateState()
    }
    setOverrideState(callback) {
        this.overrideState = callback
    } 
    setContent(content, _auto_save = true) {
        this.news.setContent(content)
        if(_auto_save) this.updateState()
    }
    
    exportInfo() {
        return {
            id : this.getId(),
            title : this.getTitle(),
            description : this.getDescription(),
            publishDate : this.getPublishDate(),
            author : this.getAuthor(),
            category : this.getCategory(),
            content : this.getContent(),
            wallpaper : this.getWallpaper(),
            socialPage : this.getSocialPage(),
        }
        
    }

    addComment(info) {
        let _comment = new CommentController({...info})
        let newComments = this.getComments()
        newComments.push(_comment)
        this.setComments(newComments)
    }

    removeComment() {
        // TODO: da implementare
    }

    getComment(commentId) {
        return this.comments.map((comment) => {
            if(comment.getId() == commentId)
                return comment
        })
    }
}

export default NewsController