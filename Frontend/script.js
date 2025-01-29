const dropZone = document.querySelector('.drop-zone');
const fileinput=document.querySelector('#fileinput');
const browsebtn=document.querySelector('.browsebtn');
const bgProgress=document.querySelector('.bg-progress');
const percentDiv=document.querySelector('#percent');
const progressContainer=document.querySelector(".progress-container")
// const uploadURL=
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

browsebtn.addEventListener("click",()=>{
    fileinput.click();
});

fileinput.addEventListener("change",()=>{
    uploadFile();
});

//XHR FILE HANDLING
const uploadFile=()=>{
    progressContainer.style.display="block";
    const file=fileinput.files[0];  
    const formData=new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange=()=>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response); 
            showLink(JSON.parse(xhr.response));//converts to js object
        }
    };
    xhr.upload.onprogress=updateProgress;
    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const updateProgress=(e)=>{
    const percent=Math.round((e.loaded / e.total) *100);
    console.log(percent); 
    bgProgress.style.width=`${percent}%`;
    percentDiv.innerText=percent;
}
 
const showLink=(response)=>{
file=response.file;
console.log(file);
progressContainer.style.display=none;

}







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


