import ModuleController from "./module_controller";
import QuestionController from "./question_controller"
import {api_url} from "../App"
import { urlToFile } from "../utils"
import $ from "jquery"

class CreateModuleController {
    constructor(module = new ModuleController(), args = new QuestionController(), state = undefined) {
        this.module = module
        this.module.setOverrideState((() => this.updateInfo()).bind(this))
        this.args = args
        this.state = state
    }

    setState(state) {
        this.state = state
        this.updateInfo()
    }

    updateInfo() {
        if(this.state !== undefined) {
            // linking module argument to argument selection
            if(this.getArguments().getSelectedChoices().length == 0) {
                if(this.module.getArgument() != "") {
                    this.getArguments()?.addSelectedChoice(this.module.getArgument(), false)
                }
            } else {
                let argument = this.getArguments().getSelectedChoices()[0]
                this.module.setArgument(argument, false)
            }
            this.state(new CreateModuleController(this.module, this.args, this.state))
        }
    }

    load({module, args}) {
        if(module != undefined)
            this.module.load(module)
        if(args != undefined)
            this.setArguments(args)
        this.updateInfo()
    }

    async loadArguments() {
        let accessToken = window.localStorage.getItem("accessToken")

        return await $.ajax({
            type: "GET",
            accepts: "application/json",
            url: api_url + "academy/arguments",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let argumentList = data['arguments']
                let _args = {}

                for(let argument of argumentList) _args[argument['slug']] = argument
                let args = new QuestionController()
                args.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
                args.load({
                    id: null,
                    title: "",
                    choices: _args,
                    acceptedChoices: 1
                })
                this.setArguments(args)
            },
            error: (message) => console.log(message)
        })
    }

    updateArgument(slug, title, description, picture,  callback) {
        let accessToken = window.localStorage.getItem("accessToken")

        // used to send file
        let formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('picture', urlToFile(picture))

        $.ajax({
            type: "PUT",
            accepts: "application/json",
            url: api_url + "academy/argument/" + slug,
            contentType: false,
            processData: false,
            data: formData,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => callback(data),
            error: (message) => console.log(message)
        })
    }

    deleteArgument(slug, callback) {
        let accessToken = window.localStorage.getItem("accessToken")

        $.ajax({
            type: "DELETE",
            accepts: "application/json",
            url: api_url + "academy/argument/" + slug,
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => callback(),
            error: (message) => console.log(message)
        })
    }

    addArgument(title, description, picture, callback) {
        let accessToken = window.localStorage.getItem("accessToken")

        // used to send file
        let formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('picture', urlToFile(picture))

        $.ajax({
            type: "POST",
            url: api_url + "academy/arguments",
            accepts: "application/json",
            contentType: false,
            processData: false,
            data: formData,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => callback(data),
            error: (message) => console.log(message)
        })
    }

    getModule() { return this.module }
    getArguments() {return this.args}

    setModule(module, _auto_save = true) {
        this.module = module
        if(_auto_save) this.updateInfo()
    }

    setArguments(args, _auto_save = true) {
        this.args = args
        if(_auto_save) this.updateInfo()
    }

    deletePage(moduleId, pageId) {
        let module = this.module.getModules()[moduleId]
        let pages = module['pages']
        if(pages !== undefined) {
            let pagePosition = pages[pageId]['position']
            console.log(pagePosition)
            delete pages[pageId]
            for(let page of Object.values(pages))
                if(page['position'] > pagePosition) {
                    page['position']--
                    console.log('sottraggo')
                }
            module['pages'] = pages
            let newModules = this.module.getModules()
            newModules[moduleId] = module
            console.log(newModules)
            this.module.setModules(newModules)
        }
        
        this.updateInfo()
    }

    deleteModule(moduleId) {
        let _modules = this.module.getModules()
        let modulePosition = _modules[moduleId]['position']
        delete _modules[moduleId]
        
        for(let module of Object.values(_modules)) 
            if(module['position'] > modulePosition) module['position']--
        
        this.module.setModules(_modules)
    }

    changeModuleOrder(direction, moduleId) {
        let nModules = Object.keys(this.module.getModules()).length
        let module = this.module.getModules()[moduleId]

        console.log(module)

        // valid order check
        if(module['position'] + direction > 0 && module['position'] + direction <= nModules) {
            let [nextModule] = Object.values(this.module.getModules()).filter(item => item['position'] == (module['position'] + direction))
            nextModule['position'] = module['position']
            module['position'] += direction
        }

        this.updateInfo()
    }

    changePageOrder(moduleId, sInd, dInd) {
        // ordering pages
        let pages = Object.values(this.module.getAllPages(moduleId)).sort((a,b) => a['position'] > b['position'] ? 1 : -1)
        // element moved
        const [reorderedItem] = pages.splice(sInd - 1, 1)
        // insert moved element into the new position
        if(reorderedItem != undefined)
            pages.splice(dInd - 1, 0, reorderedItem)
        // assigning position to each page
        pages.forEach((page, i) => page['position'] = i + 1)
        this.updateInfo()
    }

    async moduleExist() {
        /* returns an object composed by
            {
                exist: true/false,
                categoryChanged: true/false
            }
        */
        let accessToken = window.localStorage.getItem('accessToken')
        let exist = {
            exist: false,
            categoryChanged: false,
        }
        
        try {
            await $.ajax({
                type: "GET",
                url: api_url + "academy/module/" + this.module.getId(),
                contentType: "application/json",
                accepts: "application/json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                success: (data) => {
                    let argumentSlug = data['argument_slug']  
                    exist = {
                        exist: true,
                        categoryChanged: argumentSlug != this.getArguments().getSelectedChoices()[0]
                    }
                },
                error: () => exist = {
                    exist: false,
                    categoryChanged: false
                }
            })
        } catch {}

        return exist
    }

    async publish(messageFunction = (message) => {}) {
        let updateMode = false
        if(this.module.getId() != "")
            updateMode = await this.moduleExist()

        messageFunction({error: false, message: updateMode ? "Aggiorno il modulo" : "Creo il modulo"})
        
        // create academy
        let academySlug = await this.createModule(updateMode['exist'], updateMode['categoryChanged'])
        if(academySlug == undefined) throw Error(updateMode ? "Errore nella modifica" : "Errore nella creazione")

        updateMode = updateMode['exist']
        let modules = this.module.getModules()
        
        for(let moduleId of Object.keys(modules)) {
            // create module            
            let moduleSlug = await this.postModules(academySlug, moduleId, updateMode)
            if(moduleSlug == undefined) throw Error("Errore nella pubblicazione della nota - " + modules[moduleSlug]['title'])

            messageFunction({error: false, message: updateMode ? "Aggiorno la nota - " + modules[moduleSlug]['title'] : "Creo la nota - " + modules[moduleSlug]['title']})

            let pages = this.module.getAllPages(moduleSlug)
            for(let pageId of Object.keys(pages)) {
                if(this.module.getPageType(moduleSlug, pageId) == "quiz") {
                    // create quiz
                    console.log(pages[pageId]['content'].question.getTitle())
                    let error = await this.postQuiz(moduleSlug, moduleSlug, pageId, updateMode)
                    if(error == undefined) throw Error("Errore nella pubblicazione di un quiz - " + pages[pageId]['content'].question.getTitle())
                    messageFunction({error: false, message: updateMode ? "Aggiorno il quiz - " + pages[pageId]['content'].question.getTitle() : "Creo il quiz - " + pages[pageId]['content'].question.getTitle()})
                } else {
                    // create text page
                    let title = pages[pageId]['title']
                    let error = await this.postText(moduleSlug, moduleSlug, pageId, updateMode)
                    if(error == undefined) throw Error("Errore nella pubblicazione della pagina - " + title)
                    messageFunction({error: false, message: updateMode ? "Aggiorno la pagina - " + title : "Creo la pagina - " + title})
                }
            }
        }

        let accessToken = window.localStorage.getItem('accessToken')
        
        messageFunction({error: false, message: "Elimino le note"})

        // deleting notes
        let serverNotes = await this.module.getNotes(this.module.getId(), false)
        let localNotes = Object.keys(this.module.getModules())

        for(let noteSlug of serverNotes) {
            if(!localNotes.includes(noteSlug)) {
                let error = false
                await $.ajax({
                    type: "DELETE",
                    url: api_url + "academy/note/" + noteSlug,
                    contentType: "json",
                    accepts: "json",
                    beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                    error: () => error = true
                })
                
                if(error) throw Error("Errore eliminazione nota - " + noteSlug)
            }
        }

        messageFunction({error: false, message: "Elimino le pagine"})

        // deleting pages
        for(let noteId of localNotes) {
            let pageNumber = 1
            let page = {}
            let pageSlug = ""
            let localPages = Object.keys(this.module.getAllPages(noteId))
            
            // stops when there aren't more pages
            while(pageSlug != undefined) {
                let error = false
                page = await this.module.getPageFromServer(noteId, pageNumber, false)
                pageSlug = page?.id
                
                if(!(localPages.includes(String(pageSlug))) && pageSlug != undefined) {
                    // delete page
                    await $.ajax({
                        type: "DELETE",
                        url: api_url + "academy/page/" + pageSlug,
                        contentType: "json",
                        accepts: "json",
                        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                        error: () => error = true
                    })

                    if(error) throw Error("Errore eliminazione pagina - " + pageSlug)
                }

                pageNumber++
            }
        }

    }

    async createModule(updateMode = false, categoryChanged = false) {
        let accessToken = window.localStorage.getItem("accessToken")
        let arg = this.getArguments().getSelectedChoices()[0]
        let slug = undefined

        let requestType = ""
        let requestLink = ""

        
        if(updateMode && !categoryChanged) {
            requestType = "PUT"
            requestLink = "academy/module/" + this.module.getId()
        } else {
            requestType = "POST"
            requestLink = "academy/argument/" + arg + "/modules"
        }
        
        // used to send file
        let formData = new FormData()
        formData.append('title', this.module.getTitle())
        formData.append('description', this.module.getDescription())
        formData.append('difficulty', this.module.getDifficultyLevel())
        if(this.module.getWallpaper().slice(0, 5) != "https") {
            formData.append('picture', urlToFile(this.module.getWallpaper(), '_name_.jpg'))
        }

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: false,
            processData: false,
            data: formData,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: async (data) => {
                slug = data['slug']
                this.module.setId(slug)
            },
        })

        return slug
    }

    async postModules(slug, moduleId, updateMode = false) {
        let accessToken = window.localStorage.getItem("accessToken")
        let moduleSlug = undefined

        let requestType = ""
        let requestLink = ""
        
        if(moduleId[0] != '_' && updateMode) {
            requestType = "PUT"
            requestLink = "academy/note/" + moduleId
        } else {
            requestType = "POST"
            requestLink = "academy/module/" + slug + "/notes"
        }

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                title: this.module.getModuleTitle(moduleId),
                noteOrder: this.module.getModuleById(moduleId)['position']
            }),
            success: async (data) => {
                moduleSlug = data['slug']
                
                // updating module id
                let modules = this.module.getModules()
                modules[moduleSlug] = modules[moduleId]

                if(moduleId != moduleSlug) delete modules[moduleId]

                this.module.setModules(modules)
            },
        })

        return moduleSlug
    }

    async postQuiz(moduleId, moduleSlug, pageId, updateMode = false) {
        // return true if everything's all right
        // return undefined if an error occures

        let accessToken = window.localStorage.getItem("accessToken")
        let pageContent = this.module.getPageContent(moduleId, pageId)

        let requestType = ""
        let requestLink = ""
        
        if(pageId[0] != "_" && updateMode) {
            requestType = "PUT"
            requestLink = "quiz/" + pageId
            updateMode = true
        } else {
            requestType = "POST"
            requestLink = "quiz"
            updateMode = false
        }

        // create quiz
        let quizSlug = await pageContent.publish()
        
        if(quizSlug == undefined) return false
        else {
            // updating quiz id
            pageContent.question.setId(quizSlug)

            let error = false
            if(!updateMode) {
                // link quiz to module
                await $.ajax({
                    type: "POST",
                    url: api_url + "/academy/note/" + moduleSlug + "/pages",
                    contentType: "application/json",
                    accepts: "application/json",
                    data: JSON.stringify({
                        content: "",
                        quizSlug: quizSlug,
                        pageOrder: this.module.getPage(moduleId, pageId)['position']
                    }),
                    beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                    success: (data) => {
                        let pageSlug = data['id']

                        // updating page id
                        let pages = this.module.getAllPages(moduleId)
                        pages[pageSlug] = pages[pageId]
                        if(pageId != pageSlug) delete pages[pageId]
                    },
                    error: () => error = true
                })
            }
            return true
        }

    }

    async postText(moduleId, moduleSlug, pageId, updateMode = false) {
        let accessToken = window.localStorage.getItem("accessToken")
        let error = false

        let requestType = ""
        let requestLink = ""
        
        if(pageId[0] != "_" && updateMode) {
            requestType = "PUT"
            requestLink = "academy/page/" + pageId
            updateMode = true
        } else {
            requestType = "POST"
            requestLink = "academy/note/" + moduleSlug + "/pages"
            updateMode = false
        }

        // used to send file
        let formData = new FormData()
        formData.append('content', this.module.getPageContent(moduleId, pageId))
        formData.append('pageOrder',  this.module.getPage(moduleId, pageId)['position'])
        if(this.module.getPageWallpaper(moduleId, pageId).slice(0,5) != "https") {
            formData.append('picture', urlToFile(this.module.getPageWallpaper(moduleId, pageId), '_name_.jpg'))
        } 
        
        // deleting image
        if(this.module.getPageWallpaper(moduleId, pageId) == "" && updateMode) {
            await $.ajax({
                type: "DELETE",
                url: api_url + "/academy/page/" + pageId +  "/image",
                accepts: "application/json",
                contentType: false,
                processData: false,
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            })
        }

        // create text page
        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: false,
            processData: false,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: formData,
            success: (data) => {

                let pageSlug = data['id']

                // updating page id
                let pages = this.module.getAllPages(moduleId)
                pages[pageSlug] = pages[pageId]

                if(pageId != pageSlug) delete pages[pageId]
            },
            error: () => error = false
        })
        return error
    }

    isContentValid() {
        // wallpaper check
        if(this.module.getWallpaper() == "") return {error : true, message : "Wallpaper non inserito"}
        // title check
        if(this.module.getTitle().replaceAll(" ", "") == "") return {error : true, message: "Titolo non valido"}
        // description check
        if(this.module.getDescription().replaceAll(" ", "") == "") return {error : true, message: "Descrizione non valida"}
        // category check
        if(this.getArguments().getSelectedChoices().length == 0) return {error : true, message: "Argomento non inserito"}
        // difficulty check
        if(this.module.getDifficultyLevel() == "") return {error : true, message : "Difficoltà non inserita"}
        // module title and module content check
        for(let moduleID of Object.keys(this.module.getModules())) {
            if(this.module.getModuleTitle(moduleID).replaceAll(" ", "") == "")
                return {error : true, message : "Alcune note non hanno titolo"}
            for(let pageID of Object.keys(this.module.getAllPages(moduleID)))
                if(this.module.getPageType(moduleID, pageID) == "quiz") {
                    if(this.module.getPageContent(moduleID, pageID).question.getTitle().replaceAll(" ", "") == "" )
                        return {error : true, message : "Alcuni quiz hanno il titolo vuoto"}
                } else {
                    if(this.module.getPageContent(moduleID, pageID).replaceAll(" ", "") == "")
                        return {error : true, message : "Alcune pagine hanno contenuto vuoto"}
                }
        }
        return {error : false, message: "Tutto inserito"}
    }

}

export default CreateModuleController