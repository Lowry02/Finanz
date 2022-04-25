import NewsCreation from "./news_creation"
import CourseCreation from "./course_creation"
import ModuleCreation from "./module_creation"
import AccountHome from "./home"
import WebinarCreation from "./webinar_creation"
import SchoolCreation from "./school_creation"

const _base_url = "/dashboard/account"

let routes = {
    home: {
        path: _base_url,
        url: '',
        component: (props) => <AccountHome {...props} />
    },
    course_creation: {
        path: _base_url + '/create_course',
        url: '/create_course',
        component: (props) => <CourseCreation {...props} />
    },
    module_creation: {
        path: _base_url + '/create_module',
        url: '/create_module',
        component: (props) => <ModuleCreation {...props} />
    },
    news_creation: {
        path: _base_url + '/create_news',
        url: '/create_news',
        component: (props) => <NewsCreation {...props} />
    },
    webinar_creation: {
        path: _base_url + '/webinar_creation',
        url: '/webinar_creation',
        component: (props) => <WebinarCreation {...props} />
    },
    school_creation: {
        path: _base_url + '/school_creation',
        url: '/school_creation',
        component: (props) => <SchoolCreation {...props} />
    }
}

export default routes