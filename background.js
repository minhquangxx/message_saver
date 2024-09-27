chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveMessage") {
        chrome.storage.local.get({ messages: [] }, (result) => {
            let messages = result.messages;
            messages.push(request.message);
            chrome.storage.local.set({ messages: messages }, () => {
                console.log("Message saved");
            });
        });
    }
});

// Theo dõi các yêu cầu mạng
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.method === "POST" && details.url.includes("facebook.com/api/graphql/")) {
            // Xử lý yêu cầu GraphQL
            console.log("GraphQL request:", details);
            // Ở đây bạn có thể thêm logic để phân tích và lưu trữ dữ liệu từ các yêu cầu GraphQL
        }
    },
    { urls: ["https://*.facebook.com/*", "https://*.messenger.com/*"] },
    ["requestBody"]
);
