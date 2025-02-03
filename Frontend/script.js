const dropZone = document.querySelector('.drop-zone');
const fileinput=document.querySelector('#fileinput');
const browsebtn=document.querySelector('.browsebtn');
const bgProgress=document.querySelector('.bg-progress');
const percentDiv=document.querySelector('#percent');
const progressContainer=document.querySelector(".progress-container")
const fileName=document.querySelector('.file-name');
const submit=document.querySelector('.submit');

const title = document.querySelector(".title");
const fileURL = document.querySelector("#fileURL");
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
 
    if(files.length){
        displayFileName(files[0]);
        file=files[0];
        uploadFile();
    }
}); 
fileinput.addEventListener('change',(e)=>{
    if (e.target.files.length) {
        displayFileName(e.target.files[0]);    
        file=e.target.files[0]; 
        uploadFile();
    }
})


function displayFileName(file) {
    fileName.textContent = `Selected File: ${file.name}`;
}

browsebtn.addEventListener("click",()=>{
    fileinput.click();
});

 


const uploadFile=()=>{
    const file=fileinput.files[0];  
    const formData=new FormData();
    formData.append("file",file);

    progressContainer.style.display="block";
    bgProgress.style.width = `0%`;  
    percentDiv.innerText = `0%`;
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            updateProgress(e);
        }
    };

    xhr.onreadystatechange=()=>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            onFileUploadSuccess(xhr.responseText);
        }
    };
    
    xhr.open("POST",'http://localhost:8000/upload/file',true);
    xhr.withCredentials=true
    xhr.send(formData);
    console.log(formData);
};

const onFileUploadSuccess=(res)=>{
    console.log('Raw Response:', res);
   
    fileinput.value="";
    title.innerText="uploaded"
    progressContainer.style.display = "none";  
    try {
        const response = JSON.parse(res);   
        console.log('Parsed Response:', response);
        if (response.file && response.file.trim() !== "") {
            fileURL.value = response.file;
            console.log("Uploaded File URL:", response.file);
        } else {
            alert("Upload completed, but no file URL returned.");
        }
    } catch (error) {
        console.error("Error parsing response:", error);
        alert("File uploaded, but an error occurred while processing the response.");
    }
}

const updateProgress=(e)=>{
    const percent=Math.round((100* e.loaded) / e.total);
    console.log(percent); 
    bgProgress.style.width=`${percent}%`;
    percentDiv.innerText=`${percent}%`;
}
 
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



const hamburgerMenu = document.getElementById('hamburger-menu');
const sideTab = document.getElementById('side-tab');
const closeBtn = document.getElementById('close-btn');
const historyTab = document.getElementById('history-tab');
const historySection = document.getElementById('history-section');


hamburgerMenu.addEventListener('click', () => {
    sideTab.style.left = '0';
});


closeBtn.addEventListener('click', () => {
    sideTab.style.left = '-250px';
});


historyTab.addEventListener('click', () => {
    historySection.style.display = 'block';
});

document.getElementById("LogOutBtn").addEventListener("click", function() {
    fetch("http://localhost:8000/user/logout", {
        method: "GET",
        credentials: "include", 
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "log out successfully") {
            alert(data.message);  
            window.location.href = "/Frontend/login.html"; 
        } else {
            alert("Logout failed");
        }
    })
    .catch(error => {
        console.log("Error during logout:", error);
        alert("Logout failed");
    });
});




