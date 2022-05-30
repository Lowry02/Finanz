import React from 'react'
import { useState } from 'react'
import { Modal } from '@material-ui/core'
import "./style.css"

/**
 * 
 * action = {
 *  confirm: function(),
 *  refute: function()
 * }
 */

function ConfirmAction(props) {
  let { confirm, refute } = props.action
  let closeFunction = props.closeFunction
  refute = refute == undefined ? closeFunction : refute

  return (
    <Modal
      open={confirm != undefined}
      onClose={closeFunction}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="centered"
    >
      <div className="confirm_action block centered">
        <h1>Vuoi procedere?</h1>
        <div className="text-center">
          <button className="button bounce" onClick={() => {
            confirm()
            closeFunction()
          }}>Si</button>
          <button className="button bounce" onClick={() => refute()}>No</button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmAction