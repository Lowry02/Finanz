import CourseController from "./course_controller"
import QuestionController from "./question_controller"
import $ from "jquery"
import {api_url} from "../App"

class CourseCreationController {
    constructor(course = new CourseController, state = undefined, args = new QuestionController(), presentationVideo = undefined) {
        this.course = course
        this.course.setOverrideState((() => this.updateInfo()).bind(this))
        this.args = args
        this.args.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
        this.presentationVideo = presentationVideo
        this.state = state
    }

    setState(state) {
        this.state = state
    }

    updateInfo() {
        if(this.state != undefined)
            this.state(new CourseCreationController(this.course, this.state, this.args, this.presentationVideo))
    }

    load({course, args, presentationVideo}) {
        console.log(course)
        this.course.load({...course})
        this.setArgs(args) // da rivedere
        this.updateInfo()
    }

    loadArgs() {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "GET",
            url: api_url + "course/arguments",
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
                    acceptedChoices: 1
                })

                let categories = data['arguments']

                for(let category of categories) {
                    let categorySlug = category['slug']
                    let categoryTitle = category['title']
                    let categoryDescription = category['description']
                    // let categoryDescription = category['title']
                    console.log(data)
                    categoriesObject.addChoice({title : categoryTitle, slug: categorySlug, description: categoryDescription}, categorySlug)
                }

                this.setArgs(categoriesObject)
            },
            error: (message) => console.log(message)
        })
    }

    postArgument(title, description, callback) {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "POST",
            url: api_url + "course/arguments",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                title : title,
                description : description
            }),
            success: (data) => {
                callback(data)
            },
            error: (message) => console.log(message)
        })
    }

    updateArgument(slug, title, description, callback) {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "PUT",
            url: api_url + "course/argument/" + slug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                title : title,
                description : description
            }),
            success: (data) => {
                callback()
            },
            error: (message) => console.log(message)
        })
    }

    deleteArgument(slug, callback) {
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "DELETE",
            url: api_url + "course/argument/" + slug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                callback()
            },
            error: (message) => console.log(message)
        })
    }


    async postCourse() {
        let accessToken = window.localStorage.getItem('accessToken')
        let slug = undefined

        await $.ajax({
            type: "POST",
            url: api_url + "courses",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                argument_slug : this.getArgs().getSelectedChoices()[0],
                title : this.course.getTitle(),
                description : this.course.getDescription()
            }),
            success: (data) => {
                slug = data['slug']
            },
            error: (message) => console.log(message)
        })

        return slug
    }

    async postChapter(courseSlug, chapterTitle, chapterPosition) {
        let accessToken = window.localStorage.getItem('accessToken')
        let slug = undefined

        await $.ajax({
            type: "POST",
            url: api_url + "course/" + courseSlug + "/chapters",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                title : chapterTitle,
                chapterOrder : chapterPosition
            }),
            success: (data) => {
                slug = data['slug']
            },
            error: (message) => console.log(message)
        })

        return slug
    }

    async postLesson(chapterSlug, lessonTitle, lessonDescription, lessonText, lessonVideo, lessonPosition, isFree) {
        let accessToken = window.localStorage.getItem('accessToken')
        let slug = undefined

        await $.ajax({
            type: "POST",
            url: api_url + "course/chapter/" + chapterSlug + "/lessons",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                // quizSlug : ,
                title : lessonTitle,
                description : lessonDescription,
                text : lessonText,
                video : lessonVideo,
                lessonOrder : lessonPosition,
                isFree : isFree
            }),
            success: (data) => {
                slug = data['slug']
            },
            error: (message) => console.log(message)
        })

        return slug
    }

    async publish() {
        // course creation
        let courseSlug = await this.postCourse()
        if(courseSlug == undefined) throw Error()
        // chapter creation
        let chapters = this.course.getContent()

        for(let chapterId of Object.keys(chapters)) {
            let chapterTitle = this.course.getChapterTitle(chapterId)
            let chapterPosition = this.course.getChapter(chapterId)?.position
            let chapterSlug = await this.postChapter(courseSlug, chapterTitle, chapterPosition) 
            if(chapterSlug == undefined) throw Error()
            // updating content
            this.course.getContent()[chapterSlug] = this.course.getChapter(chapterId)
            delete this.course.getContent()[chapterId]
            
            // creating lessons
            let lessons = this.course.getLessonsByChapter(chapterSlug)
            for(let lessonId of Object.keys(lessons)) {
                let lessonQuiz = this.course.getLessonQuiz(chapterSlug, lessonId)
                // to implement(as list of slug or a single slug?)
                // for(let quiz of Object.values(lessonQuiz)) quiz.publish() 
                let lessonTitle = this.course.getLessonTitle(chapterSlug, lessonId)
                let lessonDescription = this.course.getLessonDescription(chapterSlug, lessonId)
                let lessonText = this.course.getLessonText(chapterSlug, lessonId)
                let lessonVideo = this.course.getLessonVideo(chapterSlug, lessonId)
                let lessonPosition = this.course.getLessonPosition(chapterSlug, lessonId)
                let isFree = true // ?

                let lessonSlug = await this.postLesson(chapterSlug, lessonTitle, lessonDescription, lessonText, lessonVideo, lessonPosition, isFree)
                if(lessonSlug == undefined) throw Error()

                // updateing lessons
                this.course.getLessonsByChapter(chapterSlug)[lessonSlug] = this.course.getLessonsByChapter(chapterSlug)[lessonId]
                delete this.course.getLessonsByChapter(chapterSlug)[lessonId]
            }
        }
    }

    setArgs(args, _auto_save = true) {
        this.args = args
        if(_auto_save) this.updateInfo()
    }
    
    getArgs() {
        return this.args
    }

    setPresentationVideo(presentationVideo, _auto_save = true) {
        this.presentationVideo = presentationVideo
        if(_auto_save) this.updateInfo()
    }

    getPresentationVideo() {
        return this.presentationVideo
    }

    checkContentValidity() {
       // wallpaper check 
    //    if(this.course.getWallpaper() == "") return { error : true, message : "Wallpaper non inserito"}
       // title check
       if(this.course.getTitle().replaceAll(" ", "") == "") return { error : true, message : "Titolo non inserito"}
       // description check
       if(this.course.getDescription().replaceAll(" ", "") == "") return { error : true, message : "Descrizione non inserita"}
       // video check
       if(this.course.getPresentationVideo() == "") return { error : true, message : "Video di presentazione non inserito"}
       // syllabus check
       if(this.course.getSyllabus().replaceAll(" ", "") == "") return { error : true, message : "Syllabus non inserito"}
       // argument check
       if(this.getArgs().getSelectedChoices().length == 0) return { error : true, message : "Argomento non inserito"}
       // page checks
       for(let chapterId of Object.keys(this.course.getContent())) {
        // chapter title check
        if(this.course.getChapterTitle(chapterId).replaceAll(" ", "") == "") return { error : true, message : "Titolo di un capitolo non inserito"}
        // lesson checks
        for(let lessonId of Object.keys(this.course.getLessonsByChapter(chapterId))) {
            // lesson title check
            if(this.course.getLessonTitle(chapterId, lessonId).replaceAll(" ", "") == "") return { error : true, message : "Titolo di una lezione non inserito"}
            // lesson description check
            if(this.course.getLessonDescription(chapterId, lessonId).replaceAll(" ", "") == "") return { error : true, message : "Descrizione di una lezione non inserita"}
            // lesson video check
            if(this.course.getLessonVideo(chapterId, lessonId) == "") return { error : true, message : "Video di una lezione non inserito"}
            // lesson content check (NOT WORKING)
            // if(this.course.getLessonText(chapterId, lessonId) == "") return { error : true, message : "Testo di una lezione non inserito"}

        }
       }
       return { error : false, message : "Tutto apposto" }
    }

}

export default CourseCreationController