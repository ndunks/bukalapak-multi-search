var template = "<a href=\"#\" class=\"_bmsqc c-btn c-btn--small c-btn--red c-btn--block\" target=\"_BLANK\">Search</a>";
window['_bms_inject'] = function () {
    if (!window['_bms_values']) {
        console.error("No BMS VALUED");
        return;
    }
    var query = Object.keys(window['_bms_values'])
        .map(function (v, i, a) { return "search[" + v + "]=" + window['_bms_values'][v]; });
    document.querySelectorAll('.c-card__head-actions').forEach(function (v, i, a) {
        if (!v.querySelector('._bmsqc')) {
            v.innerHTML = v.innerHTML + template;
        }
    });
    document.querySelectorAll('._bmsqc').forEach(function (v, i, a) {
        v.href = v.parentElement.parentElement.parentElement.querySelector('.c-product-seller a').href + query;
    });
};
if (!window['_bms_listener']) {
    window['_bms_listener'];
    window.addEventListener('message', function (e) {
        console.log("WINDOWS GOT MESSAGE", e.data);
        if (e.data && e.data.eventId && !e.data.value) {
            // got reload trigered?
            window['_bms_inject']();
        }
    });
}
