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

let file = null;

 

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", (e) => {
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
    console.log(file);
    progressContainer.style.display="block";
    
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            updateProgress(e);
        }
    };
    xhr.onreadystatechange=()=>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.status);
            if (xhr.status === 200) {
                onFileUploadSuccess(xhr.responseText);
               
            } else {
                console.log(xhr.response)
                alert("Failed to upload the file.");
            }
        }
    };
    xhr.open("POST",'http://localhost:8000/upload/file',true);
    xhr.withCredentials=true
    console.log(formData);
    xhr.send(formData);
   
};

const onFileUploadSuccess=(res)=>{
  
    fileinput.value="";
    title.innerText="uploaded"
    try {
        const response = JSON.parse(res);   
       
        if (response && response.file) {
            fileURL.value = response.file;
           
        } else {
            alert("Upload completed, but no file URL returned.");
        }
    } catch (error) {
        alert("an error occurred while processing the response.");
    }
    setTimeout(() => {
        const response = JSON.parse(res); 
        progressContainer.style.display = "none";
        bgProgress.style.width = "0%";   
        percentDiv.innerText = "";  
        title.innerHTML = `Drag and Drop your Files here or, <span class="browsebtn"> browse</span><p class="file-name"></p>`;
        fileName.textContent = "";
        document.getElementById('receiverEmail').value = '';
        fileURL.value = response.file;
        document.querySelector('.email-container').style.display = 'block';
    }, 1500); 
    fetchfiles();
}

const updateProgress=(e)=>{
    const percent=Math.round((100* e.loaded) / e.total);
  
    bgProgress.style.width=`${percent}%`;
    percentDiv.innerText=`${percent}%`;
}

button.addEventListener('click',async()=>{
    const receiverEmail = document.getElementById('receiverEmail').value;
    const url = fileURL.value;
    if ( !receiverEmail || !fileURL) {
        alert('Please fill out all fields.');
        return;
    }
    try{
        const uuid = url.split('/').pop();
        const response=await fetch('http://localhost:8000/upload/sendemail',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
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

 
document.getElementById("LogOutBtn").addEventListener("click", function() {
    fetch("http://localhost:8000/user/logout", {
        method: "POST",
        credentials: "include", 
    })
    .then(response => response.json())

    .then(data => {
        if (data.message === "log out successfully") {
            localStorage.removeItem("islogin");
            alert(data.message);  
            window.location.href = "/Frontend/login.html"; 
        } else {
            alert("Logout failed");
        }
    })
    .catch(error => {
     
        alert("Logout failed");
    });
});


document.addEventListener("DOMContentLoaded", () => {
    fetchfiles();
  });

const fetchfiles =(e)=>{
    fetch("http://localhost:8000/upload/getfiles",{
        method:"GET",
        credentials:"include",
    })
    .then(response => response.json())
    .then(data=>{
        
        const historySection = document.getElementById('history-section');

        if (data.files && data.files.length > 0) {
          
            renderFileHistory(data.files);
            historySection.style.display = 'block'; 
          } else {
            historySection.innerHTML = "<p>No files uploaded yet.</p>";
            historySection.style.display = 'block';
          }
    })
}

function renderFileHistory(files) {
    const historySection = document.getElementById('history-section');
  
    if (files.length === 0) {
      historySection.innerHTML = `<p class="no-links">No active links found.</p>`;
      return;
    }
  
    const rows = files.map(file => {
      const expiration = new Date(file.expirationDate).toLocaleString();
      return `
        <tr>
          <td>${file.filename}</td>
          <td><a href="${file.url}" target="_blank">Share</a></td>
          <td>${expiration}</td>
        </tr>
      `;
    }).join('');
  
    historySection.innerHTML = `
      <table class="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Sharable Link</th>
            <th>Expires At</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }
  
