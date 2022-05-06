import accademyCourse from "../test_data/accademy"
import ModuleController from "./module_controller"
import {api_url} from "../App"
import $ from "jquery"

class AccademyListController {
    constructor(personalModules = {}, allModules = {}, savedModules = {}, createdModules = {}, modulesInProgress = {}, modulesPerCategory = {}, infoPersonalModules = {}, categories = {}, state = undefined, overrideState = undefined, created_news_index = 1) {
        this.personalModules = personalModules 
        this.allModules = allModules
        this.savedModules = savedModules
        this.createdModules = createdModules
        this.modulesInProgress = modulesInProgress
        this.infoPersonalModules = infoPersonalModules
        this.modulesPerCategory = modulesPerCategory
        this.categories = categories
        this.state = state
        this.overrideState = overrideState
        this.created_news_index = created_news_index
        this.PERSONAL_MODULES_TAG = "personal"
        this.ALL_MODULES_TAG = "all"
        this.SAVED_MODULES_TAG = "saved"
        this.CREATED_MODULES_TAG = "created"
        this.IN_PROGRESS_MODULE_TAG = "in_progress"
    }

    setState(state) {
        this.state = state
        this.updateInfo()
    }

    setOverrideState(overrideState) {
        this.overrideState = overrideState
    }

    load({personalModules, allModules, savedModules, createdModules, modulesInProgress, infoPersonalModules, modulesPerCategory, categories, state, overrideState, created_news_index}) {
        this.personalModules = personalModules 
        this.allModules = allModules
        this.savedModules = savedModules
        this.createdModules = createdModules
        this.modulesInProgress = modulesInProgress
        this.infoPersonalModules = infoPersonalModules
        this.modulesPerCategory = modulesPerCategory
        this.categories = categories
        this.state = state
        this.overrideState = overrideState
        this.created_news_index = created_news_index
    }

    updateInfo() {
        if(this.state != undefined) {
            this.state(new AccademyListController(
                this.personalModules,
                this.allModules,
                this.savedModules,
                this.createdModules,
                this.modulesInProgress,
                this.infoPersonalModules,
                this.modulesPerCategory,
                this.categories,
                this.state,
            ))
        }
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    getPersonalModules() { return this.personalModules }

    getAllModules() { return this.allModules }

    getSavedModules() { return this.savedModules }

    getCreatedModules() { return this.createdModules }

    getModulesInProgress() { return this.modulesInProgress }

    getInfoPersonalModules() { return this.infoPersonalModules }

    getModulesPerCategory() { return this.modulesPerCategory }
    
    getCategories() { return this.categories }

    setPersonalModules(personalModules) {
        this.personalModules = {...this.personalModules, ...personalModules}
        this.updateInfo()
    }

    setAllModules(allModules) {
        this.allModules = {...this.allModules, ...allModules}
        this.updateInfo()
    }

    setSavedModules(savedModules) {
        this.savedModules = {...this.savedModules, ...savedModules}
        this.updateInfo()
    }

    setCreatedModules(createdModules) {
        this.createdModules = {...this.createdModules, ...createdModules}
        this.updateInfo()
    }
    
    setModulesInProgress(modulesInProgress) {
        this.modulesInProgress = {...this.modulesInProgress, ...modulesInProgress}
        this.updateInfo()
    }

    setInfoPersonalModules(infoPersonalModules) {
        this.infoPersonalModules = infoPersonalModules
        this.updateInfo()
    }

    setModulesPerCategory(modulesPerCategory) {
        this.modulesPerCategory = modulesPerCategory
        this.updateInfo()
    }

    setCategories(categories) {
        this.categories = categories
        this.updateInfo()
    }

    __getModulesList(obj, l) {
        let list = {}
        let length = Object.keys(obj).length
        for(let i = length; i < length + l; i++) {
            let newModule = new ModuleController()
            newModule.setOverrideState((() => this.updateInfo()).bind(this))
            newModule.load(accademyCourse)
            newModule.setId(i)
            list[i] = newModule
        }
        return list
    }

    loadPersonalModules(n = 10) {
        let list = this.__getModulesList(this.personalModules, n)
        this.setPersonalModules(list)
    }

    loadSavedModules(n = 10) {
        let list = this.__getModulesList(this.savedModules, n)
        this.setSavedModules(list)
    }
    
    loadAllModules(n = 10) {
        let list = this.__getModulesList(this.allModules, n)
        this.setAllModules(list)
    }

    async loadCreatedModules(n = 10) {
        // API call
        let accessToken = window.localStorage.getItem('accessToken')

        if(this.created_news_index != null) {
            $.ajax({
                type: "GET",
                url: api_url + "academy/modules/modifiable",
                accepts: "json",
                contentType: "json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                data: {
                    page: this.created_news_index
                },
                success: (data) => {
                    let list = data['module_list']
                    let moduleList = {}
                    for(let moduleInfo of list) {
                        let newModule = new ModuleController()
                        newModule.setOverrideState((() => this.updateInfo()).bind(this))
                        newModule.setId(moduleInfo['slug'])
                        newModule.setTitle(moduleInfo['title'])
                        moduleList[moduleInfo['slug']] = newModule
                    }
                    this.created_news_index = data['next_page']
                    console.log(data)
                    this.setCreatedModules(moduleList)
                },
                error: (message) => console.log(message)
            })
        }
        
    }

