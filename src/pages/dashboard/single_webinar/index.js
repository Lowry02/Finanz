import { Container, Fade } from '@material-ui/core'
import { Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import WebinarController from '../../../controllers/webinar'
import { Row, Col } from 'react-bootstrap'
import { Chip } from '@material-ui/core'
import moment from 'moment'

import "./style.css"
import { Link } from 'react-router-dom'

function SingleWebinar() {
  let { webinar_id } = useParams()

  const [webinar, setWebinar] = useState(new WebinarController())
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    webinar.setState(setWebinar)
    if(webinar != undefined) await webinar.loadById(webinar_id)
    setLoading(false)
  }, [])
  
  return (
    <div id="single_webinar">
      {
        loading ?
        <Container className="text-center">
          <Fade in={loading}>
            <div>
              <Skeleton variant="rectangular" width="50%" className="mx-auto"/>
              <br/>
              <Skeleton variant="rectangular" width="50%" className="mx-auto"/>
              <br/>
              <Skeleton variant="rectangular" width="50%" className="mx-auto"/>
              <br/>
              <Skeleton variant="rectangular" height="500px" className="mx-auto"/>
            </div>
          </Fade>
        </Container> :
        <div>
          <Fade in={!loading}>
            <div className="text-center">
              <h1>{webinar.getTitle()}</h1>
              <p className="thin text-center m-0">{moment(webinar.getDate()).format("DD-MM-YYYY HH:mm")}</p>
              <div className="display_inline mx-auto m-2">
                <a href={webinar.getSocietyLink()}><Chip className="my_chip bounce" label={"Società: " + webinar.getSociety()} /></a>
                <a href={webinar.getGuestLink()}><Chip className="my_chip bounce" label={"Ospite: " + webinar.getGuest()} /></a>
              </div>  
              <div className="separator"></div>
              <p className="thin m-0">{webinar.getDescription()}</p>
              <div className="separator"></div>
              <div dangerouslySetInnerHTML={{ __html: webinar.getEventVideoIframe() }} />
              <div dangerouslySetInnerHTML={{ __html: webinar.getEventChatIframe() }} />
            </div>
          </Fade>
        </div>
      }
    </div>
  )
}

export default SingleWebinar