const socket = io();
console.log(socket);
let sendBtn = document.getElementById('send');

sendBtn.onclick = sendMessage();

    socket.on('updateConnections', (connections) => {
      const connectionsList = document.getElementById('connectionsList');
      connectionsList.innerHTML = '';
      connections.forEach((id) => {
        const li = document.createElement('li');
        li.textContent = id;
        connectionsList.appendChild(li);
      });
    });

    socket.on('privateMessage', (data) => {
      const privateMessageLog = document.getElementById('privateMessageLog');
      const messageDiv = document.createElement('div');
      messageDiv.textContent = `${data.sender}: ${data.message}`;
      privateMessageLog.appendChild(messageDiv);
    });

    function sendMessage() {
      const messageInput = document.getElementById('messageInput');
      const recipient = prompt('Enter recipient socket ID:');
      if (recipient) {
        socket.emit('privateMessage', {
          recipient: recipient,
          message: messageInput.value,
        });
      }
      messageInput.value = '';
    }