    loadModulesInProgress(n = 10) {
        let list = this.__getModulesList(this.modulesInProgress, n)
        this.setModulesInProgress(list)
    }

    loadInfoPersonalModules() {
        let info = {
            time: "15 giorni",
            args: "Economia, Finanza, Python per la Finanza, Finanza, Economia, Python per la Finanza, Finanza, Python per la Finanza, Finanza, Python per la Finanza, Economia, Finanza, Python per la Finanza, Finanza, Python per la Finanza, "
        }
        this.setInfoPersonalModules(info)
    }

    async loadModulesPerCategory(category) {
        let modulesPerCategory = this.getModulesPerCategory()
        let modules = modulesPerCategory[category]
        let error = false

        if(modules == undefined && category != undefined) {
            // make request
            let accessToken = window.localStorage.getItem('accessToken')

            try {
                await $.ajax({
                    type: "GET",
                    url: api_url + "/academy/argument/" + category +"/modules",
                    accepts: "json",
                    contentType: "json",
                    beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                    success: (data) => {
                        console.log(data)
                        let list = data['module_list']
                        if(list != undefined) {
                            let modules = {}

                            for(let module of list) {
                                let newAcademy = new ModuleController()
                                newAcademy.setId(module['slug'])
                                newAcademy.setTitle(module['title'])
                                newAcademy.setWallpaper(module['coverImageLink'])
                                newAcademy.setAuthor(module['author']['personalData']['surname'] + " " + module['author']['personalData']['name'] )
                                modules[module['slug']] = newAcademy
                            }

                            this.modulesPerCategory[category] = modules
                            console.log(this.modulesPerCategory)
                            this.updateInfo()
                        } else {
                            console.warn("list not found in response")
                        }
                    }
                })
            } catch {
                error = true
            }
        }

        return error
    }

    async loadCategories() {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        try {
            await $.ajax({
                type: "GET",
                url: api_url + "/academy/arguments",
                accepts: "json",
                contentType: "json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                success: (data) => {
                    let args = data['arguments']
                    console.log(args)
                    if(args != undefined) {
                        let list = {}
                        for(let arg of args) {
                            let slug = arg['slug']
                            let title = arg['title']
                            let description = arg['description']
                            list[slug] = {
                                title: title,
                                description: description
                            }
                            this.setCategories(list)
                        }
                    } else {
                        console.warn("No arguments in request")
                    }
                },
                error: (message) => console.log(message)
            })
        } catch {
            error = true
        }

        return error
    }

    removeModule(courseId, tag) {
        if(tag == this.CREATED_MODULES_TAG) {
            delete this.personalModules[courseId]
            delete this.allModules[courseId]
            delete this.savedModules[courseId]
            delete this.createdModules[courseId]
            delete this.modulesInProgress[courseId]
        }
        else if(tag == this.PERSONAL_MODULES_TAG)
            delete this.personalModules[courseId]
        else if(tag == this.SAVED_MODULES_TAG)
            delete this.savedModules[courseId]
        else if(tag == this.ALL_MODULES_TAG)
            delete this.allModules[courseId]
        else if(tag == this.IN_PROGRESS_MODULE_TAG)
            delete this.modulesInProgress[courseId]
        
        let accessToken = window.localStorage.getItem('accessToken')
        $.ajax({
            type: "DELETE",
            url: api_url + "academy/module/" + courseId,
            accepts: "json",
            contentType: "json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => console.log(data),
            error: (message) => console.log(message)
        })

        this.updateInfo()
    }


    isLastPageLoaded() {
        return this.created_news_index == null
    }

}

export default AccademyListController