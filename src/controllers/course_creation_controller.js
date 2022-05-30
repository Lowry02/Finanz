import CourseController from "./course_controller"
import QuestionController from "./question_controller"
import $ from "jquery"
import {api_url} from "../App"
import { urlToFile } from "../utils"

class CourseCreationController {
    constructor(course = new CourseController(), state = undefined, args = new QuestionController(), presentationVideo = undefined) {
        this.course = course
        course.course.quiz_type = undefined
        this.course.setOverrideState((() => this.updateInfo()).bind(this))
        this.args = args
        this.args.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
        // this.args.addSelectedChoice(this.course.getArgument()['id'])
        this.presentationVideo = presentationVideo
        this.state = state
    }

    setState(state) {
        this.state = state
    }

    updateInfo() {
        if(this.state != undefined) {
            // linking module argument to argument selection
            console.log("QUI", this.course.getArgument())
            if(this.getArgs().getSelectedChoices().length == 0) {
                if(this.course.getArgument() != "") {
                    let id = this.course.getArgument()['id'] == undefined ? this.course.getArgument() : this.course.getArgument()['id']
                    this.getArgs()?.addSelectedChoice(id, false)
                }
            } else {
                let argument = this.getArgs().getSelectedChoices()[0]
                this.course.setArgument(argument, false)
            }

            this.state(new CourseCreationController(this.course, this.state, this.args, this.presentationVideo))
        }
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
                callback(data)
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

    addAuthor(author) {
        if(author != "") {
            this.course.getOfferedBy().push(author)
            this.updateInfo()
        }
    }

    deleteAuthor(author) {
        let index = this.course.getOfferedBy().indexOf(author)
        this.course.getOfferedBy().splice(index, 1)
        this.updateInfo()
    }

    async postCourse(updateMode) {
        let accessToken = window.localStorage.getItem('accessToken')
        let slug = undefined

        let requestType = ""
        let requestLink = ""

        console.log(updateMode)

        if(updateMode) {
            requestType = "PUT"
            requestLink = "course/" + this.course.getId()
        } else {
            requestType = "POST"
            requestLink = "courses"
        }

        // used to pass pictures
        let formData = new FormData()
        formData.append("argument_slug", this.getArgs().getSelectedChoices()[0])
        formData.append("title", this.course.getTitle())
        formData.append("description", this.course.getDescription())
        formData.append("trailerVideoIframe", this.course.getPresentationVideo())
        formData.append("trailerVideoId", this.course.getPresentationVideoId())
        if(this.course.getWallpaper().slice(0, 5) != "https")
            formData.append("picture", urlToFile(this.course.getWallpaper()))
        else 
            formData.append("picture", this.course.getWallpaper())

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: false,
            processData: false,
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: formData,
            success: (data) => {
                slug = data['slug']
                // updating slug
                this.course.setId(slug)
                this.course.setWallpaper(data['coverImageLink'])
            },
            error: (message) => console.log(message)
        })

