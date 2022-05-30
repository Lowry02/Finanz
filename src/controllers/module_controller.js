import Module from "../models/module"
import QuestionCreationController from "./question_creation_controller"
import accademyCourse from "../test_data/accademy"
import QuestionController from "./question_controller"
import {api_url} from "../App"
import $ from "jquery"

class ModuleController {
    constructor(module = new Module(), state = undefined, overrideState = undefined) {
        this.module = module
        this.state = state
        this.overrideState = overrideState
    }

    setState(state) {this.state = state}

    load(info, creation_mode = true) {
        this.module.load({...info})

        let modules = this.getModules()
        for(let moduleId of Object.keys(modules)) {
            for(let pageId of Object.keys(this.getAllPages(moduleId))) {
                if(this.getPageType(moduleId, pageId) == 'quiz') {
                    let quizObj = this.getPageContent(moduleId, pageId)
                    let quiz
                    if(creation_mode) {
                        quiz = new QuestionCreationController()
                        quiz.question.setAcceptedChoices(1)
                        quiz.setOverrideState((() => this.updateInfo()).bind(this))
                        quiz.load({question: {...quizObj.question.question, selectedChoices: [...quizObj.question.selectedChoices]}, correctChoices : undefined})
                    } else {
                        quiz = new QuestionController()
                        quiz.setAcceptedChoices(1)
                        quiz.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
                        quiz.load({...quizObj.question})
                    }
                    modules[moduleId]['pages'][pageId]['content'] = quiz
                }
            }
        }
        this.updateInfo()
    }

    // getting info from API
    async loadById(moduleId, fullGet = true) {
        // getting module info
        this.getModuleInfo(moduleId)
        // get notes
        let notesId = await this.getNotes(moduleId)

        // get pages per notes
        if(fullGet) {
            for(let noteId of notesId) {
                this.loadNote(noteId)
            }
        }

    }

