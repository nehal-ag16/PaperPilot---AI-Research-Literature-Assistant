// test-chat.js
fetch('http://localhost:5000/api/chat/1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: "What is AI?" })
})
.then(res => res.json())
.then(data => console.log("SUCCESS:", data))
.catch(err => console.error("ERROR:", err));
