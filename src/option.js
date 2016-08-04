$(document).ready(function() {
    
    var $url = $('#url');
    var $delay = $('#delay');
    var $success = $('.success');
    var $error= $('.error');

    restoreStorage($url, $delay);

    $('#save').click(function() {
        setStorage($url, $delay, $success, $error);
    });
});

function restoreStorage($url, $delay) {
    chrome.storage.local.get({ url: '192.168.3.14', delay: '1000' },function(item) { 
        $url.val(item.url);
        $delay.val(item.delay);
    });
}

function setStorage($url, $delay, $success, $error) {
    
    var url = $url.val();
    var delay = $delay.val();

    if (!url || !delay) {
        if ($success.is(':visible')) {
            $success.hide();
        }
        $error.show();
        return;
    }

    chrome.storage.local.set({ url: url, delay: delay }, function() {
        if ($error.is(':visible')) {
            $error.hide();
        }
        $success.show();
    });
}