const dropZone = document.querySelector('.drop-zone');
const fileinput=document.querySelector('#fileinput');
const browsebtn=document.querySelector('.browsebtn');
const fileName=document.querySelector('.file-name');
const submit=document.querySelector('.submit');
let file = null ;
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
        displayFileName(files[0]);
        file=files[0];
    
    }
});
fileinput.addEventListener('change',(e)=>{
    if (e.target.files.length) {
        displayFileName(e.target.files[0]);    
        file=e.target.files[0]; 
    }
})


submit.addEventListener('click',async(e)=>{

    console.log(file);
    const formData=new FormData();
    formData.append('file',file);
    try{
        const res=await fetch('http://localhost:8000/upload/file',{
            method:'POST',
            credentials:'include',
            body:'formData'
        });
        const result=await res.json();
        console.log(result)
        if(res.ok){
            alert('file uploaded successfully');
            fileName.textContent ="";

        }
        else{
            alert('some error occured, Please try again!!')
            fileName.textContent ="";
        }
    }
    catch(err){
        console.log("error detected");
    }
})

function displayFileName(file) {
    fileName.textContent = `Selected File: ${file.name}`;
}

browsebtn.addEventListener("click",()=>{
    fileinput.click();
});




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


