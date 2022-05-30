import React, {useState, useEffect, useRef} from 'react'
import $ from "jquery"
import "./style.css"

import CreateModuleController from '../../controllers/create_module_controller'
import AccademyListController from '../../controllers/accademy_list_controller'
import ModuleController from '../../controllers/module_controller'
import Module from "../../models/module"
import TagController from '../../controllers/tag_controller'
import FieldOfInterest from '../../controllers/field_of_interest_controller'
import NewsListController from '../../controllers/news_list_controller'
import MarkupEditor from '../../components/markup_editor'

function TestPage(props) {
    // const [list, setList] = useState(new AccademyListController())
    // const [content, setContent] = useState(new CreateModuleController())
    const [content, setContent] = useState("++ciao ++")

    const [news, setNews] = useState(new AccademyListController())
    function click() {
    }
    

    useEffect(async () => {
        news.setState(setNews)
        await news.loadSavedNotes()


        // ------------------------------------------
        // list.setState(setList)
        // content.setState(setContent)

        // // getting modules
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()
        // await list.loadCreatedModules()

        // let createdModules = list.getCreatedModules()

        // for(let moduleId of Object.keys(createdModules)) {
        //     console.log(content)
        //     console.log("SISTEMO: ", moduleId)
        //     await content.module.loadById(moduleId)
        //     content.getArguments()?.addSelectedChoice(content.module.getArgument(), false)
        //     console.log(content)
        //     await content.publish((message) => console.log(message))
        //     console.log("Fine")
        //     content.module.module = new Module()
        //     content.getArguments().setSelectedChoices([])
        //     console.log(content)
        // }

    }, [])
    

    return <div id="test_page">
        <MarkupEditor content={content} setContent={setContent}/>
    </div>
}

export default TestPage
