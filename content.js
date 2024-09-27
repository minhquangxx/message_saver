function observeMessages() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Kiểm tra tin nhắn đến
                        const incomingMessage = node.querySelector('[data-testid="messenger_incoming_text_row"]');
                        if (incomingMessage) {
                            saveMessage(incomingMessage.textContent, 'incoming');
                        }

                        // Kiểm tra tin nhắn đi
                        const outgoingMessage = node.querySelector('[data-testid="messenger_outgoing_text_row"]');
                        if (outgoingMessage) {
                            saveMessage(outgoingMessage.textContent, 'outgoing');
                        }

                        // Kiểm tra các loại tin nhắn khác (hình ảnh, file, v.v.)
                        const mediaMessage = node.querySelector('[data-testid="messenger_attachment_image"]');
                        if (mediaMessage) {
                            saveMessage('Media message', 'media');
                        }
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

function saveMessage(text, type) {
    const message = {
        text: text,
        type: type,
        timestamp: new Date().toISOString(),
        conversationId: getConversationId()
    };
    chrome.runtime.sendMessage({ action: "saveMessage", message: message });
}

function getConversationId() {
    // Cố gắng lấy ID cuộc trò chuyện từ URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tid') || 'unknown';
}

// Chụp ảnh màn hình
function captureScreenshot() {
    chrome.runtime.sendMessage({ action: "captureScreenshot" }, (response) => {
        if (response && response.imageDataUrl) {
            saveMessage(response.imageDataUrl, 'screenshot');
        }
    });
}

// Thực hiện chụp ảnh màn hình định kỳ
setInterval(captureScreenshot, 30000); // Mỗi 30 giây

observeMessages();

// Theo dõi các thay đổi trong DOM để phát hiện tin nhắn bị xóa
function observeDeletedMessages() {
    const deleteObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.classList.contains('message-in') || node.classList.contains('message-out'))) {
                        saveMessage('Message deleted', 'deleted');
                    }
                });
            }
        });
    });

    const deleteConfig = { childList: true, subtree: true };
    deleteObserver.observe(document.body, deleteConfig);
}

observeDeletedMessages();
// Lưu trữ tức thì mọi tin nhắn
function instantSaveAllMessages() {
    const allMessages = document.querySelectorAll('[data-testid^="message-container-"]');
    allMessages.forEach(message => {
        const text = message.textContent;
        const type = message.classList.contains('message-in') ? 'incoming' : 'outgoing';
        saveMessage(text, type);
    });
}

// Thực hiện lưu trữ tức thì mỗi 100ms
setInterval(instantSaveAllMessages, 100);

// Theo dõi các yêu cầu mạng
const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function () {
    const xhr = new originalXHR();
    xhr.addEventListener('load', function () {
        if (this.responseURL.includes('graphql')) {
            try {
                const response = JSON.parse(this.responseText);
                // Phân tích response để tìm và lưu tin nhắn
                // Cần phát triển logic phân tích cụ thể tùy thuộc vào cấu trúc response
            } catch (e) {
                console.error('Error parsing XHR response', e);
            }
        }
    });
    return xhr;
};
