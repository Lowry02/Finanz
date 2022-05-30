import { exampleNews, exampleCategories } from "../test_data/news"
import NewsController from "./news_controller"
import $ from "jquery"
import { api_url } from "../App"
import { ConstructionOutlined } from "@mui/icons-material"

class NewsListController {
    constructor(generalNews = {}, personalNews = {}, savedNews = {}, createdNews = {}, dailiNews = {}, categories = {}, created_news_index = 1, state = undefined, overrideState = undefined, index_per_category = {}, news_per_category = {}, saved_news_index = 1) {
        this.generalNews = generalNews
        this.personalNews = personalNews
        this.savedNews = savedNews
        this.createdNews = createdNews
        this.dailiNews = dailiNews
        this.categories = categories
        this.overrideState = overrideState
        this.state = state
        this.created_news_index = created_news_index
        this.GENERAL_NEWS_TAG = "general"
        this.PERSONAL_NEWS = "personal"
        this.SAVED_NEWS_TAG = "saved"
        this.CREATED_NEWS_TAG = "created"
        this.saved_news_index = saved_news_index
        this.index_per_category = index_per_category
        this.news_per_category = news_per_category
    }

    setState(state) {
        this.state = state
        this.updateInfo()
    }

    setOverrideState(overrideState) {
        this.overrideState = overrideState
    }

    updateInfo() {
        if(this.state != undefined)
            this.state(new NewsListController(this.generalNews, this.personalNews, this.savedNews, this.createdNews, this.dailiNews, this.categories, this.created_news_index, this.state, this.overrideState, this.index_per_category, this.news_per_category, this.saved_news_index))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    async loadNewsPerCategory(category = "general") {
        let accessToken = window.localStorage.getItem("accessToken")

        let page = this.index_per_category[category] !== undefined ? this.index_per_category[category] : 1
        
        if(page != null) {
            console.log(this.index_per_category)
            let info = { page: page }

            if(category != "" && category != "general") info['category'] = category

            $.ajax({
                type: "GET",
                url: api_url + "news/articles",
                accepts: "application/json",
                contentType: "json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                data: info,
                success: (data) => {
                    let nextPage = data['next_page']
                    this.index_per_category[category] = nextPage

                    if(this.news_per_category[category] == undefined) this.news_per_category[category] = []
                    
                    let newsList = data['news_list']
                    for(let item of Object.values(newsList)) {
                        let content = item['content']
                        let newNews = new NewsController()
                        newNews.setOverrideState((() => this.updateInfo()).bind(this))
                        newNews.setAuthor(content.author['personalData']['surname'] + " " + content.author['personalData']['name'])
                        newNews.setId(content['slug'])
                        newNews.setWallpaper(content['coverImageLink'])
                        newNews.setTitle(content['title'])

                        this.news_per_category[category].push(newNews)
                        // aggiungere autore
                    }
                    this.updateInfo()
                }
            })
        }
    }

    load({generalNews, personalNews, savedNews, createdNews, dailiNews, categories, created_news_index, state, overrideState, index_per_category, news_per_category, saved_news_index}) {
        this.generalNews = generalNews
        this.personalNews = personalNews
        this.savedNews = savedNews
        this.createdNews = createdNews
        this.dailiNews = dailiNews
        this.categories = categories
        this.created_news_index = created_news_index
        this.state = state
        this.overrideState = overrideState
        this.index_per_category = index_per_category
        this.news_per_category = news_per_category
        this.saved_news_index = saved_news_index
    }

    getGeneralNews() {
        return this.generalNews
    }

    getPersonalNews() {
        return this.personalNews
    }
    
    getSavedNews() {
        return this.savedNews
    }

    getCreatedNews() {
        return this.createdNews
    }

    getDailyNews() {
        return this.dailiNews
    }

    getCategories() {
        return this.categories
    }

    getNewsPerCategory(category, n = 10) {
        return this.news_per_category[category] != undefined ? this.news_per_category[category] : []
    }

    getSavedNewsIndex() {
        return this.saved_news_index
    }

    setGeneralNews(generalNews) {
        this.generalNews = {...this.generalNews, ...generalNews}
        this.updateInfo()
    }

    setPersonalNews(personalNews) {
        this.personalNews = {...this.personalNews, ...personalNews}
        this.updateInfo()
    }
    
    setSavedNews(savedNews) {
        this.savedNews = {...this.savedNews, ...savedNews}
        this.updateInfo()
    }

    setCreatedNews(createdNews) {
        this.createdNews = {...this.createdNews, ...createdNews}
        this.updateInfo()
    }

    setDailiNews(dailiNews) {
        this.dailiNews = {...this.dailiNews, ...dailiNews}
        this.updateInfo()
    }

    setCategories(categories) {
        this.categories = categories
        this.updateInfo()
    }

    setSavedNewsIndex(saved_news_index) {
        this.saved_news_index = saved_news_index
        this.updateInfo()
    }


    __getNewsList(obj, l) {
        let list = {}
        let length = Object.keys(obj).length
        for(let i = length; i < length + l; i++) {
            let newNews = new NewsController()
            newNews.setOverrideState((() => this.updateInfo()).bind(this))
            newNews.load(exampleNews)
            newNews.setId(i)
            list[i] = newNews
        }
        return list
    }

    loadGeneralNews(n = 10) {
        // DA IMLPEMENTARE
        let list = this.__getNewsList(this.generalNews, n)
        this.setGeneralNews(list)
    }
    
    loadPersonalNews(n = 10) {
        // DA IMLPEMENTARE
        let list = this.__getNewsList(this.personalNews, n)
        this.setPersonalNews(list)
    }

    async loadSavedNews(n = 10) {
        // this.setCreatedNews(list)
        let accessToken = window.localStorage.getItem('accessToken')
                
        if(this.saved_news_index != null) {
            $.ajax({
                type: "GET",
                url: api_url + "news/article/saves",
                accepts: "json",
                contentType: "json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                data: {
                    page: this.saved_news_index,
                },
                success: (data) => {
                    this.saved_news_index = data['next_page']

                    let list = data['news_list']
                    let newsList = {...this.getSavedNews()}
                    for(let news of list) {
                        let newNews = new NewsController()
                        
                        newNews.setId(news['slug'])
                        newNews.setTitle(news['title'])
                        newNews.setOverrideState((() => this.updateInfo()).bind(this))
                        // chiedere di implementare ora e categoria
                        newsList[news['slug']] = newNews
                    }
                    this.setSavedNews(newsList)
                },
                error: (message) => console.log(message)
            })
        }
    }

