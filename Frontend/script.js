const dropZone = document.querySelector('.drop-zone');
const fileinput=document.querySelector('#fileinput');
const browsebtn=document.querySelector('.browsebtn');
const bgProgress=document.querySelector('.bg-progress');
const percentDiv=document.querySelector('#percent');
const progressContainer=document.querySelector(".progress-container")
const fileName=document.querySelector('.file-name');
const submit=document.querySelector('.submit');
const progressBar=document.querySelector('.progress-bar');
const title = document.querySelector(".title");
const fileURL = document.querySelector("#fileURL");

const button=document.getElementById('sendEmailBtn');

let file = null ;

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave",()=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop",(e)=>{
    
    const files=e.dataTransfer.files;
    console.log(files);
    if(files.length===1){
        fileinput.files = files;
        displayFileName(files[0]);
        uploadFile();
    }
    dropZone.classList.remove("dragged"); 
}); 
fileinput.addEventListener('change',(e)=>{
    e.preventDefault();
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
 
const uploadFile=(event)=>{
    event?.preventDefault();
    const file=fileinput.files[0];  
    const formData=new FormData();
    formData.append("file",file);
    progressContainer.style.display="block";
    
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            updateProgress(e);
        }
    };
    xhr.onreadystatechange=()=>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            if (xhr.status === 200) {
                onFileUploadSuccess(xhr.responseText);
               
            } else {
                console.error("Upload failed with status:", xhr.status);
                alert("Failed to upload the file.");
            }
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
    try {
        const response = JSON.parse(res);   
        console.log('Parsed Response:', response);
        console.log(response.file);
        if (response && response.file) {
            fileURL.value = response.file;
            fileURL.style.display = "block";
            document.querySelector('.email-container').style.display = 'block';
            
        } else {
            alert("Upload completed, but no file URL returned.");
        }
    } catch (error) {
        alert("File uploaded, but an error occurred while processing the response.");
    }
    setTimeout(()=>{
        progressContainer.style.display="none";
        bgProgress.style.width = "0%";   
        percentDiv.innerText = "";  
    }, 1000); 
}

const updateProgress=(e)=>{
    const percent=Math.round((100* e.loaded) / e.total);
    console.log(percent); 
    bgProgress.style.width=`${percent}%`;
    percentDiv.innerText=`${percent}%`;
}

button.addEventListener('click',async()=>{
    const senderEmail = document.getElementById('senderEmail').value;
    const receiverEmail = document.getElementById('receiverEmail').value;
    const url = fileURL.value;

    if (!senderEmail || !receiverEmail || !fileURL) {
        alert('Please fill out all fields.');
        return;
    }
    try{
        const uuid = fileURL.split('/').pop();
        const response=await fetch('http://localhost:8000/upload/sendmail',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                uuid: uuid,
                emailTo: receiverEmail
            })
        })

        const result=await response.json();
        if (response.status === 200 && result.success) {
            alert('Email sent successfully!');
        } else {
            alert('Failed to send email. Please try again.');
        }

    }
    catch(err){
        console.error('Error sending email:', err);
        alert('An error occurred. Please try again later.');
    }

} )
 
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




