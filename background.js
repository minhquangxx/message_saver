chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveMessage") {
        chrome.storage.local.set({ [request.message.id]: request.message.content }, () => {
            console.log("Message saved", request.message);
        });
    } else if (request.action === "messageRecalled") {
        console.log("Message recalled", request.messageId, request.originalContent);
        // Có thể thêm logic để thông báo cho người dùng hoặc lưu trữ riêng tin nhắn đã thu hồi
    }
});