    loadCreatedNews(n = 10) {
        // this.setCreatedNews(list)
        let accessToken = window.localStorage.getItem('accessToken')
        
        if(this.created_news_index != null) {
            $.ajax({
                type: "GET",
                url: api_url + "news/articles/modifiable",
                accepts: "json",
                contentType: "json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                data: {
                    page: this.created_news_index,
                },
                success: (data) => {
                    this.created_news_index = data['next_page']

                    let list = data['news_list']
                    let newsList = {...this.getCreatedNews()}
                    for(let news of list) {
                        let newNews = new NewsController()
                        
                        newNews.setId(news['slug'])
                        newNews.setTitle(news['title'])
                        newNews.setOverrideState((() => this.updateInfo()).bind(this))
                        // chiedere di implementare ora e categoria
                        newsList[news['slug']] = newNews
                    }
                    this.setCreatedNews(newsList)
                },
                error: (message) => console.log(message)
            })
        }
    }
    
    loadDailyNews(n = 10) {
        let list = this.__getNewsList(this.createdNews, n)
        this.setDailiNews(list)
    }

    loadCategories() {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "GET",
            url: api_url + "news/categories",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let categories = data['categories']
                if(categories != undefined) {
                    for(let category of Object.values(categories)) {
                        let title = category['title']
                        let slug = category['slug']

                        this.categories[slug] = title
                    }

                    this.updateInfo()
                }
            }
        })
    }

    removeNews(newsId, tag) {
        if(tag == this.CREATED_NEWS_TAG) {
            delete this.generalNews[newsId]
            delete this.savedNews[newsId]
            delete this.createdNews[newsId]
            delete this.personalNews[newsId]
        }
        else if(tag == this.GENERAL_NEWS_TAG)
            delete this.generalNews[newsId]
        else if(tag == this.SAVED_NEWS_TAG)
            delete this.savedNews[newsId]
        else if(tag == this.PERSONAL_NEWS)
            delete this.personalNews[newsId]

        this.updateInfo()

        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "DELETE",
            url: api_url + "news/article/" + newsId,
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => console.log('ciao')
        })
    }

    getNewsById(newsId) {
        // da implementare
        let _news = new NewsController()
        _news.setOverrideState((() => this.updateInfo).bind(this))
        _news.load(exampleNews)
        return _news
    }

}

export default NewsListController