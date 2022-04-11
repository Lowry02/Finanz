import UserController from "../controllers/user_controller"
import avatar from "../media/icons/avatar.jpeg"

let exampleUser = new UserController()
exampleUser.load({
    name: "Lorenzo",
    surname: "Cusin",
    birthday: "13/02/2002",
    email: "lorenzocusin02@gmail.com",
    username: "lorenzocusin",
    avatar: avatar,
    codice_invito: "CA323SL",
    xp: 500
})

export default exampleUser