import CourseModel from "../models/course"
import QuestionCreationController from "./question_creation_controller"
import {courseExample} from "../test_data/course"
import QuestionController from "./question_controller"
import $ from "jquery"
import {api_url} from "../App"

class CourseController {
    constructor(course = new CourseModel(), state = undefined, overrideState = undefined) {
        this.course = course
        this.state = state
        this.overrideState = overrideState
    }

    setState(state) { this.state = state }
    
    setOverrideState(callback) { this.overrideState = callback }

    load(info, creationMode = true) {
        let content = JSON.parse(JSON.stringify(info['content']))
        this.course.load(info)

        content = info['content']

        if(content != undefined) {
            for(let chapterId in content) {
                for(let lessonId in this.getLessonsByChapter(chapterId)) {
                    for(let quizId in this.getLessonQuiz(chapterId, lessonId)) {
                        let quizObj = this.getSpecificQuiz(chapterId, lessonId, quizId)
                        if(quizObj['question'] != undefined) quizObj = quizObj['question']
                        let quizController
                        if(creationMode) {
                            quizController = new QuestionCreationController()
                            quizController.setOverrideState((() => this.updateInfo()).bind(this))
                            quizController.question.setId(quizObj['question']['id'])
                            quizController.question.setTitle(quizObj['question']['title'])
                            quizController.question.setImage(quizObj['question']['image'])
                            
                            for(let answerId of Object.keys(quizObj['question']['choices'])) {
                                quizController.question.addChoice(quizObj['question']['choices'][answerId], answerId)
                            }

                            quizController.question.setSelectedChoices(quizObj['selectedChoices'])
                        } else {
                            quizController = new QuestionController()
                            quizController.setOverrideUpdateInfo((() => this.updateInfo()).bind(this))
                            quizController.load({...quizObj.question})
                        }
                        content[chapterId]['lessons'][lessonId]['quiz'][quizId] = quizController
                    }
                }
            }
        }

        this.setContent(content)
        this.updateInfo()
    }

    async loadById(courseId, creationMode = true) {
        // getting general info
        let info = await this.getGeneralInfo(courseId)
        if(info == undefined) throw Error()

        // setting general info 
        let course = info['course']
        let chapters = info['chapters']

        let argument = {
            id: course['argument']['slug'],
            title: course['argument']['title'],
            description: course['argument']['description'],
        }

        this.setArgument(argument)
        this.setId(course['slug'])
        this.setWallpaper(course['coverImageLink'])
        this.setTitle(course['title'])
        this.setDescription(course['description'])
        this.setPresentationVideo(course['trailerIframe'])
        this.setPresentationVideoId(course['trailerId'])
        // setting authors account
        for(let author of course['authors']) {
            let username = author['username']
            this.getOfferedBy().push(username)
            this.updateInfo()
        }

        // setting chapters
        for(let chapter of chapters) {
            this.addChapter(chapter)

            // getting lessons per chapter
            let lessons = Object.values(chapter['lessons'])

            for(let lesson of lessons) {
                let lessonSlug = lesson['slug']
                let lessonInfo = await this.getLessonFromServer(lessonSlug)

                this.addLesson(chapter['slug'], lessonInfo)
            } 
        }
    }
    
    // get course title, description, chapters and argument
    async getGeneralInfo(courseId) {
        let accessToken = window.localStorage.getItem('accessToken')
        let info = undefined

        await $.ajax({
            type: "GET",
            url: api_url + "course/" + courseId,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => info = data
        })

        return info
    }

    async getLessonFromServer(lessonId) {
        let accessToken = window.localStorage.getItem('accessToken')
        let info = undefined

        await $.ajax({
            type: "GET",
            url: api_url + "course/lesson/" + lessonId,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => info = data['lesson']
        })

        return info
    }
    
