var count = 0;

chrome.alarms.create('getIssues', { when : Date.now() + 6000, periodInMinutes : 1 });
chrome.alarms.onAlarm.addListener(_alarmCallback);
chrome.runtime.onMessage.addListener(_onMessageCallback);

/**
 * Callback onAlarm
 */
function _alarmCallback(alarm) {
    if (alarm.name === 'getIssues') {
        chrome.storage.local.get(['host', 'key'], function(item) {

            var url = `${item.host}/issues.json?created_on=${_getCurrentDate()}&status_id=*&key=${item.key}`;
            var promise = _getIssuesAsync(url);

            promise.then(function(success) {

                var obj = JSON.parse(success);
                console.log(count);
                if (count < obj.total_count && obj.total_count != 0) {
                    var data = _checkNewIssues(obj);
                    if (data.length > 0) {
                        _showNotification(data);
                    }
                    count = obj.total_count;
                }
                
            }, function(error) {
                console.log(error);
            });
                   
        });
    }
}

function _checkNewIssues(obj) {
    var newIssues = [];

    for (var i = 0; i < obj.issues.length; i++) {
        if (obj.issues[i].status.id == 1) {
            newIssues.push({   
                'title' : `${obj.issues[i].id}`, 
                'message' : `${obj.issues[i].subject}`
            });
        }
    }
    return newIssues;
}

/**
 * Callback onMessage
 */
function _onMessageCallback(message, sender, sendResponse) {
    if (message === 'getIssuesCount') {
        chrome.storage.local.get(['host', 'key'], function(item) {

            var url = `${item.host}/issues.json?created_on=${_getCurrentDate()}&status_id=*&key=${item.key}`;
            var promise = _getIssuesAsync(url);

            promise.then(function(success) {
                var obj = JSON.parse(success);
                sendResponse(_checkNewIssues(obj));
                
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

function _showNotification(obj) {

    var opt = {
        type: "list",
        title: "Dodano nowe zgłoszenie",
        message: 'asdasdasd',
        iconUrl: "images/icon48.png",
        items: obj
    };

    chrome.notifications.create('issues', opt, function(id) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
        }
        chrome.browserAction.setBadgeText({ text: obj.length.toString() });
    });
}


function _getIssuesAsync(url) {

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

