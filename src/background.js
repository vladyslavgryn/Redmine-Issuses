chrome.browserAction.onClicked.addListener(function() {
    showNotification('Runtime');
});


function getServerUrl() {
    chrome.storage.local.get({ url: '192.168.3.14'}, function(item) {
    });
}

function showNotification(message) {
    var opt = {
        type: "basic",
        title: "Dodano nowe zgłoszenie",
        message: message,
        iconUrl: "../images/icon48.png"
    }
    chrome.notifications.create(opt, function(id) {
        console.log(id);
    });
}


