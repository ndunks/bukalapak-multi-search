var values = {};
var tab;
var inject = function (e) {
    var myId = location.host;
    var myscriptUrl = location.href.substr(0, location.href.indexOf(location.pathname)) + '/dist/inject.js#' +
        encodeURIComponent(JSON.stringify(values));
    var actualCode = "\n    var s = document.createElement('script');\n    s.src = '" + myscriptUrl + "';\n    s.onload = function() {\n        window['_bms_values'] = JSON.parse(decodeURIComponent(this.src.substr(this.src.indexOf('#')+1)));\n        console.log(window['_bms_values']);\n        window['_bms_inject']();\n    };\n    (window.document.head || window.document.documentElement).appendChild(s);\n";
    chrome.tabs.executeScript(tab.id, {
        code: actualCode
    });
};
document.querySelector('#ok_button').onclick = inject;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs.length)
        return;
    tab = tabs[0];
    document.querySelectorAll('input').forEach(function (v) {
        v.onchange = v.onkeyup = v.onpaste = inputChanged;
        if (localStorage[v.name]) {
            v.value = localStorage[v.name];
            values[v.name] = v.value;
        }
    });
    onValueChanged();
    chrome.runtime.onMessageExternal.addListener(function (msg, sender, response) {
        console.log("GOT MESSAGE", msg);
        response(values);
    });
    chrome.runtime.onMessage.addListener(function (msg, sender) {
        console.log("GOTTTTTTTTTTTTTTTTTT", msg);
    });
});
function onValueChanged() {
    var query = Object.keys(values)
        .map(function (v, i, a) { return "search[" + v + "]=" + values[v]; });
    chrome.runtime.sendMessage(values);
    chrome.tabs.executeScript(tab.id, {
        code: "window._bms_last_query = '/?" + encodeURI(query.join('&')) + "';\n        document.querySelectorAll('._bmsqc').forEach(\n        v => v.href = v.parentElement.parentElement.parentElement.querySelector('.c-product-seller a').href\n             + _bms_last_query\n    )"
    });
}
function updateValue(name, value) {
    if (values[name] != value) {
        values[name] = value;
        /* chrome.tabs.sendMessage(tab.id, {
            event: "change",
            value: values
        }) */
        onValueChanged();
        // chrome.storage.local.set(values)
        Object.keys(values).forEach(function (v) { return localStorage[v] = values[v]; });
    }
}
var inputChanged = function (e) {
    var target = e.target;
    updateValue(target.name, target.value.trim());
};
