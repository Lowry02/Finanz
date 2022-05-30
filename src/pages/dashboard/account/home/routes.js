import AccademySection from "./sections/accademy_section"
import CoursesSection from "./sections/courses_section"
import InfoSection from "./sections/info_section"
import NewsSection from "./sections/news_section"
import Payments from "./sections/payments"
import QuestionSection from "./sections/question_section"
import SchoolSection from "./sections/school_section"
import TagField from "./sections/tag_field"
import WebinarSection from "./sections/webinar_section"
// import StatisticSection from "./sections/statistic"

const base_url = "/dashboard/account/"

let routes = {
  info: {
    path: base_url + "",
    url: "",
    component: (props) => <InfoSection {...props} />
  },
  payments: {
    path: base_url + "payments",
    url: "payments",
    component: (props) => <Payments {...props} />
  },
  news: {
    path: base_url + "news",
    url: "news",
    component: (props) => <NewsSection {...props} />
  },
  academy: {
    path: base_url + "academy",
    url: "academy",
    component: (props) => <AccademySection {...props} />
  },
  course: {
    path: base_url + "course",
    url: "course",
    component: (props) => <CoursesSection {...props} />
  },
  webinar: {
    path: base_url + "webinar",
    url: "webinar",
    component: (props) => <WebinarSection {...props} />
  },
  school: {
    path: base_url + "school",
    url: "school",
    component: (props) => <SchoolSection {...props} />
  },
  tag: {
    path: base_url + "tag",
    url: "tag",
    component: (props) => <TagField {...props} />
  },
  // statistic: {
  //   path: base_url + "statistics",
  //   url: "statistics",
  //   component: (props) => <StatisticSection {...props} />
  // },
  question: {
    path: base_url + "question",
    url: "question",
    component: (props) => <QuestionSection {...props} />
  },
  
}

export default routes