    updateInfo() {
        if(this.state != undefined)
            this.state(new CourseController(this.course, this.state, this.overrideState))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    // Setter
    setId(id, _auto_save = true) {
        this.course.setId(id)
        if(_auto_save) this.updateInfo()
    }
    setTitle(title, _auto_save = true) {
        this.course.setTitle(title)
        if(_auto_save) this.updateInfo()
    }
    setArgument(argument, _auto_save = true) {
        this.course.setArgument(argument)
        if(_auto_save) this.updateInfo()
    }
    setPresentationVideo(presentationVideo, _auto_save = true) {
        this.course.setPresentationVideo(presentationVideo)
        if(_auto_save) this.updateInfo()
    }
    setPresentationVideoId(presentationVideoId, _auto_save = true) {
        this.course.setPresentationVideoId(presentationVideoId)
        if(_auto_save) this.updateInfo()
    }
    setProfessors(professors, _auto_save = true) {
        this.course.setProfessors(professors)
        if(_auto_save) this.updateInfo()
    }
    setSyllabus(syllabus, _auto_save = true) {
        this.course.setSyllabus(syllabus)
        if(_auto_save) this.updateInfo()
    }
    setDescription(description, _auto_save = true) {
        this.course.setDescription(description)
        if(_auto_save) this.updateInfo()
    }
    setPublishDate(publishDate, _auto_save = true) {
        this.course.setPublishDate(publishDate)
        if(_auto_save) this.updateInfo()
    }
    setContent(content, _auto_save = true) {
        this.course.setContent(content)
        if(_auto_save) this.updateInfo()
    }
    setTime(time, _auto_save = true) {
        this.course.setTime(time)
        if(_auto_save) this.updateInfo()
    }
    setStar(star, _auto_save = true) {
        this.course.setStar(star)
        if(_auto_save) this.updateInfo()
    }
    setWallpaper(wallpaper, _auto_save = true) {
        this.course.setWallpaper(wallpaper)
        if(_auto_save) this.updateInfo()
    }
    setOfferedBy(offeredBy, _auto_save = true) {
        this.course.setOfferedBy(offeredBy)
        if(_auto_save) this.updateInfo()
    }
    setAuthor(author, _auto_save = true) {
        this.course.setAuthor(author)
        if(_auto_save) this.updateInfo()
    }
    setNVideo(n_video, _auto_save = true) {
        this.course.setNvideo(n_video)
        if(_auto_save) this.updateInfo()
    }

    setComments(comments, _auto_save = true) {
        this.course.setComments(comments)
        if(_auto_save) this.updateInfo()
    } 
    
    // Getter
    getTitle() { return this.course.getTitle() }
    getArgument() { return this.course.getArgument() }
    getPresentationVideo() { return this.course.getPresentationVideo() }
    getPresentationVideoId() { return this.course.getPresentationVideoId() }
    getProfessors() { return this.course.getProfessors() }
    getSyllabus() { return this.course.getSyllabus() }
    getDescription() { return this.course.getDescription() }
    getPublishDate() { return this.course.getPublishDate() }
    getContent() { return this.course.getContent() }
    getTime() { return this.course.getTime() }
    getStar() { return this.course.getStar() }
    getWallpaper() { return this.course.getWallpaper() }
    getOfferedBy() { return this.course.getOfferedBy() }
    getAuthor() { return this.course.getAuthor() }
    getNVideo() { return this.course.getNVideo() }
    getId() { return this.course.getId() }
    getComments() { return this.course.getCommentts() }

    addChapter(info = undefined) {
        let _content = this.course.getContent()
        
        // generating random id
        let newId = "_0"
        while(Object.keys(_content).includes(newId)) newId = "_" + Math.random() * 10
        let title = "Capitolo " + newId
        let lessons = {}
        let position = Object.keys(_content).length + 1

        if(info != undefined) {
            newId = info['slug']
            title = info['title']
            position = info['order']
        }

        _content[newId] = {
            id: newId,
            title: title,
            lessons: lessons,
            position: position
        }
        
        this.setContent(_content)
    }

    getChapter(id) {
        return this.getContent()[id]
    }

    getChapterTitle(chapterId) {
        if(this.getChapter(chapterId) != undefined)
            return this.getChapter(chapterId)['title']
        else return ""
    }

    setChapterTitle(chapterId, title) {
        let _chapterContent = this.getChapter(chapterId)
        _chapterContent['title'] = title
        let _content = this.getContent()
        _content[chapterId] = _chapterContent
        this.setContent(_content)
    }

    getLessonsByChapter(chapterId) {
        if(this.getChapter(chapterId) != undefined)
            return this.getChapter(chapterId)['lessons']
        else return {}
    }

    addLesson(chapterId, info = undefined) {
        let _chapterContent = this.getChapter(chapterId)
        let newId = "_0"
        while(Object.keys(_chapterContent['lessons']).includes(newId)) newId = "_" + Math.random() * 10
        let title = "Lezione " + newId
        let description = ""
        let video = ""
        let videoId = ""
        let text = ""
        let position = Object.keys(_chapterContent['lessons']).length + 1
        let quiz = {}
        let isFree = true

        if(info != undefined) {
            newId = info['slug']
            title = info['title']
            description = info['description']
            video = info['videoIframe']
            videoId = info['videoId']
            text = info['text']
            position = info['order']
            isFree = info['isFree']
            // creating quiz object
            for(let quizItem of info['quiz']) {
                let newQuiz = new QuestionCreationController()
                newQuiz.setOverrideState((() => this.updateInfo()).bind(this))
                newQuiz.question.setId(quizItem['slug'])
                newQuiz.question.setTitle(quizItem['question'])
                let answers = quizItem['answers']
                // setting answers
                for(let answer of answers) {
                    newQuiz.question.addChoice({
                        title: answer['answer'],
                        description: answer['description']
                    }, answer['slug'])
                    if(answer['isCorrect'] != undefined && answer['isCorrect']) {
                        newQuiz.question.addSelectedChoice(answer['slug'])
                    }
                }
                quiz[quizItem['slug']] = newQuiz
            }
        }

        _chapterContent['lessons'][newId] = {
            id: newId,
            title: title,
            description: description,
            video: video,
            videoId: videoId,
            text: text,
            position: position,
            quiz: quiz,
            isFree: isFree
        }
        let _content = this.getContent()
        _content[chapterId] = _chapterContent
        this.setContent(_content)
    }

    removeLesson(chapterId, lessonId) {
        let lessons = this.getLessonsByChapter(chapterId)
        delete lessons[lessonId]
        this.setLessons(chapterId, lessons)
    }

    removeChapter(chapterId) {
        let _chapters = this.getContent()
        delete _chapters[chapterId]
        this.setContent(_chapters)
    }

    setLesson(chapterId, lessonId, lesson) {
        let lessons = this.getLessonsByChapter(chapterId)
        lessons[lessonId] = lesson
        this.setLessons(chapterId, lessons)
    }
    
    setLessons(chapterId, lessons) {
        let chapter = this.getChapter(chapterId)
        chapter['lessons'] = lessons
        let content = this.getContent()
        content[chapterId] = chapter
        this.setContent(content)
    }

    getLesson(chapterId, lessonId) {
        if(this.getLessonsByChapter(chapterId) != undefined)
            return this.getLessonsByChapter(chapterId)[lessonId]
        else return {}
    }

    getLessonTitle(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['title']
        else return ""
    }

    getLessonDescription(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['description']
        else return ""
    }

    getLessonVideo(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['video']
        else return ""
    }

    getLessonVideoId(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['videoId']
        else return ""
    }

    getLessonText(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['text']
        else return ""
    }

    getLessonPosition(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['position']
        else return ""
    }

    getLessonQuiz(chapterId, lessonId) {
        if(this.getLesson(chapterId, lessonId) != undefined)
            return this.getLesson(chapterId, lessonId)['quiz']
        else return ""
    }

    getSpecificQuiz(chapterId, lessonId, quizId) {
        if(this.getLessonQuiz(chapterId, lessonId) != undefined)
            return this.getLessonQuiz(chapterId, lessonId)[quizId]
        else return ""
    }

    setLessonContent(chapterId, lessonId, key, value) {
        let chapter = this.getChapter(chapterId)
        let chapterLessons = this.getLessonsByChapter(chapterId)
        let lesson = this.getLesson(chapterId, lessonId)
        let content = this.getContent()
        lesson[key] = value
        chapterLessons[lessonId] = lesson
        chapter['lessons'] = chapterLessons
        content[chapterId] = chapter
        this.setContent(content)
    }
    
    setLessonTitle(chapterId, lessonId, title) {
        this.setLessonContent(chapterId, lessonId, 'title', title)
    }

    setLessonDescription(chapterId, lessonId, description) {
        this.setLessonContent(chapterId, lessonId, 'description', description)
    }

    setLessonVideo(chapterId, lessonId, video) {
        this.setLessonContent(chapterId, lessonId, 'video', video)
    }

    setLessonVideoId(chapterId, lessonId, videoId) {
        this.setLessonContent(chapterId, lessonId, 'videoId', videoId)
    }

    setLessonText(chapterId, lessonId, text) {
        this.setLessonContent(chapterId, lessonId, 'text', text)
    }
  
    setQuiz(chapterId, lessonId, quiz) {        // OBJECT OF QUIZ
        let lesson = this.getLesson(chapterId, lessonId)
        lesson['quiz'] = quiz
        this.setLesson(chapterId, lessonId, lesson)
    }
    
    getQuiz(chapterId, lessonId) {
        return this.getLesson(chapterId, lessonId)['quiz']
    }

    addQuiz(chapterId, lessonId, quizContent = undefined) {
        let newQuiz = new QuestionCreationController()
        newQuiz.setOverrideState((() => this.updateInfo()).bind(this))
        if(quizContent == undefined)
            newQuiz.load({question: {title: "Nuova domanda", acceptedChoices : undefined}})
        else
            newQuiz.load({question: quizContent})
        let chapter = this.getChapter(chapterId)
        let chapterLessons = this.getLessonsByChapter(chapterId)
        let lesson = this.getLesson(chapterId, lessonId)
        let content = this.getContent()
        let id = Object.keys(lesson['quiz']).length + 1
        lesson['quiz'][id] = newQuiz 
        chapterLessons[lessonId] = lesson
        chapter['lessons'] = chapterLessons
        content[chapterId] = chapter
        this.setContent(content)
    }

    removeQuiz(chapterId, lessonId, quizId) {
        let quiz = this.getQuiz(chapterId, lessonId)
        delete quiz[quizId]
        this.setQuiz(chapterId, lessonId, quiz)
    }


    getQuizById(chapterId, lessonId, quizId) {
        return this.getQuiz(chapterId, lessonId)[quizId]
    }

    loadComments(n = 10) {
        let genericComment = {
            title : "Titolo bello",
            content : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum"
        }
        let list = []
        for(let i = 0; i < n; i++) list.push(genericComment)
        this.setComments(list)
    }

    exportInfo() {
        let content = JSON.parse(JSON.stringify(this.getContent()))

        return {
            id: this.getId(),
            title : this.getTitle(),
            argument : this.getArgument(),
            wallpaper : this.getWallpaper(),
            description : this.getDescription(),
            presentationVideo : this.getPresentationVideo(),
            presentationVideoId : this.getPresentationVideoId(),
            professors : this.getProfessors(),
            offeredBy : this.getOfferedBy(),
            syllabus : this.getSyllabus(),
            publishDate : this.getPublishDate(),
            content : content,
            time : this.getTime(),
            star : this.getStar(),
            author : this.getAuthor(),
            n_video : this.getNVideo(),
            comments : this.getComments(),
        }
    }
    
}

export default CourseController