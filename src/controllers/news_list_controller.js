import { exampleNews, exampleCategories } from "../test_data/news"
import NewsController from "./news_controller"
import $ from "jquery"
import { api_url } from "../App"

class NewsListController {
    constructor(generalNews = {}, personalNews = {}, savedNews = {}, createdNews = {}, dailiNews = {}, categories = {}, created_news_index = 1, state = undefined, overrideState = undefined,) {
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
            this.state(new NewsListController(this.generalNews, this.personalNews, this.savedNews, this.createdNews, this.dailiNews, this.categories, this.created_news_index, this.state, this.overrideState))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    load({generalNews, personalNews, savedNews, createdNews, dailiNews, categories, created_news_index, state, overrideState}) {
        this.generalNews = generalNews
        this.personalNews = personalNews
        this.savedNews = savedNews
        this.createdNews = createdNews
        this.dailiNews = dailiNews
        this.categories = categories
        this.created_news_index = created_news_index
        this.state = state
        this.overrideState = overrideState
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
        return this.__getNewsList(this.personalNews, n)
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

    loadSavedNews(n = 10) {
        let list = this.__getNewsList(this.savedNews, n)
        this.setSavedNews(list)
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
        let categories = exampleCategories
        this.setCategories(categories)
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
            success: console.log('ciao')
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