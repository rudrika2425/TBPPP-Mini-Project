import React, { useRef, useState, useEffect } from "react";
import shareLogo from "../assets/Images/share.png";
import copyIcon from "../assets/Images/copy-svgrepo-com.svg";
import "./style.css";

const Home = () => {
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileNameRef = useRef(null);
  const percentRef = useRef(null);
  const bgProgressRef = useRef(null);
  const progressContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const fileURLRef = useRef(null);
  const receiverEmailRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const dropZone = dropZoneRef.current;

    const handleDragOver = (e) => {
      e.preventDefault();
      dropZone.classList.add("dragged");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragged");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragged");
      const files = e.dataTransfer.files;
      if (files.length === 1) {
        fileInputRef.current.files = files;
        handleFileChange({ target: { files } });
      }
    };

    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave);
    dropZone.addEventListener("drop", handleDrop);

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("dragleave", handleDragLeave);
      dropZone.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/user/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem('islogin');
        alert(data.message);
        window.location.href = "/login";
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const displayFileName = (file) => {
    if (fileNameRef.current) {
      fileNameRef.current.textContent = file.name;
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length === 1) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      displayFileName(selectedFile);
      uploadFile(selectedFile);
    }
  };
  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const xhr = new XMLHttpRequest();
  
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        percentRef.current.textContent = `${percentComplete}%`;
        bgProgressRef.current.style.width = `${percentComplete}%`;
        progressBarRef.current.style.width = `${percentComplete}%`;
      }
    };
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        progressContainerRef.current.style.display = "none";
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUploadedFileUrl(data.file);
          fileURLRef.current.value = data.file;
          fetchHistory();
        } else {
          alert("Upload failed");
        }
      }
    };
  
    xhr.open("POST", "http://localhost:8000/upload/file");
    xhr.withCredentials = true; 
    progressContainerRef.current.style.display = "block";
    xhr.send(formData);
  };
  

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/upload/getfiles", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        
        setHistory(data.files);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Fetching history failed", err);
    }
  };

  const sendEmail = async () => {
    const emailTo = receiverEmailRef.current.value;
    const uuid = uploadedFileUrl.split("/").pop();

    if (!uuid || !emailTo) {
      alert("Please upload a file and enter receiver's email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/upload/sendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ uuid, emailTo }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("📧 Email sent successfully!");
      } else {
        alert(data.error || "Failed to send email.");
      }
    } catch (err) {
      console.error("Sending email failed:", err);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div id="logo">
            <img src={shareLogo} alt="Logo" />
          </div>
          <div id="Header">InShare</div>
        </div>
        <button id="LogOutBtn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      <section className="upload-container">
        <div className="drop-zone" ref={dropZoneRef}>
          <div className="icon-container" id="lottie-container"></div>
          <input
            type="file"
            id="fileinput"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <div className="title">
            Drag and Drop your Files here or,
            <span className="browsebtn" onClick={handleBrowseClick}>
              {" "}browse
            </span>
            <p className="file-name" ref={fileNameRef}></p>
          </div>
        </div>

        <div
          className="progress-container"
          ref={progressContainerRef}
          style={{ display: "none" }}
        >
          <div className="bg-progress" ref={bgProgressRef}></div>
          <div className="inner-container">
            <div className="title">Uploading..</div>
            <div className="percent-container">
              <span id="percent" ref={percentRef}>0%</span>
            </div>
            <div className="progress-bar" ref={progressBarRef}></div>
          </div>
        </div>
   
        <div className="sharing-container">
          <p className="expire">Link expires in 24 hours</p>
          <div className="input-container">
            <input type="text" id="fileURL" ref={fileURLRef} readOnly />
            <img
              src={copyIcon}
              alt="copy icon"
              onClick={() => {
                navigator.clipboard.writeText(fileURLRef.current.value);
                alert("Copied to clipboard!");
              }}
            />
          </div>
        </div>
      </section>

      <div className="email-container">
        <label htmlFor="receiverEmail">Receiver's Email:</label>
        <input
          type="email"
          id="receiverEmail"
          placeholder="Enter receiver's email"
          ref={receiverEmailRef}
        />
        <button id="sendEmailBtn" onClick={sendEmail}>
          Send
        </button>
      </div>

      <h2>History</h2>
      <h2>Active PDF Links</h2>
    <div id="history-section">
  {history.length === 0 ? (
    <p>No active links found.</p>
  ) : (
    <table className="history-table">
      <thead>
        <tr>
          <th>File Name</th>
          <th>Sharable Link</th>
          <th>Expires At</th>
        </tr>
      </thead>
      <tbody>
        {history.map((file) => (
          <tr key={file._id}>
            <td>{file.filename}</td>
            <td>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.url}
              </a>
            </td>
            <td>{new Date(file.expirationDate).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
};

export default Home;
