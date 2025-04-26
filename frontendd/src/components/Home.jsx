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

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      progressContainerRef.current.style.display = "block";
      let percent = 0;
      const interval = setInterval(() => {
        if (percent < 90) {
          percent += 10;
          percentRef.current.textContent = `${percent}%`;
          bgProgressRef.current.style.width = `${percent}%`;
          progressBarRef.current.style.width = `${percent}%`;
        } else {
          clearInterval(interval);
        }
      }, 300);

      const response = await fetch("http://localhost:8000/upload/file", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedFileUrl(data.file);
        fileURLRef.current.value = data.file;  // Set the generated file URL in the input
        percentRef.current.textContent = `100%`; // Set the percentage to 100%
        bgProgressRef.current.style.width = `100%`;  // Complete the progress bar
        progressBarRef.current.style.width = `100%`;  // Complete the progress bar

        // Hide the progress container after upload
        progressContainerRef.current.style.display = "none";

        fetchHistory();  // Fetch the history after the upload is complete
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
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
      <div id="history-section">
        {history.length === 0 ? (
          <p>No Records found</p>
        ) : (
          history.map((file) => (
            <div key={file._id}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>{" "}- {parseInt(file.size / 1000)} KB
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
