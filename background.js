chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveMessage") {
        chrome.storage.local.set({ [request.message.id]: request.message.content }, () => {
            console.log("Message saved", request.message);
        });
    } else if (request.action === "messageDeleted") {
        chrome.storage.local.get(request.messageId, (result) => {
            console.log("Deleted message content:", result[request.messageId]);
        });
    }
});

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes('facebook.com') || details.url.includes('messenger.com')) {
        chrome.tabs.sendMessage(details.tabId, { action: "pageLoaded" });
    }
});
