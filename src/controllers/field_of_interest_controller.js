import TagController from "./tag_controller";
import $ from "jquery"
import { api_url } from "../App"

class FieldOfInterestController extends TagController {
  constructor() {
    super()
  }

  updateInfo() {
    if(this.state != undefined) {
      let newIntstance = new FieldOfInterestController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  
}

export default FieldOfInterestController