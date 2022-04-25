import User from "../models/user";
import NewsListController from "./news_list_controller";
import CourseListController from "./courses_list_controller"
import AccademyListController from "./accademy_list_controller"
import WebinarList from "./webinar_list"
import {api_url} from "../App"
import $ from "jquery"
import { ClosedCaptionDisabledOutlined } from "@mui/icons-material";

// TEST
const _USERNAME = "utente"
const _PASSWORD = "password"

class UserController {
    constructor(user = new User(), news = new NewsListController(), courses = new CourseListController(), modules = new AccademyListController(), webinar = new WebinarList(), justLogged = false, state = undefined) {
        this.user = user
        this.news = news
        this.news.setOverrideState((() => this.updateState()).bind(this))
        this.courses = courses
        this.courses.setOverrideState((() => this.updateState()).bind(this))
        this.modules = modules
        this.modules.setOverrideState((() => this.updateState()).bind(this))
        this.webinar = webinar
        this.webinar.setOverrideState((() => this.updateState()).bind(this))
        this.justLogged = justLogged
        this.state = state
    }

    setState(state) {
        this.state = state
        this.updateState()
    }
    
    load(info) {
        this.user.load(info)
        this.updateState()
    }
    
    updateState() {
        if(this.state != undefined)
            this.state(new UserController(this.user, this.news, this.courses, this.modules, this.webinar, this.justLogged, this.state))
    }

    capitalizeFirstLetter(string) {
        if(string != "") {
            let first_letter = string[0].toUpperCase()
            return first_letter + string.slice(1, string.length)
        } else return string
    }

    getAccessToken() {return this.user.getAccessToken()}
    getRefreshToken() {return this.user.getRefreshToken()}
    getName() {return this.user.getName()}
    getSurname() {return this.user.getSurname()}
    getBirthday() {return this.user.getBirthday()}
    getEmail() {return this.user.getEmail()}
    getUsername() {return this.user.getUsername()}
    getPassword() {return this.user.getPassword()}
    getCodiceInvito() {return this.user.getCodiceInvito()}
    getAvatar() {return this.user.getAvatar()}
    getXP() {return this.user.getXP()}
    getLanguage() {return this.user.language}
    getLeague() {return this.user.league}
    getConsecutiveDaysJoin() {return this.user.consecutiveDaysJoin}
    getRole() {return this.user.role}
    getCreatedCodes() {return this.user.createdCodes}

    setAccessToken(accessToken, _auto_save = true) {
        this.user.setAccessToken(accessToken)
        window.localStorage.setItem('accessToken', accessToken)
        if(_auto_save) this.updateState()
    }
    
    setRefreshToken(refreshToken, _auto_save = true) {
        this.user.setRefreshToken(refreshToken)
        window.localStorage.setItem('refreshToken', refreshToken)
        if(_auto_save) this.updateState()
    }

    setName(name, _auto_save = true) {
        name = this.capitalizeFirstLetter(name)
        this.user.setName(name)
        if(_auto_save) this.updateState()
    }

    setSurname(surname, _auto_save = true) {
        surname = this.capitalizeFirstLetter(surname)
        this.user.setSurname(surname) 
        if(_auto_save) this.updateState()
    }

    setBirthday(birthday, _auto_save = true) {
        this.user.setBirthday(birthday) 
        if(_auto_save) this.updateState()
    }

    setEmail(email, _auto_save = true) {
        this.user.setEmail(email)
        if(_auto_save) this.updateState()
    }

    setUsername(username, _auto_save = true) {
        this.user.setUsername(username)
        if(_auto_save) this.updateState()
    }

    setPassword(password, _auto_save = true) {
        this.user.setPassword(password)
        if(_auto_save) this.updateState()
    }

    setCodiceInvito(codice_invito, _auto_save = true) {
        this.user.setCodiceInvito(codice_invito)
        if(_auto_save) this.updateState()
    }

    setAvatar(avatar, _auto_save = true) {
        this.user.setAvatar(avatar)
        if(_auto_save) this.updateState()
    }

    setXP(xp, _auto_save = true) {
        this.user.setXP(xp)
        if(this._auto_save) this.updateState()
    } 

    setLanguage(language, _auto_save = true) {
        this.user.setLanguage(language)
        if(this._auto_save) this.updateState()
    } 

    setLeague(league, _auto_save = true) {
        this.user.setXP(league)
        if(this._auto_save) this.updateState()
    } 

    setConsecutiveDaysJoin(consecutiveDaysJoin, _auto_save = true) {
        this.user.setXP(consecutiveDaysJoin)
        if(this._auto_save) this.updateState()
    } 

    setRole(role, _auto_save = true) {
        this.user.setXP(role)
        if(this._auto_save) this.updateState()
    }

    setCreatedCodes(createdCodes, _auto_save = true) {
        this.user.setCreatedCodes(createdCodes)
        if(this._auto_save) {
            console.log('aggiorno')
            this.updateState()
        }
    }

    isValidBirthday() {
        return new Date() > new Date(this.getBirthday())
    }
    
