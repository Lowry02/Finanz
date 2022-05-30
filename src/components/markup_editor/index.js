import React, { useState, useEffect, useRef } from 'react'
import RichTextEditor from 'react-rte';

import "./style.css"

function MarkupEditor(props) {
    let initialValue = props.content
    let setContent = props.setContent
    const loadInitialValue = useRef(true)       // stoplight
    const [currentValue, setCurrentValue] = useState(RichTextEditor.createEmptyValue())
    
    const toolbarConfig = {
        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS', 'IMAGE_BUTTON'],
        INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        // {label: 'Underline', style: 'UNDERLINE'},
        {label: "Strikethrough", style: "STRIKETHROUGH"},
        ],
        BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
        ],
        BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
        ]
    }

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
      console.log(currentValue.toString('markdown'))
    }, [currentValue])

    return (
        <RichTextEditor
            className="block no-border"
            editorClassName={"editor"}
            toolbarClassName={"toolbar"}
            toolbarConfig={toolbarConfig}
            value={currentValue}
            onChange={onChangeHandler}
        />
    )
}

export default MarkupEditor
