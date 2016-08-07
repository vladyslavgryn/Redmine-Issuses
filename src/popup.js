$(document).ready(function() {
    popup.init();
    $('#options').click(popup.showOptions);
    $('#hide_icon').click(popup.hideBrowserAction);
    $('#open, #title').click(popup.redirect);
    popup.getResponse();
});

var popup = (function() {
    
    var $info;
    
    var init = function() {
        $info = $('.info');
        $todayIssuses = $('#today_issuses');
        $newIssuses = $('#new_issuses');
    },
    
    hideBrowserAction = function() {
        console.log($info);
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

    redirect = function() {
        chrome.storage.local.get({ host: '192.168.3.12' }, function(item) { 
            chrome.tabs.create({ url: item.host });
        });
    },

    getResponse = function() {
        chrome.runtime.sendMessage({ request: "issuses" }, function(response) {
            $todayIssuses.text(response.today_issuses);
            $newIssuses.text(response.new_issuses);
        });
    }

    return {
        'hideBrowserAction' : hideBrowserAction,
        'showOptions' : showOptions,
        'getResponse' : getResponse,
        'redirect' : redirect,
        'init' : init
    };
})();




