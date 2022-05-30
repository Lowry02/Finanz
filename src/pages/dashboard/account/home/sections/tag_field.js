import React, { useEffect, useState } from 'react'
import { Checkbox, Chip, Tab, Tabs } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { Col, Row } from 'react-bootstrap'
import TagListController from '../../../../../controllers/tags_list'
import FieldsOfInterestListController from '../../../../../controllers/field_of_interest_list_controller'
import { Select, MenuItem } from '@material-ui/core'
import { Autocomplete } from '@mui/material'
import CreateModuleController from '../../../../../controllers/create_module_controller'
import { ListItemText } from '@material-ui/core'
import ConfirmAction from "../../../../../components/confirm_action"
import { useNavigate } from "react-router";


function TagField(props) {
  const [section, setSection] = useState(1)
  const [newValue, setNewValue] = useState("")
  const [tagList, setTagList] = useState(new TagListController())
  const [fieldList, setFieldList] = useState(new FieldsOfInterestListController())
  const [academy, setAcademy] = useState(new CreateModuleController())
  const [loading, setLoading] = useState(true)

  const [currentField, setCurrentField] = useState("")
  const [currentArgument, setCurrentArgument] = useState("")
  const [tagPerField, setTagPerField] = useState([])
  const [tagPerArgument, setTagPerArgument] = useState([])
  const [confirmInfo, setConfirmInfo] = useState({confirm: undefined, refute: undefined})

  let navigate = useNavigate()

  let user = props.user
  let routes = props.routes
  
  function linkFieldToTag(tag, link) {
    if(currentField != "") {
      if(link) {
        setTagPerField([...tagPerField, tag])
        tag.linkFieldToTag(currentField)
      }
      else {
        let index = tagPerField.map(item => item.getId()).indexOf(tag.id)
        if(index >= 0) {
          tagPerField.splice(index, 1)
          setTagPerField([...tagPerField])
        }
        tag.unlinkFieldToTag(currentField)
      }
    }
  }

  function linkTagToArg(tag, link) {
    if(currentArgument != "") {
      if(link) {
        setTagPerArgument([...tagPerArgument, tag])
        tag.linkTagToArg(currentArgument)
      }
      else {
        let index = tagPerArgument.map(item => item.getId()).indexOf(tag.id)
        if(index >= 0) {
          tagPerArgument.splice(index, 1)
          setTagPerArgument([...tagPerArgument])
        }
        tag.unlinkTagToArg(currentArgument)
      }
    }
  }

  function createItem(e) {
    if(e.key == "Enter") {
      if(section == 1) tagList.create(newValue)
      else if(section == 2) fieldList.create(newValue)
      setNewValue("")
    }
  }

  useEffect(async () => {
    if(currentField != "") setTagPerField(await fieldList.getTagPerField(currentField))
  }, [currentField])

  useEffect(async () => {
    if(currentArgument != "") setTagPerArgument(await tagList.getTagPerArgument(currentArgument))
  }, [currentArgument])

  useEffect(async () => {
    tagList.setState(setTagList)
    fieldList.setState(setFieldList)
    academy.setState(setAcademy)
    if(user && user.canI("create_tag")) {
      await tagList.loadTags()
      await fieldList.loadFields()
      await academy.loadArguments()
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if(user) {
      if(!user.canI("create_tag")) navigate(routes.home.path)
    }
  }, [user])
  

  return (
    <div className="tag_field"> 
      <h1>Tag & Field</h1>
      <p style={{ fontWeight: 200 }}>Creazione dei campi di interesse e dei tag.</p>
      <Tabs value={section} onChange={(e, newValue) => setSection(newValue)} scrollButtons="auto">
        <Tab label="Tag" value={1}/>
        <Tab label="Campi d'interesse" value={2} />
        <Tab label="Link" value={3} />
      </Tabs>
      <Row className="content">
        <Col  className="mx-auto">
          <Col md="6" className="mx-auto">
          {
            [1,2].includes(section) ? 
              <input
                className="input"
                placeholder="Nuovo tag"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => createItem(e)}/>
              : ""
          }
          </Col>
          <div>
            {
              section == 1 ?
                tagList.getList().map(tag => (
                  <Chip className="my_chip" label={tag.getName()} onDelete={() => setConfirmInfo({confirm: () => tagList.delete(tag.getId()), refute: undefined})}/>
                )) :
              section == 2 ?
                fieldList.getFieldOfInterest().map(field => (
                  <Chip className="my_chip" label={field.getName()} onDelete={() => setConfirmInfo({confirm: () => fieldList.delete(field.getId()), refute: undefined}) }/>
                ))  :
                ""
            }
            <br/>
            {
              !loading ?
                section == 1 ?
                  tagList.getList().length == 0 ? 
                  <p className="text-center">Non sono stati caricati tag</p> : 
                  "" :
                section == 2 ?
                  fieldList.getFieldOfInterest().length == 0 ? 
                  <p className="text-center">Non sono stati caricati campi</p> : 
                  "" : 
                section == 3 ?
                  <div>
                    <h5>Link fra campi e tag</h5>
                    <Row>
                      <Col md="6">
                        <p className="m-0">Campo</p>
                        <Select value={currentField} variant="standard" className="input" label="Campo">
                          {
                            fieldList.getFieldOfInterest().map(field => (
                              <MenuItem key={field.getId()} value={field.getId()} onClick={() => setCurrentField(field.getId())}>
                                <ListItemText primary={field.getName()} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </Col>
                      <Col md="6">
                        <p className="m-0">Tag</p>
                        <Select renderValue={(selected) => selected.map(item => item.getName()).join(', ')} multiple value={tagPerField} variant="standard" className="input" label="Tag">
                          {
                            tagList.getList().map(tag => (
                              <MenuItem onClick={() => linkFieldToTag(tag, !tagPerField.map(item => item.getId()).includes(tag.getId()))}>
                                <Checkbox className="orange_icon" checked={tagPerField.map(item => item.getId()).includes(tag.getId())} />
                                <ListItemText primary={tag.getName()} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </Col>
                    </Row>
                    <br/>
                    <Row>
                      <h5>Link fra academy e tag</h5>
                      <Col md="6">
                        <p className="m-0">Argomento</p>
                        <Select value={currentArgument} variant="standard" className="input" label="Categoria">
                          {
                            Object.values(academy.getArguments().getChoices()).map(arg => (
                              <MenuItem key={arg.slug} value={arg.slug} onClick={() => setCurrentArgument(arg.slug)}>
                                <ListItemText primary={arg.title} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </Col>
                      <Col md="6">
                        <p className="m-0">Tag</p>
                        <Select renderValue={(selected) => selected.map(item => item.getName()).join(', ')} multiple value={tagPerArgument} variant="standard" className="input" label="Tag">
                          {
                            tagList.getList().map(tag => (
                              <MenuItem onClick={() => linkTagToArg(tag, !tagPerArgument.map(item => item.getId()).includes(tag.getId()))}>
                                <Checkbox className="orange_icon" checked={tagPerArgument.map(item => item.getId()).includes(tag.getId())} />
                                <ListItemText primary={tag.getName()} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </Col>
                    </Row>
                  </div> :
                  "" : 
                ""
            }
          </div>
        </Col>
      </Row>
      <ConfirmAction action={confirmInfo} closeFunction={() => setConfirmInfo({confirm: undefined, refute: undefined})} />

    </div>
  )
}

export default TagField