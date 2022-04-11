import routes from "../routes"
import PageLayout from "./page_layout"
import SingleChapter from "./single_chapter"
import SingleLesson from "./single_lesson"

// const _base_url = routes.single_course.path
const _base_url = "/dashboard/single_course/"

let course_routes = {
    home : {
        path : _base_url,
        url : ":courseId",
        component : (props) => <PageLayout {...props}/>,
    },
    chapter: {
        path : undefined,
        url : ":courseId/:chapterId",
        component : (props) => <SingleChapter {...props}/>,
    },
    lesson: {
        path : undefined,
        url : ":courseId/:chapterId/:lessonId",
        component : (props) => <SingleLesson {...props}/>,
    }
}

export default course_routes