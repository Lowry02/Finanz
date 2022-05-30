import { courseExample } from "../test_data/course"
import CourseController from "./course_controller"
import $ from "jquery"
import { api_url } from "../App"

class CoursesListController {
    constructor(allCourses = {}, savedCourses = {}, coursesInProgress = {}, createdCourses = {}, coursePerCategory = {}, categories = {}, state = undefined, overrideState= undefined) {
        this.allCourses = allCourses
        this.savedCourses = savedCourses
        this.coursesInProgress = coursesInProgress
        this.createdCourses = createdCourses
        this.coursesPerCategory = coursePerCategory
        this.categories = categories
        this.state = state
        this.overrideState = overrideState
        this.ALL_COURSES_TAG = "all"
        this.SAVED_COURSES_TAG = "saved"
        this.IN_PROGRESS_COURSE = "in_progress"
        this.CREATED_COURSES = "created"
    }

    setState(state) {
        this.state = state
    }

    setOverrideState(overrideState) {
        this.overrideState = overrideState
    }

    load({allCourses, savedCourses, coursesInProgress, createdCourses, coursesPerCategory, categories, state, overrideState}) {
        this.allCourses = allCourses
        this.savedCourses = savedCourses
        this.coursesInProgress = coursesInProgress
        this.createdCourses = createdCourses
        this.coursesPerCategory = coursesPerCategory
        this.state = state
        this.overrideState = overrideState
        this.categories = categories
    }

    updateInfo() {
        if(this.state != undefined)
            this.state(new CoursesListController(
                this.allCourses,
                this.savedCourses,
                this.coursesInProgress,
                this.createdCourses,
                this.coursesPerCategory,
                this.categories,
                this.state,
                this.overrideState
            ))
        else if(this.overrideState != undefined)
            this.overrideState()
    }

    getAllCourses() { return this.allCourses }

    getSavedCourses() { return this.savedCourses }

    getCoursesInProgress() { return this.coursesInProgress }

    getCreatedCourse() { return this.createdCourses }

    getCoursesPerCategory() { return this.coursesPerCategory }

    getCategories() { return this.categories }

    setAllCourses(allCourses) {
        this.allCourses = {...this.allCourses, ...allCourses}
        this.updateInfo()
    }

    setSavedCourses(savedCourses) {
        this.savedCourses = {...this.savedCourses, ...savedCourses}
        this.updateInfo()
    }

    setCoursesInProgress(coursesInProgress) {
        this.coursesInProgress = {...this.coursesInProgress, ...coursesInProgress}
        this.updateInfo()
    }

    setCreatedCourses(createdCourses) {
        this.createdCourses = {...this.createdCourses, ...createdCourses}
        this.updateInfo()
    }

    setCoursesPerCategory(coursePerCategory) {
        this.coursesPerCategory = coursePerCategory
        this.updateInfo()
    }

    setCategories(categories) {
        this.categories = categories
        this.updateInfo()
    }

    __getCoursesList(obj, l) {
        let list = {}
        let length = Object.keys(obj).length
        for(let i = length; i < length + l; i++) {
            let newCourse = new CourseController()
            newCourse.setOverrideState((() => this.updateInfo()).bind(this))
            // newCourse.load(courseExample)
            newCourse.setId(i)
            list[i] = newCourse
        }
        return list
    }

    loadAllCourses(n = 10) {
        let accessToken = window.localStorage.getItem('accessToken')
        
        return $.ajax({
            type: "GET",
            url: api_url + "courses",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let courses = data['courses']
                this.coursesPerCategory = {}

                for(let course of courses) {
                    let slug = course['slug']
                    let courseArg = course['argument']['slug']
                    let wallpaper = course['coverImageLink']
                    let title = course['title']
                    let description = course['description']

                    let newCourse = new CourseController()
                    newCourse.setId(slug)
                    newCourse.setArgument(courseArg)
                    newCourse.setWallpaper(wallpaper)
                    newCourse.setTitle(title)
                    newCourse.setDescription(description)

                    // list[slug] = newCourse

                    if(this.coursesPerCategory[courseArg] != undefined) {
                        this.coursesPerCategory[courseArg].push(newCourse)
                    } else {
                        this.coursesPerCategory[courseArg] = [newCourse]
                    }
                }

                this.updateInfo()
            }
        })
    }
    
    loadSavedCourses(n = 10) {
        let list = this.__getCoursesList(this.savedCourses, n)
        this.setSavedCourses(list)
    }

    loadCoursesInProgress(n = 10) {
        let list = this.__getCoursesList(this.coursesInProgress, n)
        this.setCoursesInProgress(list)
    }

    loadCreatedCourses(n = 10) {
        // let list = this.__getCoursesList(this.createdCourses, n)
        // this.setCreatedCourses(list)
        let accessToken = window.localStorage.getItem('accessToken')

        $.ajax({
            type: "GET",
            url: api_url + "courses",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success:(data) => {
                let _list = data['courses']
                let list = {}

                for(let item of _list) {
                    let newCourse = new CourseController()
                    newCourse.setOverrideState((() => this.updateInfo()).bind(this))
                    newCourse.setTitle(item['title'])
                    newCourse.setId(item['slug'])
                    list[item['slug']] = newCourse
                }

                this.setCreatedCourses(list)
            }
        })
    }

    loadCoursesPerCategory(n = 10, category) {
        let list = Object.values(this.__getCoursesList({}, n))
        let prev_list = this.coursesPerCategory[category] ? Object.values(this.coursesPerCategory[category]) : []
        list = [...prev_list, list]
        this.coursesPerCategory[category] = list
        this.updateInfo()
    }

    loadCategories() {
        let accessToken = window.localStorage.getItem('accessToken')
        
        return $.ajax({
            type: "GET",
            url: api_url + "course/arguments",
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            success: (data) => {
                let args = data['arguments']

                let list = {}
                for(let arg of args) {
                    let slug = arg['slug']
                    let title = arg['title']

                    list[slug] = title
                }

                this.setCategories(list)
            },
        })
    }

    async removeCourse(courseId, tag) {
        if(tag == this.CREATED_COURSES) {
            delete this.allCourses[courseId]
            delete this.savedCourses[courseId]
            delete this.coursesInProgress[courseId]
            delete this.createdCourses[courseId]
        }
        else if(tag == this.ALL_COURSES_TAG)
            delete this.allCourses[courseId]
        else if(tag == this.SAVED_COURSES_TAG)
            delete this.savedCourses[courseId]
        else if(tag == this.IN_PROGRESS_COURSE)
            delete this.coursesInProgress[courseId]

        let accessToken = window.localStorage.getItem('accessToken')
        
        $.ajax({
            type: "DELETE",
            url: api_url + "course/" + courseId,
            accepts: "application/json",
            contentType: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        })

        this.updateInfo()
    }
}

export default CoursesListController