    // API function
    getModuleInfo(moduleId) {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "GET",
            url: api_url + "academy/module/" + moduleId,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let title = data['title']
                let description = data['description']
                let argument = data['argument_slug']
                let difficultyLevel = data['difficulty'] == undefined ? "" : data['difficulty']
                let wallpaper = data['coverImageLink']
                let position = data['order']

                this.setId(moduleId)
                this.setTitle(title)
                this.setDescription(description)
                this.setArgument(argument)
                this.setDifficultyLevel(difficultyLevel)
                this.setWallpaper(wallpaper)
                this.setPosition(position)
                this.setAuthor()
            },
            error: (message) => console.log(message)
        })
    }

    // API function
    async getNotes(moduleId, writeMode = true) {
        let accessToken = window.localStorage.getItem("accessToken")
        let notes = []
        
        await $.ajax({
            type: "GET",
            url: api_url + "academy/module/" + moduleId + "/notes",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let notesInfo = data['notes']
                for(let note of notesInfo) {
                    let title = note['title']
                    let id = note['slug']
                    let isLiked = note['isLiked']
                    let isSaved = note['isSaved']
                    notes.push(id)

                    if(writeMode)
                        this.addModule({
                            id : id,
                            title : title,
                            position : Object.keys(this.module.getModules()).length + 1,
                            pages : {},
                            isLiked : isLiked,
                            isSaved : isSaved
                        })
                }
            },
            error: (message) => console.log(message)
        })
        return notes
    }

    // API function
    async getPageFromServer(noteId, pageNumber, writeMode = true) {
        let accessToken = window.localStorage.getItem("accessToken")
        let next = false

        await $.ajax({
            type: "GET",
            url: api_url + "academy/note/" + noteId + "/pages",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: {
                page: pageNumber,
            },
            success: (data) => {
                if(writeMode) next = data['next_page'] != undefined
                else next = data?.page

                if(data.page != null && writeMode) {
                    let info = {
                        pageId : data['page']['id'],
                        content : data['page']['content'],
                        quiz : data['page']['quiz'],
                        position : data['page']['order'],
                        wallpaper : data['page']['coverImageLink'] == null ? "" : data['page']['coverImageLink'],
                    }

                    if(info['quiz'] == null) this.addPage(noteId, info)
                    else this.addQuiz(noteId, info)
                } 
            }
        })

        return next
    }

    async loadNote(noteId, updateMode = false) {
        let pageNumber = 1
        let next = true

        // stops when there aren't no more pages
        while(next) {
            next = await this.getPageFromServer(noteId, pageNumber)
            pageNumber++
        }

        if(updateMode) this.updateInfo()
    }

    async setChapterFinished(moduleId) {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "POST",
            url: api_url + "academy/note/" + moduleId +"/finish",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    updateInfo() {
        if(this.state != undefined) 
            this.state(new ModuleController(this.module, this.state))
        else if(this.overrideState != undefined) 
            this.overrideState()
    }

    async loadCompletedNotes(moduleId = this.getId()) {
        let accessToken = window.localStorage.getItem("accessToken")
        let info = []
        
        await $.ajax({
            type: "GET",
            url: api_url + "academy/module/" + moduleId + "/notes/finished",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let notes = data['notes'].sort((a,b) => a['position'] > b['position'] ? -1 : 1)
                let notesId = notes.map((item) => item['slug'])
                this.setCompletedNotes(notesId)
            }
        })

        return info
    }

    async likeNote(noteId) {
        let accessToken = window.localStorage.getItem("accessToken")

        await $.ajax({
            type: "POST",
            url: api_url + "academy/note/" + noteId + "/like",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    async unlikeNote(noteId) {
        let accessToken = window.localStorage.getItem("accessToken")

        await $.ajax({
            type: "DELETE",
            url: api_url + "academy/note/" + noteId + "/like",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    async saveNote(noteId) {
        let accessToken = window.localStorage.getItem("accessToken")

        await $.ajax({
            type: "POST",
            url: api_url + "academy/note/" + noteId + "/save",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    async unsaveNote(noteId) {
        let accessToken = window.localStorage.getItem("accessToken")

        await $.ajax({
            type: "DELETE",
            url: api_url + "academy/note/" + noteId + "/save",
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })
    }

    getId() {return this.module.id}
    getAuthor() {return this.module.getAuthor()}
    getSocialPage() {return this.module.socialPage}
    getArgument() {return this.module.getArgument()}
    getWallpaper() {return this.module.getWallpaper()}
    getTitle() {return this.module.getTitle()}
    getDescription() {return this.module.getDescription()}
    getDifficultyLevel() {return this.module.getDifficultyLevel()}
    getPosition() {return this.module.getPosition()}
    getModules() {return this.module.getModules()}
    getPublishDate() {return this.module.getPublishDate()}
    getNModules() {return this.module.getNModules()}
    getTime() {return this.module.getTime()}
    getPosition() {return this.module.getPosition()}
    getCompletedNotes() {return this.module.getCompletedNotes()}

    setId(id, _auto_save = true) {
        this.module.setId(id)
        if(_auto_save) this.updateInfo()
    }
    setAuthor(author, _auto_save = true) {
        this.module.setAuthor(author)
        if(_auto_save) this.updateInfo()
    }
    setSocialPage(socialPage, _auto_save = true) {
        this.module.setSocialPage(socialPage)
        if(_auto_save) this.updateInfo()
    }
    setArgument(argument, _auto_save = true) {
        this.module.setArgument(argument)
        if(_auto_save) this.updateInfo()
    }
    setWallpaper(wallpaper, _auto_save = true) {
        this.module.setWallpaper(wallpaper)
        if(_auto_save) this.updateInfo()
    }
    setTitle(title, _auto_save = true) {
        this.module.setTitle(title)
        if(_auto_save) this.updateInfo()
    }
    setDescription(description, _auto_save = true) {
        this.module.setDescription(description)
        if(_auto_save) this.updateInfo()
    }
    setDifficultyLevel(difficultyLevel, _auto_save = true) {
        this.module.setDifficultyLevel(difficultyLevel)
        if(_auto_save) this.updateInfo()
    }
    setPosition(position, _auto_save = true) {
        this.module.setPosition(position)
        if(_auto_save) this.updateInfo()
    }
    setModules(modules, _auto_save = true) {
        this.module.setModules(modules)
        if(_auto_save) this.updateInfo()
    }
    setPublishDate(publishDate, _auto_save = true) {
        this.module.setPublishDate(publishDate)
        if(_auto_save) this.updateInfo()
    }
    setNModules(n_modules, _auto_save = true) {
        this.module.setNModules(n_modules)
        if(_auto_save) this.updateInfo()
    }
    setTime(time, _auto_save = true) {
        this.time = time
        if(_auto_save) this.updateInfo()
    }
    setOverrideState(callback) {
        this.overrideState = callback
    }

    setPageContent(moduleId, pageId, content) {
        let page = this.getPage(moduleId, pageId)
        page['content'] = content
        this.updateInfo()
    }

    setPageWallpaper(moduleId, pageId, wallpaper) {
        let page = this.getPage(moduleId, pageId)
        page['wallpaper'] = wallpaper
        this.updateInfo()
    }
    
    setPosition(position, _auto_save = true) {
        this.module.setPosition(position)
        if(_auto_save) this.updateInfo()
    }

    setCompletedNotes(completedModule, _auto_save = true) {
        this.module.setCompletedNotes(completedModule)
        if(_auto_save) this.updateInfo()
    }

    getModuleById(id) {
        return this.getModules()[id]
    }

    getAllPages(moduleId) {
        if(this.getModuleById(moduleId) != undefined)
            return this.getModuleById(moduleId).pages
        else return {}
    }

    getPage(moduleId, pageId) {
        return this.getAllPages(moduleId)[pageId]
    }

    getModuleTitle(moduleId) {
        if(this.getModuleById(moduleId) != undefined)
            return this.getModuleById(moduleId)['title']
        else return ""
    }

    setModuleTitle(moduleId, title) {
        let newModules = this.getModules()
        newModules[moduleId]['title'] = title
        this.module.setModules(newModules)
        this.updateInfo()
    }

    addModule(data = undefined) {
        let _format = {}
        let newId = ""
        let newModules = this.module.getModules()

        if(data == undefined) {
            // empty module creation
            _format = {
                title: "Nuovo Modulo",
                position: Object.keys(this.module.getModules()).length + 1,
                pages: {},
                isLiked : false,
                isSaved : false
            }
            newId = "_0"
            while(Object.keys(newModules).includes(newId)) newId = "_" + Math.random() * 10
        } else {
            // create module from info
            newId = data['id']
            _format = data
        }
        
        newModules[newId] = _format
        this.setModules(newModules)
        console.log(_format)
        this.updateInfo()
    }

    async addPageObj(moduleId, type, info = undefined) {
        // default values
        let newModule = this.getModuleById(moduleId)
        let newId = "_0"
        let position = Object.keys(newModule['pages']).length + 1
        let title = "Nuova Pagina"
        let wallpaper = ""
        let content = ""
        let _questionCreationController = new QuestionCreationController()
        _questionCreationController.setOverrideState((() => this.updateInfo()).bind(this))
        _questionCreationController.question.setAcceptedChoices(undefined)
        _questionCreationController.question.setType(this.module.quiz_type)

        if(info != undefined) {
            title = info['title']
            newId = info['pageId']
            position = info['position']
            wallpaper = info['wallpaper']
            
            // create page from info
            if(type == "quiz") {
                let quiz = info['quiz']
                let quizTitle = quiz['question']
                let quizId = quiz['slug']
                let quizAnswers = quiz['answers']
                let quizImage = quiz['coverImageLink'] == null ? "" : quiz['coverImageLink']
                _questionCreationController.question.setId(quizId)
                _questionCreationController.question.setTitle(quizTitle)
                _questionCreationController.question.setImage(quizImage)
                _questionCreationController.question.setAcceptedChoices(1)

                for(let answer of quizAnswers) {
                    let answerId = answer['slug']
                    let answerTitle = answer['answer']
                    let answerDescription = answer['description']
                    _questionCreationController.addItem({
                        title: answerTitle,
                        description: answerDescription
                    }, answerId)
                }

                // set correct choice 
                let quizContent = await _questionCreationController.question.loadById(quizId)
                quizContent?.answers.forEach(item => {
                    if(item?.isCorrect)
                        _questionCreationController.question.addSelectedChoice(item?.slug)

                })
            } else {
                content = info['content']
            }
        } else {
            // create empty page
            while(Object.keys(newModule.pages).includes(newId)) newId = "_" + Math.random() * 10
        }

        newModule.pages[newId] = {
            id: newId,
            wallpaper: wallpaper,
            type: type,
            position: position,
            title: "Nuova pagina",
            content: type == 'page' ?
                        content :
                        _questionCreationController
        }

        this.updateInfo()
    }

    addPage(moduleId, info = undefined) {
        this.addPageObj(moduleId, 'page', info)
    }

    addQuiz(moduleId, info = undefined) {
        this.addPageObj(moduleId, 'quiz', info)
    }

    getPageType(moduleId, pageId) {
        if(this.getModuleById(moduleId) != undefined)
            if(this.getModuleById(moduleId)['pages'] != undefined)
                if(this.getModuleById(moduleId)['pages'][pageId] != undefined)
                    return this.getModuleById(moduleId)['pages'][pageId]['type']
        return ""
    }

    getPageTitle(moduleId, pageId) {
        return this.getModuleById(moduleId)['pages'][pageId]['title']
    }

    getPageWallpaper(moduleId, pageId) {
        return this.getModuleById(moduleId)['pages'][pageId]['wallpaper']
    }

    getPageContent(moduleId, pageId) {
        if(this.getPage(moduleId, pageId) != undefined)
            return this.getPage(moduleId, pageId).content
        else return ""
    }

    exportInfo() {
        let modules = JSON.parse(JSON.stringify(this.getModules()))
        
        return {
            id: this.getId(),
            author : this.getAuthor(),
            socialPage : this.getSocialPage(),
            argument : this.getArgument(),
            wallpaper : this.getWallpaper(),
            title : this.getTitle(),
            description : this.getDescription(),
            difficultyLevel : this.getDifficultyLevel(),
            position: this.getPosition(),
            modules : modules,
        }
    }
}

export default ModuleController