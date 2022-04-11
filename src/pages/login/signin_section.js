import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import MultipleChoiceQuestion from '../../components/multiple_choice_question'
import ExperienceQuestion from '../../controllers/experience_question_controller'
import QuestionController from '../../controllers/question_controller'
import Popup from '../../components/popup'

function SigninSection(props) {
    let user = props.user
    let routes = props.routes
    let setIsSigninIn = props.setIsSigninIn

    let navigate = useNavigate()

    const [experienceQuestion, setExperienceQuestion] = useState(new ExperienceQuestion())
    const [languageQuestion, setLanguageQuestion] = useState(new QuestionController())
    const [meetingQuestion, setMeetingQuestion] = useState(new QuestionController())    // come ci avete conosciuti
    const [currentSection, setCurrentSection] = useState(0)
    const [showPopup, setShowPopup] = useState(false)
    const [status, setStatus] = useState({
        error: null,
        description: null
    })
    const [section, setSection] = useState([
        (props) => <NameSurnameBirthday {...props}/>,
        (props) => <EmailUsernamePassword {...props} />,
        // NOTE: experience question added in the useEffect
        // NOTE: insert code section added in the useEffect
    ])

    async function scrollQuestion(n) {
        if(0 <= currentSection + n < section.length) {
            if(n == 1) {
                if(!status.error) {

                    // signin and login
                    if(currentSection + n == section.length) {
                        let error
                        await user.signIn().then(() => error = {error: false, description: "Utente registrato"})
                                           .catch(() => error = {error: true, description: "Nome o email già esistenti"})
                        
                        // try to login
                        if(!error['error']) {
                            await user.areCredentialsCorrect(user.getUsername(), user.getPassword(), () => {})
                        }
                        
                        setStatus(error)
                        setShowPopup(true)   
                    }

                    // code check
                    if(currentSection + n == section.length) {
                        // if(!error['error']) {
                        //     setTimeout(() => navigate(routes.dashboard.path, {state: {user : user.exportInfo()}}), 1000)
                        // }
                    }
                    else setCurrentSection(currentSection + n)
                } else setShowPopup(true)
            } else setCurrentSection(currentSection + n)
        }
    }

    useEffect(() => {
        languageQuestion.setState(setLanguageQuestion)
        languageQuestion.load({
            id: null,
            title: "Seleziona una lingua",
            choices: {
                IT: "Italiano",
                EN: "Inglese",
            },
            acceptedChoices: 1
        })
        section.push((props) => <Language {...props} />)
        experienceQuestion.setState(setExperienceQuestion)
        experienceQuestion.load(() => {
            let i = 0
            for(let question of experienceQuestion.getQuestions()) {
                section.push((props) => <ExperienceQuestionLayout question={question} {...props} />)
                i++;
            }
            setSection(section)
        })
        meetingQuestion.setState(setMeetingQuestion)
        meetingQuestion.load({
            id: null,
            title: "COme hai conosciuto Nova?",
            choices: {
                1: "Instagram",
                2: "Eventi",
                3: "Passaparola",
                4: "Inserzioni",
                5: "Altro"
            },
            acceptedChoices: 1
        })
        section.push((props) => <MeetingQuestionSection {...props} />)
        // section.push((props) => <InvitationCodeLayout {...props} />)
        setSection(section)
    }, [])

    return (
        <div onKeyDown={(e) => e.key == "Enter" ? scrollQuestion(1) : null}>
            <h1>Benvenuto</h1>
            {   
                section[currentSection] !== undefined ? 
                section[currentSection]({user:user, setStatus:setStatus, languageQuestion:languageQuestion, meetingQuestion: meetingQuestion}) :  //DA SISTEMARE
                ""
            }
            <br />
            {
                currentSection > 0 ? 
                <button className="button bounce" onClick={() => scrollQuestion(-1)}>Indietro</button> :
                ""
            }
            <button className="button bounce" onClick={() => scrollQuestion(1)}>
                {
                    currentSection >= section.length - 1 ?
                    "Fine" : 
                    "Avanti"
                }
            </button>
            <p className="thin_orange" onClick={() => {
                    setIsSigninIn(false)
                    user.makeUserFieldEmpty()
                }}>Oppure accedi</p>
            {
                showPopup ?
                <Popup isError={status.error} message={status.description} removeFunction={() => setShowPopup(false)}/>:
                ""
            }
        </div>
    )
}

