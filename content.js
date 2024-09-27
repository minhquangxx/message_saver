let savedMessages = {};

function saveMessage(messageId, content) {
    savedMessages[messageId] = content;
    chrome.runtime.sendMessage({ action: "saveMessage", message: { id: messageId, content: content } });
}

function observeMessages() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const messages = node.querySelectorAll('[data-testid^="message-container-"]');
                        messages.forEach((message) => {
                            const messageId = message.getAttribute('data-testid').split('-').pop();
                            const content = message.textContent;
                            saveMessage(messageId, content);
                        });
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

function checkDeletedMessages() {
    Object.keys(savedMessages).forEach((messageId) => {
        const messageElement = document.querySelector(`[data-testid="message-container-${messageId}"]`);
        if (!messageElement) {
            console.log(`Message ${messageId} has been deleted`);
            chrome.runtime.sendMessage({ action: "messageDeleted", messageId: messageId });
        }
    });
}

observeMessages();
setInterval(checkDeletedMessages, 1000);
