import React, {useState, useEffect, useRef} from 'react'
import QuestionCreationController from '../../../controllers/question_creation_controller'
import { TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ImagePicker from "../../../media/icons/image_picker.png"
import CloseIcon from '@mui/icons-material/Close';
import {urlToFile} from "../../../utils"

function EditCategories(props) {
    let isOpen = props.isOpen
    let setIsOpen = props.setIsOpen
    let question = props.content
    let onDelete = props.onDelete
    let onCreation = props.onCreation
    let onUpdate = props.onUpdate
    let showDescription = props.showDescription
    let showImage = props.showImage

    const nameElement = useRef()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [selectedItem, setSelectedItem] = useState('')
    const [questionCreator, setQuestionCreator] = useState(new QuestionCreationController())

    function handleClose() { setIsOpen(false) }

    function send() {
        if(selectedItem == '') {
            onCreation(name, description, image, (data) => questionCreator.addItem(data, data['slug']))
        } else {
            onUpdate(selectedItem['slug'], name, description, image, (data) => {
                questionCreator.deleteItem(selectedItem['slug'])
                questionCreator.addItem(data, data['slug'])
            })
        }
        setSelectedItem('')
        setName("")
        setDescription("")
        setImage("")
    }

    function handleNewCategory() {
        if(name != "") {
            send()
            setName("")
            setDescription("")
            setImage("")
        }
        else nameElement.current.focus()
    }

    function selectItem(item) {
        if(item != selectedItem) {
            setSelectedItem(item)
            setName(item['title'])
            setDescription(item['description'])
            setImage(item['coverImageLink'])
        } else {
            setSelectedItem('')
            setName('')
            setDescription('')
            setImage('')
        }
    }

    function readImage(e) {
        if(e != undefined) {
            let input = e.target
            if(input?.files[0] != undefined) {
                let reader = new FileReader()
                reader.readAsDataURL(input.files[0])
                reader.onload = function() {
                    let dataURL = reader.result
                    setImage(dataURL)
                }
            }
        }
    }

    useEffect(() => {
        questionCreator.setState(setQuestionCreator)
    }, [])

    useEffect(() => {
        questionCreator.load({question: question.exportQuestion()})
    }, [question])

    return (
        <div>
            <Dialog
            className="edit_categories_dialog"
            open={isOpen}
            onClose={handleClose}
            >
                <DialogTitle>Modifica le categorie</DialogTitle>
                <DialogContent>
                    {
                        Object.keys(questionCreator.question.getChoices()).map((id) => 
                            <>
                                <div
                                onClick={() => selectItem(questionCreator.question.getChoices()[id])}
                                className="display_inline space_between">
                                    <p className="m-0">{questionCreator.question.getChoices()[id]['title']}</p>
                                    <p className="m-0">{questionCreator.question.getChoices()[id]?.description}</p>
                                    <DeleteIcon onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(id, () => {
                                            setSelectedItem('')
                                            questionCreator.deleteItem(id)
                                        })
                                    }}/>
                                </div>
                                <hr/>
                            </>
                        )
                    }
                    <TextField
                        ref={nameElement}
                        className="my_input"
                        margin="normal"
                        label="Nuova voce"
                        fullWidth={true}
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    {
                        showDescription ? 
                            <TextField
                            className="my_input"
                            margin="normal"
                            label="Descrizione"
                            fullWidth={true}
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => e.key == "Enter" ? handleNewCategory(e) : () => {}} /> : 
                            ""
                    }
                    {
                        showImage ? 
                        <div style={{ height: "100px" }} id="category_image_container">
                        {
                            image == "" ?
                                <>
                                    <label htmlFor="category_image_input" className="centered">
                                        <img className="mx-auto bounce" height="100px" style={{ width: "auto" }} src={ImagePicker} width={200} />
                                    </label>
                                    <input 
                                    id="category_image_input"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={readImage}/>
                                </> : 
                                <>
                                    <CloseIcon className="remove_image_icon bounce" onClick={() => setImage("")}/>
                                    <img className="category_image" src={image} />
                                </>
                        }
                        </div>
                        : ""
                    }
                    <div className="text-center">
                        <button className="button bounce" onClick={() => handleNewCategory()}>Invia</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditCategories