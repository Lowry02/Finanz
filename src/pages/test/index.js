import React, {useState, useEffect, useRef} from 'react'
import $ from "jquery"
import "./style.css"
import Compressor from 'compressorjs';

import RichTextEditor from 'react-rte';

function TestPage(props) {
    const [blob, setBlob] = useState("")
    const input = useRef()

    function print() {
        var url = "https://finanz-developing.herokuapp.com/academy/note/nuovo-modulo-50/pages";
 
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
 
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzcwMjg0OSwianRpIjoiY2Y1ZmJlNDctNzI2NC00OGE3LWI5NDItYzZiMTFiNDY2Mzk0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6NSwibmJmIjoxNjQ3NzAyODQ5LCJleHAiOjE2NDc3MDM3NDksInVzZXJfcm9sZXMiOlsibm9ybWFsLXVzZXIiLCJzdXBlci1hZG1pbiJdfQ.eaAunPivR1RUC72uFpJfZ1QTdIJsPjoJC5i414TYeTs");
        xhr.setRequestHeader("Content-Type", "application/json");
 
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }};
 
        var data = `{
            "page" : 1
            } `;
 
        xhr.send(data);
    }

    function sendData() {
        let accessToken = window.localStorage.getItem("accessToken")
        let formData = new FormData()
        formData.append('title', "provaFile")
        formData.append('description', "vediamo")
        formData.append('difficulty', 1)
        formData.append('picture', dataURLtoFile(blob, 'prova.jpg'))

        $.ajax({
            type: "POST",
            url: "https://finanz-developing.herokuapp.com/academy/argument/mercati-finanziari/modules",
            contentType: "application/json",
            accepts: "application/json",
            beforeSend: (request) => request.setRequestHeader('Authorization', "Bearer " + accessToken),
            data: formData,
            contentType: false,
            processData: false,
        })
    }

    async function imageLink(e) {
        if(e != undefined) {
            let input = e.target
            if(input?.files[0] != undefined) {
                let reader = new FileReader()
                reader.readAsDataURL(input.files[0])
                reader.onload = function() {
                    let dataURL = reader.result
                    setBlob(dataURL)
                }
            }
        }
    }

    function blobCreationFromURL(inputURI) {
  
        var binaryVal;
  
        // mime extension extraction
        var inputMIME = inputURI.split(',')[0].split(':')[1].split(';')[0];
  
        // Extract remaining part of URL and convert it to binary value
        if (inputURI.split(',')[0].indexOf('base64') >= 0)
            binaryVal = atob(inputURI.split(',')[1]);
  
        // Decoding of base64 encoded string
        else
            binaryVal = unescape(inputURI.split(',')[1]);
  
        // Computation of new string in which hexadecimal
        // escape sequences are replaced by the character 
        // it represents
  
        // Store the bytes of the string to a typed array
        var blobArray = [];
        for (var index = 0; index < binaryVal.length; index++) {
            blobArray.push(binaryVal.charCodeAt(index));
        }
  
        let blobObject = new Blob([blobArray], {
            type: inputMIME
        });
    
        return new File([blobObject], "", {type: blobObject.type})
    }

    function dataURLtoFile(dataurl, filename) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        console.log(mime)

        return new File([u8arr], filename, {type:mime});
    }

    useEffect(() => {
        console.log(blob)
    }, [blob])
    

    return <div id="test_page">
        <input type="file" ref={input} onChange={imageLink}/>
        <button onClick={sendData}>Invia</button>
    </div>
}

export default TestPage
