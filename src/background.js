chrome.alarms.create('getIssuses', { when : Date.now() + 6000, periodInMinutes : 1 });
chrome.alarms.onAlarm.addListener(_alarmCallback);
chrome.runtime.onMessage.addListener(_onMessageCallback);

/**
 * Callback onAlarm
 */
function _alarmCallback(alarm) {
    if (alarm.name === 'getIssuses') {
        console.log(alarm);
        _showNotification();
    }
}

/**
 * Callback onMessage
 */
function _onMessageCallback(message, sender, sendResponse) {
    if (message === 'getIssusesCount') {
        chrome.storage.local.get(['host', 'key'], function(item) {
            var url = `${item.host}/issues.json?created_on=${_getCurrentDate()}&status_id=*&key=${item.key}`;
            var promise = _getIssusesAsync(url);
            promise.then(function(success) {
                var resp = JSON.parse(success);
                sendResponse({ today_issuses : 12, new_issuses : resp.total_count });
            }, function(error) {
                console.log(error);
            });
                   
        });
        return true;
    }
}

/**
 * Generate current date
 * @return string
 */
function _getCurrentDate() {
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

function _showNotification() {

    var opt = {
        type: "basic",
        title: "Dodano nowe zgłoszenie",
        message: 'asdasdasd',
        contextMessage: 'asdasds',
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


function _getIssusesAsync(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.response);     
            } else {
                reject('Błąd pobierania danych');
            }
        };
        xhr.onerror = function() {
            reject('Błąd pobierania danych');
        };
        xhr.send();
    });
}

