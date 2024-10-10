const chat = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const imageInput = document.getElementById('imageInput');

// Function to handle sending a text message
async function sendMessage() {
  const message = messageInput.value.trim();
  if (message === '') return;

  // Display the user's text message
  displayMessage(`You: ${message}`, 'user-message');
  messageInput.value = '';

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Display the bot's text response
    displayMessage(`Gemini: ${data.response}`, 'bot-message');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to handle image upload
async function sendImage(file) {
  const reader = new FileReader();
  reader.onloadend = async function () {
    const imageBase64 = reader.result.split(',')[1]; // Get base64 string

    // Display image preview in chat
    displayImagePreview(file);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageBase64 })
      });

      const data = await response.json();

      // Display the bot's response to the image
      displayMessage(`Bot: ${data.response}`, 'bot-message');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  reader.readAsDataURL(file);
}

// Function to display messages
function displayMessage(text, className) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', className);
  messageElement.textContent = text;
  chat.appendChild(messageElement);
  
  // Scroll to the bottom after the message is added
  setTimeout(scrollToBottom, 0); // Use setTimeout to wait for rendering
}

// Function to display image preview
function displayImagePreview(file) {
  const imagePreview = document.createElement('img');
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.add('image-preview');
  chat.appendChild(imagePreview);

  // Scroll to the bottom after the image is added
  setTimeout(scrollToBottom, 0); // Use setTimeout to wait for rendering
}

// Function to scroll chat to the bottom
function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Event listener for the Enter key
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

// Event listener for image input
imageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    sendImage(file);
  }
});
