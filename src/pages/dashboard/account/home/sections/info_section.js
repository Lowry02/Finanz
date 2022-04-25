import React, {useState, useEffect, useRef} from 'react'
import { TextField } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';
import {Row, Col} from "react-bootstrap"
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Popup from '../../../../../components/popup';
import Modal from '@mui/material/Modal';
import InfoIcon from '@mui/icons-material/Info';
import Popover from '@mui/material/Popover';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

function InfoSection(props) {
    let user = props.user
    const [showCodeGeneration, setShowCodeGeneration] = useState(false)
    const [assignableRoles, setAssignableRoles] = useState([])
    const [popupStatus, setPopupStatus] = useState({})   
    const selectedRoles = useRef([])
    const [anchorEl, setAnchorEl] = useState(null) // popover(code roles)
    const createdCodesLoaded = useRef(false)
    const [contentEdited, setContentEdited] = useState(false) // update user info
    const [openModal, setOpenModal] = useState(false) // used on redeem_code

    const rolesToAssign = {
        "normal-user" : [{name: "Utente normale", slug: "normal-user"}],
        "super-admin" : [
            {name: "Utente normale", slug: "normal-user"},
            {name: "Super admin", slug: "super-admin"},
            {name: "Admin academy", slug: "admin-academy"},
            {name: "Admin news", slug: "admin-news"},
            {name: "Admin course", slug: "admin-course"},
            {name: "Admin ebook", slug: "admin-ebook"},
            {name: "Admin quiz", slug: "admin-quiz"},
        ],
        "admin-academy" : [
            {name: "Utente normale", slug: "normal-user"},
            {name: "Admin academy", slug: "admin-academy"},
        ],
        "admin-news" : [
            {name: "Utente normale", slug: "normal-user"},
            {name: "Admin news", slug: "admin-news"},
        ],
        "admin-course" : [
            {name: "Utente normale", slug: "normal-user"},
            {name: "Admin corsi", slug: "admin-course"},
        ],
        "admin-ebook" : [
            {name: "Utente normale", slug: "normal-user"},
            {name: "Admin ebook", slug: "admin-ebook"},
        ],
        "admin-quiz" : [
            {name: "Utente normale", slug: "normal-user"},
            {name: "Admin quiz", slug: "admin-quiz"},
        ],
    }
    
    async function createRoleList() {
        let list = await user.getAllRoles()
        
        setAssignableRoles(list)
    }

    function manageCodeGeneration() {
        user.generateCode(selectedRoles.current)
                  .then(data => setShowCodeGeneration(true))
                  .catch((message) => console.log(message))
    }

    function redeemCode() {
        if(user) {
            user.redeemCode().then(() => user.refreshToken().then(() => {
                user.setCodiceInvito("")
                setOpenModal(true)
            }))
            .catch((data) => setPopupStatus({error: true, message: "Codice non valido"}))
        }
    }

    useEffect(() => {
        if(!createdCodesLoaded.current) {
            createRoleList()
            user.getCreatedCodesFromServer()
            console.log('ciao')
            createdCodesLoaded.current = true
        }
    }, [user])

    return <div id="info_section">
        <h2>Informazioni</h2>
        <div className="display_inline mt-3">
            <div>
                <div className="avatar_container">
                    <img src={user && user.getAvatar()} className="img-fluid avatar"/>
                </div>    
            </div>
            <div className="m-3 centered">
                <h4 className="name">{user && user.getSurname()} {user && user.getName()}</h4>
                <p className="username thin">{user && user.getUsername()}</p>
                <h6>I tuoi ruoli</h6>
                <p>{user && user.getRole().map(item => <Chip label={item['slug']} style={{ color: "white", background: "var(--details_color)", margin: 2}}/>)}</p>
            </div>
        </div>
        <Row className="mt-3">
            <Col md="6">
                <TextField
                    className="my_input"
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    label="Nome"
                    variant="outlined"
                    value={user && user.getName()}
                    onChange={(e) => {
                        user && user.setName(e.target.value)
                        setContentEdited(true)
                    }}/>
                <TextField
                    className="my_input"
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    label="Email"
                    variant="outlined"
                    value={user && user.getEmail()}
                    contentEditable={false}
                    onChange={(e) => {
                        user && user.setEmail(e.target.value)
                        setContentEdited(true)
                    }}/>
            </Col>
            <Col md="6">
                <TextField
                    className="my_input"
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    label="Cognome"
                    variant="outlined"
                    type="date"
                    value={user && user.getSurname()}
                    onChange={(e) => {
                        user && user.setSurname(e.target.value)
                        setContentEdited(true)
                    }}/>
                <TextField
                    className="my_input"
                    margin="normal"
                    fullWidth={true}
                    label="Compleanno"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={user && user.getBirthday()}
                    onChange={(e) => {
                        user && user.setBirthday(e.target.value)
                        setContentEdited(true)
                    }}/>
            </Col>
        </Row>
        {
            contentEdited ?
                <div className="centered">
                    <button className="button m-3" onClick={() => {
                        user && user.putInfo()
                        setContentEdited(false)
                    }}>Salva</button>
                </div> :
            ""
        }
        <Col>
            <div className="block mt-3 p-4">
                <h3>Codice d'invito</h3>
                <p>Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri.</p>
                <br/>
                <Row>
                    {
                        Object.values(user.getRole()).map(item => item['slug']).includes("super-admin") ?
                        <Col md="6">
                            <h6>Scegli i ruoli</h6>
                            <FormGroup>
                                {
                                    assignableRoles.map(item => 
                                        item['slug'] != "super-admin" ?
                                        <FormControlLabel
                                        control={<Checkbox 
                                                    className="orange_icon"
                                                    onChange={() => {
                                                        if(selectedRoles.current.indexOf(item['slug']) > -1) 
                                                            selectedRoles.current.splice(selectedRoles.current.indexOf(item['slug']), 1)
                                                        else
                                                            selectedRoles.current.push(item['slug'])
                                                    }}/>}
                                        label={item['name']} /> : 
                                        ""
                                    )
                                }
                            </FormGroup>
                            <button className="button" onClick={() => manageCodeGeneration()}>Genera codice</button>
                            <br/>
                            {
                                showCodeGeneration ?
                                <>
                                    <Col md="6" className="display_inline mb-3">
                                        <TextField
                                            className="my_input"
                                            margin="normal"
                                            fullWidth={true}
                                            multiline={true}
                                            label="Titolo"
                                            variant="outlined"
                                            contentEditable={false}
                                            value={user && user.getCodiceInvito()}/>
                                        <div className="centered m-2">
                                            <IconButton>
                                                <ContentCopyIcon className="orange_icon" onClick={() => navigator.clipboard.writeText(user && user.getCodiceInvito())}/>
                                            </IconButton>
                                        </div>
                                    </Col>
                                </> : 
                                ""
                            }
                        </Col> : 
                        ""
                    }
                    {
                        !Object.values(user.getRole()).map(item => item['slug']).includes("super-admin") ? 
                        <Col>
                            <h6>Hai un codice?</h6>
                            <input
                                className="input"
                                placeholder="Codice..."
                                value={user && user.getCodiceInvito()}
                                onChange={(e) => user && user.setCodiceInvito(e.target.value)}/>
                            <button className="button mx-auto" onClick={() => redeemCode()}>Attiva</button>
                        </Col> : 
                        <Col md="6">
                            <h6>Codici non usati</h6>
                            {
                                user && user.getCreatedCodes().map((code) => (
                                    code?.usages == 0 ? 
                                    <div className="display_inline">
                                        <TextField
                                            className="my_input"
                                            margin="normal"
                                            fullWidth={true}
                                            multiline={true}
                                            label="Titolo"
                                            variant="outlined"
                                            contentEditable={false}
                                            value={code['code']}/>
                                        <div className="centered m-2">
                                            <IconButton>
                                                <ContentCopyIcon className="orange_icon" onClick={() => navigator.clipboard.writeText(code['code'])}/>
                                            </IconButton>
                                        </div>
                                        <div className="centered m-2">
                                            <IconButton
                                            id={code['code']}
                                            onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                                            onMouseLeave={() => setAnchorEl(null)}>
                                                <InfoIcon className="orange_icon"/>
                                            </IconButton>
                                            <Popover
                                                id="mouse-over-popover"
                                                open={anchorEl?.id == code['code']}
                                                anchorEl={anchorEl}
                                                sx={{
                                                    pointerEvents: 'none',
                                                  }}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                                }}
                                                onClose={() => setAnchorEl(null)}
                                                disableRestoreFocus
                                            >
                                                <p>{code['roles']}</p>
                                            </Popover>
                                        </div>
                                        <div className="centered m-2">
                                            <IconButton>
                                                <DeleteIcon
                                                className="orange_icon"
                                                onClick={() => user.deleteCode(code['code'])
                                                               .then(() => setPopupStatus({error: false, message: "Eliminazione completata"}))
                                                               .catch(() => setPopupStatus({error: true, message: "Errore"}))}/>
                                            </IconButton>
                                        </div>
                                    </div> : 
                                    ""
                                ))
                            }
                        </Col>
                    }
                </Row>
            </div>
        </Col>
        {
            Object.keys(popupStatus).length ?
            <Popup isError={popupStatus['error']} message={popupStatus['message']} removeFunction={() => setPopupStatus({})}/> :
            ""
        }
        {
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openModal}
            onClose={() => setOpenModal(false)}
            closeAfterTransition
            BackdropProps={{
              timeout: 500,
            }}
            className="centered"
            >
                <Fade in={openModal}>
                    <Box className="modal_redeem_code">
                        <Typography id="transition-modal-title" variant="h4" component="h1" className="text-center">
                        Hai fatto passi avanti!
                        </Typography>
                        <br/>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                        { user && user.getRole().map(item => <Chip label={item['slug']} style={{ color: "white", background: "var(--details_color)", margin: 2}}/>) }
                        </Typography>
                        <br/>
                        <CloseIcon className="close_modal" onClick={() => setOpenModal(false)}/>
                    </Box>
                </Fade>
            </Modal>
        }
    </div>
}

export default InfoSection