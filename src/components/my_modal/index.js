import React from 'react'
import { Modal } from '@material-ui/core'

import "./style.css"


function MyModal(props) {
  let children = props.children
  let open = props.open
  let closeFuntion = props.closeFunction

  return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={closeFuntion}
        closeAfterTransition
        BackdropProps={{
            timeout: 500,
        }}
        className="centered"
        >
          <div className="modal_container">
            {children}
          </div>
        </Modal>
  )
}

export default MyModal