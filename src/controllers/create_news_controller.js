import NewsController from "./news_controller";
import QuestionController from "./question_controller";
import {api_url} from "../App"
import $ from "jquery"
import { urlToFile } from "../utils";

class CreateNewsController {
    constructor(news = new NewsController(), categories = new QuestionController(), state = undefined) {
        this.news = news
        news.setOverrideState((() => this.updateInfo()).bind(this))
        this.categories = categories
        this.categories.setOverrideUpdateInfo((() => this.news.setCategory(this.categories.getSelectedChoices())).bind(this))
        this.state = state
    }

    setState(state) {
        this.state = state
    }

    updateInfo() {
        if(this.state != undefined) {
            for(let category of Object.values(this.news.getCategory())) {
                let categorySlug = category['slug']
                let auto_save = false
                this.categories.addSelectedChoice(categorySlug, auto_save)
            }
            this.state(new CreateNewsController(this.news, this.categories, this.state))
        }
    }

    load(info) {
        this.news.load(info)
    }

    getNews() { return this.news }
    getCategories() {return this.categories }
        
    setCategories(categories, _auto_save = true) {
        this.categories = categories
        if(_auto_save) this.updateInfo()
    }

    loadCategories() {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "GET",
            url: api_url + "news/categories",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let categoriesObject = new QuestionController()
                categoriesObject.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
                categoriesObject.load({
                    id: null,
                    title: "",
                    choices: {},
                    acceptedChoices: null
                })

                let categories = data['categories']

                for(let category of categories) {
                    let categorySlug = category['slug']
                    let categoryTitle = category['title']
                    categoriesObject.addChoice({title : categoryTitle, slug: categorySlug}, categorySlug)
                }

                this.setCategories(categoriesObject)
            },
            error: (message) => console.log(message)
        })
    }

    deleteCategory(slug, callback) {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "DELETE",
            url: api_url + "news/category/" + slug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                callback()
            },
            error: (message) => console.log(message)
        })
    }

    createCategory(title) {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "POST",
            url: api_url + "news/categories",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                title : title
            }),
            success: (data) => {
                this.loadCategories()
            },
            error: (message) => console.log(message)
        })
    }

    isContentValid() {
        // wallpaper check
        // if(this.news.getWallpaper() == "") return { error : true, message : "Wallpaper non inserito"}
        // title check
        if(this.news.getTitle().replace(" ", "") == "") return { error : true, message : "Titolo non inserito"}
        // description check
        if(this.news.getDescription().replace(" ", "") == "") return { error : true, message : "Descrizione non inserita"}
        // content check (NOT WORKING)
        if(JSON.stringify(this.news.getContent().replace(" ", "").toString()) == "\n") return { error : true, message : "Contenuto non inserito"}
        // argument check
        if(this.getCategories().getSelectedChoices().length == 0) return { error : true, message : "Argomento non inserito"}
        return { error : false, messaggio : "Tutto apposto"}
    }

    async publish() {
        let accessToken = window.localStorage.getItem("accessToken")
        let updateMode = false
        if(this.news.getId() != "") updateMode = true

        let type = ""
        let url = ""

        if(updateMode) {
            type = "PUT"
            url = "news/article/" + this.news.getId()
        } else {
            type = "POST"
            url = "news/articles"
        }

        //used to send file
        let formData = new FormData()
        formData.append("title", this.news.getTitle())
        formData.append("description", this.news.getDescription())
        formData.append("newsLocation", "both")
        for(let category of this.getCategories().getSelectedChoices())
            formData.append("categories", category)
        formData.append("content", this.news.getContent())
        if(this.news.getWallpaper().slice(0,5) != "https") {
            formData.append("picture", urlToFile(this.news.getWallpaper()))
        }

        await $.ajax({
            type: type,
            url: api_url + url,
            accepts: "application/json",
            contentType: false,
            processData: false,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: formData,
            success: (data) => {
                this.news.setId(data['slug'])
                this.news.setWallpaper(data['coverImageLink'])
                if(updateMode) {
                    $.ajax({
                        type: "POST",
                        url: api_url + "news/article/" + this.news.getId() +"/categories",
                        accepts: "application/json",
                        contentType: "application/json",
                        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                        data: JSON.stringify({
                            categories: this.getCategories().getSelectedChoices()
                        })
                    })
                }
            },
            error: (message) => console.log(message)
        })
    }

    //pagina social
}

export default CreateNewsController