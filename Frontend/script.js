const dropZone = document.querySelector('.drop-zone');
const fileinput=document.querySelector('#fileinput');
const browsebtn=document.querySelector('.browsebtn');
const bgProgress=document.querySelector('.bg-progress');
const percentDiv=document.querySelector('#percent');
const progressContainer=document.querySelector(".progress-container")
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
        // uploadFile();
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


//HamBurger Menu

// JavaScript to toggle the side tab and history section
const hamburgerMenu = document.getElementById('hamburger-menu');
const sideTab = document.getElementById('side-tab');
const closeBtn = document.getElementById('close-btn');
const historyTab = document.getElementById('history-tab');
const historySection = document.getElementById('history-section');

// Toggle side tab on hamburger menu click
hamburgerMenu.addEventListener('click', () => {
    sideTab.style.left = '0';
});

// Close side tab
closeBtn.addEventListener('click', () => {
    sideTab.style.left = '-250px';
});

// Show history section when clicked on "History" tab
historyTab.addEventListener('click', () => {
    historySection.style.display = 'block';
});



