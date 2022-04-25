import WebinarController from "./webinar";
import { api_url } from "../App"
import $ from "jquery"
import { urlToFile } from "../utils";

class CreateWebinarController {
  constructor(webinar = new WebinarController(), state = undefined, overrideState = undefined) {
    this.webinar = webinar
    this.webinar.setOverrideState((() => this.updateInfo()).bind(this))
    this.state = state
    this.overrideState = overrideState
  }

  setState(state) {
    this.state = state
  }

  setOverrideState(overrideState) {
    this.overrideState = overrideState
  }

  updateInfo() {
    if(this.state != undefined) {
      this.state(new CreateWebinarController(this.webinar, this.state, this.overrideState))
    } else if(this.overrideState != undefined) {
      this.overrideState()
    }
  }

  async publish() {
    let accessToken = window.localStorage.getItem('accessToken')

    let requestType = ""
    let requestLink = ""

    if(this.webinar.getId() != "") {
      // update mode
      requestType = "PUT"
      requestLink = "webinar/" + this.webinar.getId()
    } else {
      // creation mode
      requestType = "POST"
      requestLink = "webinars"
    }
    
    let formData = new FormData()
    if(this.webinar.getWallpaper().slice(0, 5) == "https") {
      formData.append('picture', this.webinar.getWallpaper())
    } else {
      formData.append('picture', urlToFile(this.webinar.getWallpaper()))
    }

    formData.append('title', this.webinar.getTitle())
    formData.append('description', this.webinar.getDescription())
    formData.append('society', this.webinar.getSociety())
    formData.append('societyLink', this.webinar.getSocietyLink())
    formData.append('guest', this.webinar.getGuest())
    formData.append('guestLink', this.webinar.getGuestLink())
    formData.append('liveDatetime', this.webinar.getDate())
    formData.append('isFree', this.webinar.getIsFree())
    formData.append('eventId', this.webinar.getEventId())
    formData.append('eventVideoIframe', this.webinar.getEventVideoIframe())
    formData.append('eventChatIframe', this.webinar.getEventChatIframe())
    formData.append('finalVideoIframe', this.webinar.getFinalVideoIframe())
    formData.append('finalVideoId', this.webinar.getFinalVideoId())
    
    await $.ajax({
        type: requestType,
        url: api_url + requestLink,
        contentType: false,
        accepts: false,
        processData: false,
        beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
        data: formData,
        success: (data) => this.webinar.setId(data['slug']),
    })
  }
}

export default CreateWebinarController