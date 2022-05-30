import StaticHome from "./pages/static_home"
import Dashbaord from "./pages/dashboard"
import LoginPage from "./pages/login"
import TestPage from "./pages/test"
import Home from "./pages/home"
import ActivationPage from "./pages/activation_page"
import RestorePassword from "./pages/login/restore_password"
import Policy from "./pages/policy"

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
    "activation_page" : {
        path : "/activate_user",
        url : "/activate_user/:code",
        component : (props) => <ActivationPage {...props} />
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
    "recover_password" : {
        path : "/recover_password/",
        url : "/recover_password/:code",
        component : (props) => <RestorePassword {...props} />
    },
    "policy" : {
        path : "/policy/",
        url : "/policy",
        component : (props) => <Policy {...props} />
    },
}


export default routes