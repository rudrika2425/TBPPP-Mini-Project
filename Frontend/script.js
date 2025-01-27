const dropZone = document.querySelector('.drop-zone');
const fileinput=document.querySelector('#fileinput');
const browsebtn=document.querySelector('.browsebtn');

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
});
dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged"); 
    const files=e.dataTransfer.files;
    console.table(files);
    if(files.length){
        fileinput.files=files;
        uploadFile();
    }
});



fileinput.addEventListener("change",()=>{
    uploadFile();
})
browsebtn.addEventListener("click",()=>{
    fileinput.click();
});
//XHR FILE HANDLING
const uploadFile=()=>{

    const file=fileinput.files[0];  
    const formData=new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange=()=>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response); 
        }
    };

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

//LOTTIE ANIMATION HANDLING
  const animation = lottie.loadAnimation({
    container: document.getElementById('lottie-container'), 
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'Images/document-management.json' 
  });
function playAnimation() {
    animation.play();
}
playAnimation();


