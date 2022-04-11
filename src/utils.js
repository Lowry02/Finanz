function urlToFile(dataurl, filename = "_name_.jpg") {
 
  let arr = dataurl.split(',')
  if(arr.length > 1) {
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
      
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    console.log(new File([u8arr], filename, {type:mime}))


    return new File([u8arr], filename, {type:mime})
  };

  return ""
}

export { urlToFile }