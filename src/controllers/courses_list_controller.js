import { courseExample } from "../test_data/course"
import CourseController from "./course_controller"

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
            newCourse.load(courseExample)
            newCourse.setId(i)
            list[i] = newCourse
        }
        return list
    }

    loadAllCourses(n = 10) {
        let list = this.__getCoursesList(this.allCourses, n)
        this.setAllCourses(list)
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
        let list = this.__getCoursesList(this.createdCourses, n)
        this.setCreatedCourses(list)
    }

    loadCoursesPerCategory(n = 10, category) {
        let list = Object.values(this.__getCoursesList({}, n))
        let prev_list = this.coursesPerCategory[category] ? Object.values(this.coursesPerCategory[category]) : []
        list = [...prev_list, list]
        this.coursesPerCategory[category] = list
        this.updateInfo()
    }

    loadCategories() {
        let list = {
            1 : "Nuovi",
            2 : "I più visti",
            3 : "Finanza",
            4 : "Python",
            5 : "Da non perdere",
            6 : "Nuovi",
            7 : "I più visti",
            8 : "Finanza",
            9 : "Python",
            10 : "Da non perdere",
            11 : "Finanza",
            12 : "Python",
        }
        this.setCategories(list)
    }

    removeCourse(courseId, tag) {
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
        
        this.updateInfo()
    }
}

export default CoursesListController