document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(null, function (items) {
        let messageList = document.getElementById('messageList');
        for (let id in items) {
            let li = document.createElement('li');
            li.textContent = `${id}: ${items[id]}`;
            messageList.appendChild(li);
        }
    });

    document.getElementById('clearBtn').addEventListener('click', function () {
        chrome.storage.local.clear(function () {
            let messageList = document.getElementById('messageList');
            messageList.innerHTML = '';
        });
    });
});
