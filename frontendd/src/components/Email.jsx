import React, { useState } from 'react';

const Email = ({ fileUrl }) => {
  const [email, setEmail] = useState("");

  const sendEmail = async () => {
    if (!email || !fileUrl) {
      alert("Please enter all fields.");
      return;
    }

    try {
      const uuid = fileUrl.split("/").pop();
      const res = await fetch("http://localhost:8000/upload/sendemail", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ uuid, emailTo: email })
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    } catch {
      alert("Error sending email.");
    }
  };

  return (
    <div className="email-container">
      <label>Receiver's Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={sendEmail}>Send</button>
    </div>
  );
};

export default Email;
