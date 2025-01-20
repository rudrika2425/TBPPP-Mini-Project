const dropZone = document.getElementById("dropZone");
const dropText = document.getElementById("dropText");

["dragover", "dragenter", "dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => event.preventDefault());
});

dropZone.addEventListener("dragover", () => {
    dropZone.classList.add("dragover");
    dropText.textContent = "Drop your file here!";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
    dropText.textContent = "Drag and Drop a File.";
});

dropZone.addEventListener("drop", event => {
    dropZone.classList.remove("dragover");

    const files = event.dataTransfer.files;

    if (files.length) {
        const file = files[0]; 
        dropText.textContent = `Uploaded: ${file.name}`;
        console.log("File uploaded:", file);
        uploadFile(file);
    } else {
        dropText.textContent = "No file detected!";
    }
});

function uploadFile(file) {
   c
    console.log(`Uploading file: ${file.name}`);
    
}
