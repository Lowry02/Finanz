import CourseModel from "../models/course"
import QuestionCreationController from "./question_creation_controller"
import {courseExample} from "../test_data/course"
import QuestionController from "./question_controller"

class CourseController {
    constructor(course = new CourseModel(), state = undefined, overrideState = undefined) {
        this.course = course
        this.state = state
        this.overrideState = overrideState
    }

    setState(state) { this.state = state }
    
    setOverrideState(callback) { this.overrideState = callback }

    load(info, creationMode = true) {
        this.course.load(info)
        let content = JSON.parse(JSON.stringify(info['content']))

        if(content != undefined) {
            for(let chapterId in content) {
                for(let lessonId in this.getLessonsByChapter(chapterId)) {
                    for(let quizId in this.getLessonQuiz(chapterId, lessonId)) {
                        let quizObj = this.getSpecificQuiz(chapterId, lessonId, quizId)
                        let quizController
                        if(creationMode) { // da rivedere
                            quizController = new QuestionCreationController()
                            quizController.setOverrideState((() => this.updateInfo()).bind(this))
                            quizController.load({question: quizObj, correctChoices: undefined})
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
    }

    loadById(courseId, creationMode = true) {
        // DA IMPLEMENTARE
        let info = JSON.parse(JSON.stringify(courseExample))

        this.load(info, creationMode)
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

    addChapter() {
        let _content = this.course.getContent()
        let newId = "_0"
        while(Object.keys(_content).includes(newId)) newId = "_" + Math.random() * 10
        _content[newId] = {
            title: "Capitolo " + newId,
            lessons: {},
            position: Object.keys(_content).length + 1
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

    addLesson(chapterId) {
        let _chapterContent = this.getChapter(chapterId)
        let newId = "_0"
        while(Object.keys(_chapterContent['lessons']).includes(newId)) newId = "_" + Math.random() * 10
        _chapterContent['lessons'][newId] = {
            title: "Lezione " + newId,
            description: "",
            video: "",
            text: "",
            position: Object.keys(_chapterContent['lessons']).length + 1,
            quiz: {}
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
            title : this.getTitle(),
            argument : this.getArgument(),
            wallpaper : this.getWallpaper(),
            description : this.getDescription(),
            presentationVideo : this.getPresentationVideo(),
            professors : this.getProfessors(),
            offeredBy : this.getOfferedBy(),
            syllabus : this.getSyllabus(),
            publishDate : this.getPublishDate(),
            content : content,
            time : this.getTime(),
            star : this.getStar(),
        }
    }
    
}

export default CourseController