// ----- dashboard routes -----

import news_icon from "../../media/icons/news.png"
import accademy_icon from "../../media/icons/accademy.png"
import course_icon from "../../media/icons/course.png"
import home_icon from "../../media/icons/home.png"
import webinar_icon from "../../media/icons/webinar.png"
import books_icon from "../../media/icons/book.png"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import OndemandVideoRoundedIcon from '@mui/icons-material/OndemandVideoRounded';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import HomePage from "./home"
import NewsPage from "./news"
import AccademyPage from "./accademy"
import CoursesPage from "./courses"
import WebinarPage from "./webinar"
import BooksPage from "./books"
import AccountPage from "./account"
import SingleNews from "./single_news"
import SingleCourse from "./single_course"
import SingleModule from "./single_module"
import SingleWebinar from "./single_webinar"
import ErrorPage from "../404"

const _base_url = "/dashboard"

let routes = {
    home : {
        path : _base_url,
        url : "",
        title : "Home",
        component : (props) => <HomePage {...props}/>,
        icon : <HomeRoundedIcon className="orange_icon"/>
    },
    news : {
        path : _base_url + "/news",
        url :  "/news",
        title : "News",
        component : (props) => <NewsPage {...props}/> ,
        icon : <NewspaperRoundedIcon className="orange_icon"/>
    },
    accademy : {
        path : _base_url + "/academy",
        url : "/academy",
        title : "Academy",
        component : (props) => <AccademyPage {...props}/>,
        icon : <FilePresentRoundedIcon className="orange_icon"/>

    },
    courses : {
        path : _base_url + "/courses",
        url : "/courses",
        title : "Corsi",
        component : (props) => <CoursesPage {...props}/>,
        icon : <OndemandVideoRoundedIcon className="orange_icon"/>
    },
    webinar : {
        path : _base_url + "/webinar",
        url : "/webinar/*",
        title : "Webinar",
        component : (props) => <WebinarPage {...props}/>,
        icon : <VideoCallRoundedIcon className="orange_icon"/>
    },
    books : {
        path : _base_url + "/books",
        url : "/books/*",
        title : "Libri",
        component : (props) => <BooksPage {...props}/>,
        icon: <MenuBookRoundedIcon className="orange_icon"/>
    },
    account : {
        path : _base_url + "/account",
        url : "/account/*",
        title : "Account",
        component : (props) => <AccountPage {...props}/>,
    },
    single_news : {
        path : _base_url + "/news/",
        url : "/news/:id",
        title : "News",
        component : (props) => <SingleNews {...props}/>,
    },
    single_course : {
        path : _base_url + "/courses/",
        url : "/courses/*",
        title : "Corso",
        component : (props) => <SingleCourse {...props}/>,
    },
    single_module : {
        path : _base_url + "/academy/",
        url : "/academy/*",
        title : "Corso",
        component : (props) => <SingleModule {...props}/>,
    },
    single_webinar : {
        path : _base_url + "/single_webinar/",
        url : "/single_webinar/:webinar_id",
        title : "Webinar",
        component : (props) => <SingleWebinar {...props}/>,
    },
}

export default routes