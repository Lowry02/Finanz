import CommentController from "../controllers/comment_controller"
import draghiImage from "../media/img/draghi.jpeg"

let comment = new CommentController()
comment.load({
    id : "CA532",
    title : "Come fai a fare cose così interessanti",
    author : "Pino Daniele",
    data : "21/01/2021",
    content : "Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione."
})

let exampleNews = {
    id : "CA534",
    title : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    publishDate : "3 ore fa",
    author : "Gino Pauli",
    content : "# asdasdsadsa",
    wallpaper : draghiImage,
    category: "Economia",
    comments: [comment, comment]
}

let exampleCategories = {
    1 : "Economia",
    2 : "Finanza",
    3 : "Martketing",
    4 : "Dal Mondo",
    5 : "Italia",
    6 : "Economia",
    7 : "Finanza",
    8 : "Martketing",
    9 : "Dal Mondo",
    10 : "Italia",
}

export {exampleNews, exampleCategories}