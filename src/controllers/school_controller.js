import School from "../models/school";

class SchoolController extends School {
  constructor() {
    super()
    this.state = undefined
    this.overrideState = undefined
  }

  setState(state) {
    this.state = state
  }

  setOverrideState(overrideState) {
    this.overrideState = overrideState
  }
  
  updateInfo() {
    if(this.state != undefined) {
      let newIntstance = new SchoolController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  // getter
  getId() { return this.id }
  getName() { return this.name }
  getCode() { return this.code }
  getQuizNumber() { return this.quizNumber }

  // setter 
  setId(id, auto_save = true) {
    this.id = id
    if(auto_save) this.updateInfo()
  }
  
  setName(name, auto_save = true) {
    this.name = name
    if(auto_save) this.updateInfo()
  }

  setCode(code, auto_save = true) {
    this.code = code
    if(auto_save) this.updateInfo()
  }

  setQuizNumber(quizNumber, auto_save = true) {
    this.quizNumber = quizNumber
    if(auto_save) this.updateInfo()
  }

  loadById(schoolId) {
    console.log(schoolId)
  }

  exportInfo() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      quizNumber: this.quizNumber
    }
  }
}

export default SchoolController