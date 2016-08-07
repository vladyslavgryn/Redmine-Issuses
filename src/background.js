var xhr = new XMLHttpRequest();

function showNotification(author, message) {

    var opt = {
        type: "basic",
        title: "Dodano nowe zgłoszenie",
        message: author,
        contextMessage: message,
        iconUrl: "images/icon48.png"
    };

    chrome.notifications.create('', opt, function(id) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
        }
        chrome.browserAction.setBadgeText({text: '1'});
    });
}
function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return `${yyyy}-${mm}-${dd}`;
}
chrome.storage.local.get(['host', 'key'], function(item) {
    var url = `${item.host}/issues.json?created_on=2016-08-04&key=${item.key}`;
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                if (request.request == "issuses") {
                    console.log(response.total_count);
                    sendResponse({
                        today_issuses: response.total_count,
                        new_issuses: response.total_count
                    });
                }
            });
        }
    };
    xhr.send();       
});

