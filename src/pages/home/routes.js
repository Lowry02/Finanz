import Home from "./home"
import AboutUs from "./aboutus"

const base_url = "/home"

let routes = {
  "home" : {
    path : base_url,
    url : "/",
    component : (props) => <Home {...props} />
  },
  "aboutus" : {
    path : base_url + "/aboutus",
    url : "/aboutus",
    component : (props) => <AboutUs {...props} />
  },
}

export default routes