import StaticHome from "./pages/static_home"
import Dashbaord from "./pages/dashboard"
import LoginPage from "./pages/login"
import TestPage from "./pages/test"

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
    }
}
export default routes