$(document).ready(function() {
    
    var $url = $('#url');
    var $success = $('.success');
    var $error= $('.error');

    restoreStorage($url);

    $('#save').click(function() {
        setStorage($url, $success, $error);
    });
});

function restoreStorage($url) {
    chrome.storage.local.get({ url: '192.168.3.14' },function(item) { 
        if (item.hasOwnProperty('url')) {
            $url.val(item.url);
        }
    });
}

function setStorage($url, $success, $error) {
    
    var url = $url.val();

    if (!url) {
        if ($success.is(':visible')) {
            $success.hide();
        }
        $error.show();
        return;
    }

    chrome.storage.local.set({ url: url }, function() {
        if ($error.is(':visible')) {
            $error.hide();
        }
        $success.show();
    });
}