import draghiImage from "../media/img/draghi.jpeg"
import exampleMP4 from "../media/video/example.mp4"

let genericQuiz = {
    question: {
        id: "C92",
        title: "Ciao amico come stai?",
        choices: {
            1: "Tutto bene",
            2: "Molto bene",
            3: "Bene grazie"
        },
        acceptedChoices: 1
    }
}

let genericLesson = {
    title : "Titolo della lezione molto accattivante",
    description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    video: exampleMP4,
    text : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries. <br /> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    quiz : {
        1: genericQuiz,
        2: genericQuiz,
        3: genericQuiz,
    } // manage export
}

let courseExample = {
    id : "C99DF",
    title : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    publishDate : "3 ore fa",
    author : "Gino Pauli",
    content : {
        1 : {
            title: "Prima lezione del primo corso, Finanz e le sue strategie",
            lessons: {
                1 : genericLesson,
                2 : genericLesson,
                3 : genericLesson,
                4 : genericLesson,
            },
        },
        2 : {
            title: "Seconda lezione del primo corso, Finanz e i suoi collaboratori",
            lessons: {
                1 : genericLesson,
                2 : genericLesson,
                3 : genericLesson,
                4 : genericLesson,
            },
        },
        3 : {
            title: "Seconda lezione del primo corso, Finanz come nasce e con chi nasce",
            lessons: {
                1 : genericLesson,
                2 : genericLesson,
                3 : genericLesson,
                4 : genericLesson,
            },
        },
        4 : {
            title: "Seconda lezione del primo corso, Finanz e gli obbiettivi che la rendono unica",
            lessons: {
                1 : genericLesson,
                2 : genericLesson,
                3 : genericLesson,
                4 : genericLesson,
            },
        },
    },
    time : "15 ore",
    n_video : "5",
    star : 3,
    wallpaper : draghiImage,
    presentationVideo: exampleMP4,
    syllabus : "Anche se tutto quello che vedi è piuttosto caotico, la parte positiva è che devi solo copiarlo da YouTube, e incollarlo nel tuo sito, e avrai il tuo video. Anche se ultimamente YouTube fornisce un semplice iFrame per la condivisione.    Si noti che gli script di embed su Youtube non sono validi per XHML. Per generare codici validi per i video su youtube XHML consiglio questo strumento che genera validi XHTML YouTube embed code per i video. Basta inserire l'URL dove hai trovato il video e otterrai un codice XHTML valido per te.",
    argument : "Economia",
}

export {courseExample}