        return slug
    }

    async postChapter(courseSlug, chapterSlug, chapterTitle, chapterPosition, updateMode) {
        let accessToken = window.localStorage.getItem('accessToken')
        let slug = undefined

        let requestType = ""
        let requestLink = ""

        if(updateMode && chapterSlug[0] != "_") {
            requestType = "PUT"
            requestLink = "course/chapter/" + chapterSlug
        } else {
            requestType = "POST"
            requestLink = "course/" + courseSlug + "/chapters"
        }

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                title : chapterTitle,
                chapterOrder : chapterPosition
            }),
            success: (data) => {
                slug = data['slug']
                
                // updating content
                this.course.getChapter(chapterSlug)['id'] = slug
                this.course.getContent()[slug] = this.course.getChapter(chapterSlug)
                if(slug != chapterSlug) delete this.course.getContent()[chapterSlug]

                console.log(this.course.getContent())
            },
            error: (message) => console.log(message)
        })

        return slug
    }

    async postLesson(chapterSlug, lessonSlug, lessonTitle, lessonDescription, lessonText, lessonVideo, lessonVideoId, lessonPosition, isFree, quizSlugs, updateMode) {
        let accessToken = window.localStorage.getItem('accessToken')
        let slug = undefined

        let requestType = ""
        let requestLink = ""

        if(updateMode && lessonSlug[0] != "_") {
            requestType = "PUT"
            requestLink = "course/lesson/" + lessonSlug
        } else {
            requestType = "POST"
            requestLink = "course/chapter/" + chapterSlug + "/lessons"
        }

        await $.ajax({
            type: requestType,
            url: api_url + requestLink,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: JSON.stringify({
                // quizSlug : ,
                title : lessonTitle,
                description : lessonDescription,
                text : lessonText,
                videoIframe : lessonVideo,
                videoId: lessonVideoId,
                lessonOrder : lessonPosition,
                isFree : isFree
            }),
            success: (data) => {
                slug = data['slug']

                // updating lessons
                this.course.getLessonsByChapter(chapterSlug)[lessonSlug]['id'] = slug
                this.course.getLessonsByChapter(chapterSlug)[slug] = this.course.getLessonsByChapter(chapterSlug)[lessonSlug]
                if(slug != lessonSlug) delete this.course.getLessonsByChapter(chapterSlug)[lessonSlug]

                lessonSlug = slug
            },
            error: (message) => console.log(message)
        })

        // link quiz to lesson
        for(let quizSlug of quizSlugs) {
            let error = await this.linkQuizToLesson(lessonSlug, quizSlug)
            if(error) throw Error("Errore nella pubblicazione del quiz")
        }

        return slug
    }

    async courseExist() {
        let exist = false
        let accessToken = window.localStorage.getItem('accessToken')
        
        if(this.course.getId() != "") {
            await $.ajax({
                type: "GET",
                url: api_url + "course/" + this.course.getId(),
                accepts: "application/json",
                contentType: "application/json",
                beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                success: () => exist = true,
                error: () => exist = false
            }) 
        }

        return exist
    }

    async deleteChapter(chapterId) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        await $.ajax({
            type: "DELETE",
            url: api_url + "course/chapter/" + chapterId,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => error = false,
            error: () => error = true
        })

        return error
    }

    async deleteLesson(lessonSlug) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        await $.ajax({
            type: "DELETE",
            url: api_url + "course/lesson/" + lessonSlug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => error = false,
            error: () => error = true
        })

        return error
    }

    async linkQuizToLesson(lessonSlug, quizSlug) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        await $.ajax({
            type: "POST",
            url: api_url + "course/lesson/" + lessonSlug + "/quiz/" + quizSlug,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => error = false,
            error: () => error = true
        })

        return error
    }

    async linkCourseToAuthor(courseId, author) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        await $.ajax({
            type: "POST",
            url: api_url + "course/" + courseId + "/author/" + author,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => error = false,
            error: () => error = true
        })

        return error
    }

    async deleteCourseAuthor(courseId, author) {
        let accessToken = window.localStorage.getItem('accessToken')
        let error = false

        console.log(author)


        await $.ajax({
            type: "DELETE",
            url: api_url + "course/" + courseId + "/author/" + author,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: () => error = false,
            error: () => error = true
        })

        return error
    }

    async publish(messageFunction = () => {}) {
        let accessToken = window.localStorage.getItem('accessToken')

        // check if exist
        let updateMode = await this.courseExist()

        // course creation
        messageFunction({error: false, message: "Pubblicazione corso"})
        let courseSlug = await this.postCourse(updateMode)
        if(courseSlug == undefined) throw Error()

        // link course to author
        messageFunction({error: false, message: "Collego autori al corso"})
        for(let username of this.course.getOfferedBy()) {
            messageFunction({error: false, message: "Collego " + username})
            let error = await this.linkCourseToAuthor(courseSlug, username)
            if(error) throw Error("Errore nel collegamento dell'autore")
        }

        // deleting course author
        messageFunction({error: false, message: "Elimino i vecchi autori"})
        let authors = (await this.course.getGeneralInfo(courseSlug))['course']['authors']
        for(let author of authors) {
            if(!this.course.getOfferedBy().includes(author)) {
                messageFunction({error: false, message: "Elimino " + author})
                let error = await this.deleteCourseAuthor(courseSlug, author)
                if(error) throw Error("Nome utente non esistente(" + author + ")")
            }
        }

        // deleting chapters
        messageFunction({error: false, message: "Elimino i vecchi capitoli e lezioni"})

        if(updateMode) {
            let localChaptersSlug = Object.keys(this.course.getContent())
            let serverCourseInfo = await this.course.getGeneralInfo(courseSlug)
            let chapters = serverCourseInfo['chapters']
            for(let chapter of chapters) {
                let chapterSlug = chapter['slug']
                
                // delete chapter and update localContent
                if(!localChaptersSlug.includes(chapterSlug)) {
                    messageFunction({error: false, message: "Elimino " + chapterSlug})
                    let error = await this.deleteChapter(chapterSlug)
                    if(error) throw Error("Errore nell'eliminazione di una capitlo - " + chapter['title'])
                    delete this.course.getContent()[chapterSlug]
                } else {
                    // delete lessons per chapter
                    let localLessons = this.course.getLessonsByChapter(chapterSlug)
                    let serverLessons = chapter['lessons']
                    let serverLessonsSlug = serverLessons.map(item => item['slug'])
                    for(let lessonId of serverLessonsSlug) {
                        // delete and update localContent
                        if(!Object.keys(localLessons).includes(lessonId)) {
                            messageFunction({error: false, message: "Elimino " + lessonId})
                            let error = await this.deleteLesson(lessonId)
                            if(error) throw Error("Errore nell'eliminazione di una lezione - " + chapter['lessons'][lessonId]['title'])
                            delete this.course.getLessonsByChapter(chapterSlug)[lessonId]
                        } else {
                            let serverQuiz = (await this.course.getLessonFromServer(lessonId))
                            if(serverQuiz == undefined) continue
                            serverQuiz = serverQuiz['quiz']
                            let quizSlugs = serverQuiz.map(item => item['slug'])
                            let localQuiz = Object.values(this.course.getLessonQuiz(chapterSlug, lessonId)).map(item => item.question.getId())
                            // deleting quiz
                            messageFunction({error: false, message: "Elimino quiz"})
                            for(let quizId of quizSlugs) {
                                if(!localQuiz.includes(quizId)) {
                                    messageFunction({error: false, message: "Elimino quiz + " + quizId})
                                    let error = false
                                    await $.ajax({
                                        type: "DELETE",
                                        url: api_url + "/course/lesson/" + lessonId + "/quiz/" + quizId,
                                        accepts: "application/json",
                                        contentType: "application/json",
                                        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
                                        error: () => error = true
                                    })
                                    if(error) throw Error("Errore nell'eliminazione di un quiz")
                                    // updating local content
                                    delete this.course.getLesson(chapterSlug, lessonId)['quiz'][quizId]
                                }
                            }
                        }
                    }
                }
            }
        }

        // chapter creation
        let chapters = this.course.getContent()

        for(let chapterId of Object.keys(chapters)) {
            let chapterTitle = this.course.getChapterTitle(chapterId)
            let chapterPosition = this.course.getChapter(chapterId)?.position
            let chapterSlug = await this.postChapter(courseSlug, chapterId, chapterTitle, chapterPosition, updateMode) 
            if(chapterSlug == undefined) throw Error()
            
            // creating lessons
            let lessons = this.course.getLessonsByChapter(chapterSlug)
            for(let lessonId of Object.keys(lessons)) {
                let lessonQuiz = this.course.getLessonQuiz(chapterSlug, lessonId)

                let quizSlugs = []
                for(let quiz of Object.values(lessonQuiz)) {
                    let updateMode = false
                    if(quiz.question.getId() != "") updateMode = true
                    let quizSlug = await quiz.publish("course")
                    messageFunction({ error: false, message: "Carico quiz - " + quizSlug})
                    quizSlugs.push(quizSlug)
                }

                let lessonTitle = this.course.getLessonTitle(chapterSlug, lessonId)
                let lessonDescription = this.course.getLessonDescription(chapterSlug, lessonId)
                let lessonText = this.course.getLessonText(chapterSlug, lessonId)
                let lessonVideo = this.course.getLessonVideo(chapterSlug, lessonId)
                let lessonVideoId = this.course.getLessonVideoId(chapterSlug, lessonId)
                let lessonPosition = this.course.getLessonPosition(chapterSlug, lessonId)
                let isFree = this.course.getLesson(chapterSlug, lessonId)['isFree']

                let lessonSlug = await this.postLesson(chapterSlug, lessonId, lessonTitle, lessonDescription, lessonText, lessonVideo, lessonVideoId, lessonPosition, isFree, quizSlugs, updateMode)
                messageFunction({ error: false, message: "Carico lezione - " + lessonSlug})
                if(lessonSlug == undefined) throw Error()
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

    changeChapterOrder(chapterId, direction) {
        // getting all lessons
        let chapters = this.course.getContent()
        // adding "direction" to the chapter's position
        let chapter = chapters[chapterId]

        // changing current chapter position
        if(chapter['position'] + direction > 0 && chapter['position'] + direction <= Object.values(chapters).length) {
            // changing next chapters position
            for(let item of Object.values(chapters))
                if(item['position'] == chapter['position'] + direction && item) item['position'] -= direction

            chapter['position'] += direction
        }

        this.course.setContent(chapters)
    }

    changeLessonOrder(chapterId, sInd, dInd) {
        if(!isNaN(sInd) && !isNaN(dInd)) {
            let lessons = Object.values(this.course.getLessonsByChapter(chapterId)).sort((a,b) => a['position'] > b['position'] ? 1 : -1)
            // element moved
            const [reorderedItem] = lessons.splice(sInd - 1, 1)
            // insert moved element into the new position
            if(reorderedItem != undefined) lessons.splice(dInd - 1, 0, reorderedItem)
            // assigning position to each page
            lessons.forEach((lesson, i) => lesson['position'] = i + 1)
            this.updateInfo()
        }
    }

    checkContentValidity() {
        // wallpaper check 
        if(this.course.getWallpaper() == "") return { error : true, message : "Wallpaper non inserito"}
        // title check
        if(this.course.getTitle().replaceAll(" ", "") == "") return { error : true, message : "Titolo non inserito"}
        // description check
        if(this.course.getDescription().replaceAll(" ", "") == "") return { error : true, message : "Descrizione non inserita"}
        // video check
        if(this.course.getPresentationVideo() == "") return { error : true, message : "Video di presentazione non inserito"}
            // video check
        if(this.course.getPresentationVideoId() == "") return { error : true, message : "Id del video di presentazione non inserito"}
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
                // lesson video id
                if(this.course.getLessonVideoId(chapterId, lessonId) == "") return { error : true, message : "Id video di una lezione non inserito"}
                // quiz check
                let quizList = Object.values(this.course.getLessonQuiz(chapterId, lessonId))
                for(let quiz of quizList) {
                    if(quiz.question.getTitle().replaceAll(" ", "") == "")
                        return { error : true, message : "Alcuni quiz non hanno titolo"} 
                }
        }
       }
       return { error : false, message : "Tutto apposto" }
    }

}

export default CourseCreationController