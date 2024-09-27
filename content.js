let savedMessages = {};

function saveMessage(messageElement) {
    const messageId = messageElement.getAttribute('id');
    const content = messageElement.textContent;
    savedMessages[messageId] = content;
    chrome.runtime.sendMessage({ action: "saveMessage", message: { id: messageId, content: content } });
}

function observeMessages() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const messageElement = mutation.target.closest('[data-testid^="message-container-"]');
                if (messageElement) {
                    saveMessage(messageElement);
                    checkForRecalledMessage(messageElement);
                }
            }
        });
    });

    const config = { childList: true, subtree: true, characterData: true };
    observer.observe(document.body, config);
}

function checkForRecalledMessage(messageElement) {
    const messageId = messageElement.getAttribute('id');
    const currentContent = messageElement.textContent;
    if (savedMessages[messageId] && currentContent.includes("đã thu hồi một tin nhắn")) {
        console.log(`Message ${messageId} has been recalled. Original content: ${savedMessages[messageId]}`);
        chrome.runtime.sendMessage({ action: "messageRecalled", messageId: messageId, originalContent: savedMessages[messageId] });
    }
}

// Khởi tạo observer khi trang đã load
window.addEventListener('load', observeMessages);