    isValidEmail() {
        return String(this.getEmail())
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    isValidUsername() {
        // DA SVILUPPARE
        return true
    }

    exportInfo() {
        let _user = new User()
        _user.load(this.user)
        return _user
    }

    makeUserFieldEmpty() {
        this.user = new User()
    }

    isLogged() {
        let accessToken = window.localStorage.getItem("accessToken")
        let refreshToken = window.localStorage.getItem("refreshToken")
        if(accessToken != undefined && refreshToken != undefined) {
            // just logged
            this.setAccessToken(accessToken)
            this.setRefreshToken(refreshToken)
            return true
        } else {
            // not logged
            return false
        }
    }

    
    getUserInfo(f = undefined) {
        // DA SVLUPPARE
        if(f != undefined)
            f()
    }

    async areCredentialsCorrect(username, password, callback) {
        return $.ajax({
            type : "POST",
            url : api_url +  "login",
            data : {
                username : username,
                password : password
            },
            success : async (data) => {
                let isError = false
                let accessToken = data.access_token
                let refreshToken = data.refresh_token
                let auto_update = false
                this.setAccessToken(accessToken, auto_update)
                this.setRefreshToken(refreshToken, auto_update)
                await this.setInfo(() => callback(isError, data))
                console.log("prima io")
            },
            error : (message) => {
                let isError = true
                let data = message.responseJSON
                callback(isError, data)
            }
        })

    }

    async putInfo() {
        let accessToken = this.getAccessToken()

        $.ajax({
            type : "PUT",
            url : api_url + "user",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + accessToken),
            data: JSON.stringify({
                name: this.getName(),
                surname: this.getSurname(),
                birthDay: this.getBirthday(),
            })
        })
    }

    async setInfo(callback) {
        let accessToken = this.getAccessToken()
        let refreshToken = this.getRefreshToken()

        $.ajax({
            type : "GET",
            url : api_url + "user",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + accessToken),
            success : (data) => {
                let info = {
                    username : data.username,
                    name : data.personalData.name,
                    surname : data.personalData.surname,
                    email : data.personalData.emailAddress,
                    birthday : data.personalData.birthDay,
                    language : data.personalData.language,
                    xp : data.gamificationData.xp,
                    league : data.gamificationData.league,
                    consecutiveDaysJoin : data.gamificationData.consecutiveDaysJoin,
                    role : data.roles
                }
                this.load(info)
                if(callback != undefined) callback()
            },
            error : (message) => {
                if(message.status == 401) {
                    this.refreshToken(callback)
                }
            }
        })
    }
    
    async refreshToken(callback) {
        let refreshToken = window.localStorage.getItem('refreshToken')

        $.ajax({
            type: "POST",
            url : api_url + "refreshToken",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + refreshToken),
            success: (data) => {
                this.setAccessToken(data['access_token'])
                this.setInfo(callback)
            },
            error: (message) => console.log(message)
        })
    }

    logout() {
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('refreshToken')
    }

    async signIn() {
        await $.ajax({
            type : "POST",
            url : api_url + "signin",
            accepts: "application/json",
            contentType: "application/json",
            data: JSON.stringify({
                username: this.getUsername(),
                password: this.getPassword(),
                name: this.getName(),
                surname: this.getSurname(),
                birthDay: this.getBirthday(),
                emailAddress: this.getEmail(),
                language: "IT"
                // language: this.getLanguage()
            })
        })
    }

    generateCode(roles) {
        return $.ajax({
            type : "POST",
            url : api_url + "code/invitation_codes",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + this.getAccessToken()),
            data: JSON.stringify({
                "roles_slug": roles
            }),
            success: (data) => this.setCodiceInvito(data['code']['code']),
        })

    }

    async redeemCode() {
        return $.ajax({
            type : "POST",
            url : api_url + "code/redeem_code",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + this.getAccessToken()),
            data: JSON.stringify({
                "code": this.getCodiceInvito()
            }),
        })
    }

    // codes not used
    getCreatedCodesFromServer() {
        let access_token = window.localStorage.getItem('accessToken')
        $.ajax({
            type : "GET",
            url : api_url + "code/invitation_codes",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + access_token),
            success: (data) => {
                let list = []
                for(let codeObj of data['codes']) {
                    if(codeObj['oneTimeCode'] != 0) {
                        let code = codeObj['code']
                        let roles = codeObj['roles']
                        let roleNames = ""
                        for(let role of roles) roleNames += role['name'] + ", "
                        let usages = codeObj['usages']
                        list.push({code: code, roles: roleNames.slice(0, -2), usages: usages}) // removes comma
                    }
                }
                this.user.setCreatedCodes(list)
                this.updateState()
            }
        })
    }

    async deleteCode(code) {
        let access_token = window.localStorage.getItem('accessToken')

        $.ajax({
            type : "DELETE",
            url : api_url + "/code/invitation_code/" + code,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + access_token),
            success: () => this.getCreatedCodesFromServer()
        })
    }

    async getAllRoles() {
        let access_token = window.localStorage.getItem("accessToken")
        let list = []
        await $.ajax({
            type : "GET",
            url : api_url + "roles",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend : (request) => request.setRequestHeader("Authorization", "Bearer " + access_token),
            success: (data) => list = data['roles']
        })
        return list
    }
}

export default UserController