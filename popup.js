document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');
    const clearButton = document.getElementById('clearMessages');

    function displayMessages() {
        chrome.storage.local.get({ messages: [] }, (result) => {
            const messages = result.messages;
            messageList.innerHTML = '';
            messages.forEach((message) => {
                const li = document.createElement('li');
                li.innerHTML = `
            <span class="message-type">${message.type}</span>: 
            <span class="message-text">${message.text}</span><br>
            <span class="timestamp">${message.timestamp}</span>
          `;
                messageList.appendChild(li);
            });
        });
    }

    displayMessages();

    clearButton.addEventListener('click', () => {
        chrome.storage.local.set({ messages: [] }, () => {
            console.log('All messages cleared');
            displayMessages();
        });
    });
});
