import React, { useState, useEffect, useRef } from 'react'
import RichTextEditor from 'react-rte';

import "./style.css"

function MarkupEditor(props) {
    let initialValue = props.content
    let setContent = props.setContent
    const loadInitialValue = useRef(true)       // stoplight
    const [currentValue, setCurrentValue] = useState(RichTextEditor.createEmptyValue())
    
    function onChangeHandler(value) {
        setCurrentValue(value)
    }

    useEffect(() => {
        loadInitialValue.current = true
        if(initialValue != currentValue.toString('markdown'))
            setCurrentValue(RichTextEditor.createValueFromString(initialValue, 'markdown'))
    }, [initialValue]) 
    
    useEffect(() => {
      if(setContent != undefined && !loadInitialValue.current) {
            setContent(currentValue.toString('markdown'))
      } else {
        loadInitialValue.current = false
      }
    }, [currentValue])

    return (
        <RichTextEditor
            className="block no-border"
            editorClassName={"editor"}
            toolbarClassName={"toolbar"}
            value={currentValue}
            onChange={onChangeHandler}
        />
    )
}

export default MarkupEditor
