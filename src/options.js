$(document).ready(function() {
    options.init();
    options.restoreStorage();

    $("form").submit(function(event) {
        var params = $(this).serializeArray();
        options.setStorage(params);
        event.preventDefault();
    });
});

var options = (function() {

    var $succ, $err;

    function _notifacation($obj1, $obj2) {
        if ($obj2.is(':visible')) {
            $obj2.hide();
        }
        $obj1.show();
    }

    var init = function() {
        $err = $('.error');
        $succ = $('.success');
    },

    restoreStorage = function() {
        chrome.storage.local.get({ host: '192.168.3.12', delay: '1000', key: '' }, function(item) { 
            $('#host').val(item.host);
            $('#delay').val(item.delay);
            $('#key').val(item.key);
        });
    },

    setStorage = function(params) {
        
        var i = params.length - 1;
        var obj = {};

        while (i >= 0) {
            if (!params[i].value) {
                _notifacation($err, $succ);
                return;
            }
            obj[params[i].name] = params[i].value;
            i--; 
        } 
        chrome.storage.local.set(obj, function() {
            _notifacation($succ, $err);            
        });
    };

    return {
        'init': init,
        'restoreStorage' : restoreStorage,
        'setStorage' : setStorage
    };

})();