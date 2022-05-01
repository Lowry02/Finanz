import StaticHome from "./pages/static_home"
import Dashbaord from "./pages/dashboard"
import LoginPage from "./pages/login"
import TestPage from "./pages/test"
import Home from "./pages/home"

let routes = {
    "home" : {
        path : "/",
        url : "/",
        component : (props) => <StaticHome {...props} />
    },
    "dashboard" : {
        path : "/dashboard",
        url : "/dashboard/*",
        component : (props) => <Dashbaord {...props} />
    },
    "login" : {
        path : "/login",
        url : "/login/*",
        component : (props) => <LoginPage {...props} />
    },
    "test" : {
        path : "/test",
        url : "/test/*",
        component : (props) => <TestPage {...props} />
    },
    "homepage" : {
        path : "/home/",
        url : "/home/*",
        component : (props) => <Home {...props} />
    },
}
export default routes