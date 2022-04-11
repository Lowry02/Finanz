import CourseModel from "../models/course"
import { courseExample } from "./course"

let course = new CourseModel()
course.load(courseExample)

let coursesBlockExample = {
    argument : "Argomento",
    description : "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley siamo. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley siamo. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley siamo.",
    courses_list : [course, course, course, course, course, course, course, course, course]
}

export { coursesBlockExample }