function NameSurnameBirthday(props) {
    let user = props.user
    let setStatus = props.setStatus
    const [birthdayInputType, setBirthdayInputType] = useState('text')

    useEffect(() => {
        if(user.getName() != "" && user.getSurname() != "" && user.getBirthday() != "") {
            if(user.isValidBirthday()) setStatus({error: false})
            else setStatus({
                error: true,
                description: "Data di nascita non valida"
            })
        }
        else setStatus({
            error: true,
            description: "Riempi tutti i campi"
        })
    }, [user.getName(), user.getSurname(), user.getBirthday()])

    return <>
        <p className="description">Iniziamo con qualche informazione su di te</p>
        <br />
        <input
        className="input"
        placeholder="Nome"
        autoFocus={true}
        value={user.getName()}
        onChange={(e) => user.setName(e.target.value)}
        />
        <br/>
        <input
        className="input"
        placeholder="Cognome"
        value={user.getSurname()}
        onChange={(e) => user.setSurname(e.target.value)}
        />
        <br/>
        <input
        className="input"
        type={birthdayInputType}
        onFocus={() => setBirthdayInputType('date')}
        onBlur={() => setBirthdayInputType('text')}
        placeholder="Data di nascita"
        value={user.getBirthday()}
        onChange={(e) => user.setBirthday(e.target.value)}
        />
        <br />
    </>
}

function EmailUsernamePassword(props) {
    let user = props.user
    const [passwordConfirm, setPasswordConfirm] = useState("")
    let setStatus = props.setStatus

    useEffect(() => {
        if(user.getEmail() != "" &&
           user.getUsername() != "" &&
           user.getPassword() != "" &&
           passwordConfirm != "") {
                if(user.isValidEmail()) {
                    if(user.isValidUsername()) {
                        if(user.getPassword() == passwordConfirm) {
                            setStatus({error: false})
                        } else {
                            setStatus({
                                error: true,
                                description: "Le password non coincidono"
                            })
                        }
                    } else {
                        setStatus({
                            error: true,
                            description: "Username gia esistente"
                        })
                    }
                } else {
                    setStatus({
                        error: true,
                        description: "Formato email non valido"
                    })
                }
                
           }
        else {
            setStatus( {
                error: true,
                description: "Riempi tutti i campi"
            })
        }
    }, [user.getEmail(), user.getUsername(), user.getPassword(), passwordConfirm])

    return <>
        <p className="description">Iniziamo con qualche informazione su di te</p>
        <br />
        <input
        className="input"
        placeholder="Email"
        autoFocus={true}
        value={user.getEmail()}
        onChange={(e) => user.setEmail(e.target.value)}
        />
        <br/>
        <input
        className="input"
        placeholder="Username"
        value={user.getUsername()}
        onChange={(e) => user.setUsername(e.target.value)}
        />
        <br />
        <input
        className="input"
        placeholder="Password"
        type="password"
        value={user.getPassword()}
        onChange={(e) => user.setPassword(e.target.value)}
        />
        <br />
        <input
        className="input"
        placeholder="Conferma password"
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <br />
    </>
}

function Language(props) {
    let question = props.languageQuestion
    let setStatus = props.setStatus

    useEffect(() => {
        if(question.areChoicesSelected()) setStatus({error: false})
        else setStatus({
            error: true,
            description: "Selezionare una voce"
        })
    }, [question])

    return <>
        <p className="description">{question.getTitle()}</p>
        <br />
        <MultipleChoiceQuestion question={question} />
    </>
}

function ExperienceQuestionLayout(props) {
    const [question, setQuestion] = useState(props.question)
    let setStatus = props.setStatus

    useEffect(() => {
        question.setState(setQuestion)
    }, [])
    
    useEffect(() => {
        setQuestion(props.question)
    }, [props.question])

    useEffect(() => {
        question.setState(setQuestion)
        if(question.areChoicesSelected()) setStatus({error: false})
        else setStatus({
            error: true,
            description: "Selezionare una voce"
        })
    }, [question])
    
    return <>
        <p className="description">{question.getTitle()}</p>
        <br />
        <MultipleChoiceQuestion question={question} />
    </>
}

function MeetingQuestionSection(props) {
    let question = props.meetingQuestion
    let setStatus = props.setStatus

    useEffect(() => {
        if(question.areChoicesSelected()) setStatus({error: false})
        else setStatus({
            error: true,
            description: "Selezionare una voce"
        })
    }, [question])

    return <>
        <p className="description">{question.getTitle()}</p>
        <br />
        <MultipleChoiceQuestion question={question} />
    </>
}

// function InvitationCodeLayout(props) {
//     let user = props.user
//     let setStatus = props.setStatus

//     return (
//         <>
//         <br/>
//         <p className="description">Hai un codice d'invito? Inseriscilo!</p>
//         <br/>
//         <input
//             className="input"
//             placeholder="Codice d'invito"
//             type="password"
//             value={user && user.getCodiceInvito()}
//             onChange={(e) => user && user.setCodiceInvito(e.target.value)}
//             />
//         <br/>
//         </>
//     )
// }


export default SigninSection
