import Lesson from "./lesson"
import PageLayout from "./page_layout"

const base_url = "/dashboard/academy/"

let routes = {
    home: {
        path: "",
        url: ":moduleId",
        component: (props) => <PageLayout {...props}/>,
    },
    lesson: {
        path: "",
        url: ":moduleId/:lessonId",
        component: (props) => <Lesson {...props}/>,
    },
}

export default routes