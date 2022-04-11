import React, {useState} from 'react'
import { TextField } from '@mui/material';
import Compressor from 'compressorjs';
import { IconButton } from '@material-ui/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function ImageLink() {
  const [generalImageURL, setGeneralImageURL] = useState("")

  function getImageLink(e) {
    if(e != undefined) {
        let input = e.target
        let reader = new FileReader();
        let file = input.files[0]
        new Compressor(file, {
            quality: 0.6,
            maxWidth: 600,
            success: (file) => {
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (e) => {    
                    setGeneralImageURL(reader.result)
                }
            }
        })
    }
  }

  return (
      <div className="block">
        <h5 className="mt-2">Crea link immagine</h5>
        <label className="text-center" htmlFor="general_image">
            <h6 className="button">Scegli immagine</h6>
        </label>
        <input
        style={{display: "none"}}
        id="general_image"
        accept="image/*"
        type="file"
        onClick={() => setGeneralImageURL("")}
        onChange={(e) => getImageLink(e)}/>
        <div className="display_inline">
            <TextField
                className="my_input m-0"
                margin="normal"
                fullWidth={false}
                multiline={false}
                label="Link"
                variant="outlined"
                value={generalImageURL}/>
            <div className="centered m-2">
                <IconButton>
                    <ContentCopyIcon className="orange_icon" onClick={() => navigator.clipboard.writeText(generalImageURL)}/>
                </IconButton>
            </div>
        </div>
      </div>
  )
}

export default ImageLink