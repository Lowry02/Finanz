import News from "../models/news"
import CommentController from "./comment_controller"
import {api_url} from "../App"
import $ from "jquery"
import moment from "moment"

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

    async loadById(slug) {
        let accessToken = window.localStorage.getItem("accessToken")

        return $.ajax({
            type: "GET",
            url: api_url + "news/article/" + slug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let info = data['news']
                let auto_save = false
                let author = data['news']['author']['personalData']
                this.setAuthor(author['surname'] + " " + author['name'])
                this.setCategory(info['categories'], auto_save)
                this.setTitle(info['title'], auto_save)
                this.setWallpaper(info['coverImageLink'])
                this.setDescription(info['description'], auto_save)
                this.setContent(info['content'], auto_save)
                this.setId(info['slug'], auto_save)
                this.setPublishDate(moment(info['uploadDate']).format("DD-MM-YYYY HH:mm"), auto_save)
                this.setIsLiked(data['isLiked'], auto_save)
                this.setIsSaved(data['isSaved'], auto_save)
                this.updateState()
            },
            error: (message) => console.log(message)
        })
    }
    
    async loadComments(id = this.id) {
        let accessToken = window.localStorage.getItem("accessToken")

        if(this.news.getCommentPageIndex() != null) {
            $.ajax({
                type: "GET",
                url: api_url + "/news/article/" + id + "/comments",
                accepts: "json",
                contentType: "json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                data: {
                    page: this.news.getCommentPageIndex()
                },
                success: (data) => {
                    let nextPage = data['next_page']
                    this.news.setCommentPageIndex(nextPage)

                    let commentList = data['comment_list']

                    for(let comment of commentList) {
                        let id = comment['comment_id']
                        let content = comment['comment']
                        let author = comment['author']['personalData']
                        let surname = author['surname']
                        let name = author['name']
                        let username = comment['author']['username']

                        let newComment = new CommentController()
                        newComment.setId(id)
                        newComment.setContent(content)
                        newComment.setAuthor(surname + " " + name)
                        newComment.setAuthorUsername(username)

                        this.news.comments.push(newComment)
                    }

                    this.updateState()
                }
            })
        }
    }

    async saveNews() {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "POST",
            url: api_url + "/news/article/" + this.getId() + "/save",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    async unsaveNews() {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "DELETE",
            url: api_url + "/news/article/" + this.getId() + "/save",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    async likedNews() {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "POST",
            url: api_url + "/news/article/" + this.getId() + "/like",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    async unlikeNews() {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "DELETE",
            url: api_url + "/news/article/" + this.getId() + "/like",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
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
    getIsLiked() { return this.news.getIsLiked() }
    getIsSaved() { return this.news.getIsSaved() }

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
    setIsLiked(isLiked, _auto_save = true) {
        this.news.setIsLiked(isLiked)
        if(_auto_save) this.updateState()
    }
    setIsSaved(isSaved, _auto_save = true) {
        this.news.setIsSaved(isSaved)
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

    async addComment(info) {
        /**
         * info = {
         *  id: string
         *  title: string
         *  author: string
         *  content: string
         *  date: string
         * }
         */
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "POST",
            url: api_url + "/news/article/" + this.news.getId() + "/comments",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                content: info['content']
            }),
            success: (data) => {
                let id = data['comment']['comment_id']
                info['id'] = id
                let _comment = new CommentController({...info})
                let newComments = this.getComments()
                newComments.push(_comment)
                this.setComments(newComments)
            }
        })
    }

    removeComment(id) {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "DELETE",
            url: api_url + "/news/articles/comment/" + id,
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => {
                let comments = this.getComments()
                let commentsId = comments.map(item => item.getId())
                let commentIndex = commentsId.indexOf(id)
                if(commentIndex > -1) comments.splice(commentIndex, 1)
                this.updateState()
            }
        })
    }

    getComment(commentId) {
        return this.comments.map((comment) => {
            if(comment.getId() == commentId)
                return comment
        })
    }
}

export default NewsController