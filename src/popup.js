$(document).ready(function() {
    $('#options').click(popup.showOptions);
    $('#hide_icon').click(popup.hideBrowserAction);
    $('#open, #title').click(popup.redirectToRedmine);
    $('#new_issues').click(popup.redirectToTodayIssues);
    $('#issues ul').on('click', 'li', popup.redirectToIssue);
    popup.getResponse();
});

var popup = (function() {
    
    var message = 'getIssuesCount';
    
    hideBrowserAction = function() {
        var $info = $('.info');
        if ($info.is(':visible')) {
            $info.slideUp('slow');
        } else {
            $info.slideDown('slow');
        }
    },

    showOptions = function() {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL("../views/options.html"));
        }
    },

    redirectToRedmine = function() {
        chrome.storage.local.get({ host: '192.168.3.12' }, function(item) { 
            chrome.tabs.create({ url: item.host });
        });
    },

    redirectToTodayIssues = function() {
        chrome.storage.local.get({ host: '192.168.3.12' }, function(item) {
            var url = `${item.host}/issues?utf8=%E2%9C%93&set_filter=1&f%5B%5D=status_id&op%5Bstatus_id%5D=*&f%5B%5D=created_on&op%5Bcreated_on%5D=%3D&v%5Bcreated_on%5D%5B%5D=${chrome.extension.getBackgroundPage()._getCurrentDate()}`;
            chrome.tabs.create({ url: url });
        });
    },

    redirectToIssue = function() {
        var id = $(this).attr('id');
        chrome.storage.local.get({ host: '192.168.3.12' }, function(item) {
            var url = `${item.host}/issues/${id}`;
            chrome.tabs.create({ url: url });
        });
    }

    getResponse = function() {
        chrome.runtime.sendMessage(message, _responseCallback);
    },

    _responseCallback = function(obj) {
        var length = obj.length;
        var html = '';
        if (length == 0) {
            html = '<li class="alert">Brak danych do wyświetlania</li>';
            chrome.browserAction.setBadgeText({'text': ''});
        } else {
            for (var i = 0; i < length; i++) {
                html += `<li class="entery" id="${obj[i].title}"><span class='new'>#${obj[i].title}</span> ${obj[i].message}</li>`
            }
        }
        $('#issues ul').html(html);
        $('#new_issues .count').html(length);
    };

    return {
        'hideBrowserAction' : hideBrowserAction,
        'showOptions' : showOptions,
        'getResponse' : getResponse,
        'redirectToRedmine' : redirectToRedmine,
        'redirectToTodayIssues' : redirectToTodayIssues,
        'redirectToIssue' : redirectToIssue
    };
})();




