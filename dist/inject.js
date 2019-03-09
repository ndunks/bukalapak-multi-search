console.log(this);
(function () {
    if (window['__bms_xhr_original']) {
        console.warn("INJECT ALREADY LOADEDED");
        return;
    }
    console.log("INJECT LOADEDED", window['_bmm_extension_id']);
    var template = "\n<a href=\"#\" class=\"_bmsqc c-btn c-btn--small c-btn--red c-btn--block\" target=\"_BLANK\">Search</a>";
    function runtime() {
        document.querySelectorAll('.c-card__head-actions')
            .forEach(function (v, i, a) {
            if (!v.querySelector('._bmsqc')) {
                v.innerHTML = v.innerHTML + template;
            }
        });
    }
    runtime();
    var port = chrome.runtime.connect("ehbcnpfahanolggopnpiejmlcmlimhbp");
    console.log(port);
    port.onMessage.addListener(function (msg, p) {
        console.log("Got messagefrom popup", msg);
    });
    port.postMessage("INJET CONECTED");
    window['__bms_xhr_original'] = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        var method = arguments[0];
        var url = arguments[1];
        if (url.indexOf('/search/headings/product') >= 0) {
            this.addEventListener('load', function () {
                runtime();
            });
        }
        window['__bms_xhr_original'].apply(this, arguments);
    };
    window.addEventListener('message', function (e) {
        console.log("WINDOWS GOT MESSAGE", e.data);
    });
})();
