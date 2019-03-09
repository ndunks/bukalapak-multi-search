var values = {};
var tab;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs.length)
        return;
    tab = tabs[0];
    var myId = location.host;
    var myscriptUrl = location.href.substr(0, location.href.indexOf(location.pathname)) + '/dist/inject.js';
    var actualCode = "\n        var s = document.createElement('script');\n        s.src = '" + myscriptUrl + "#{" + myId + "}';\n        s.class='_bms_script';\n        s.onload = function() {\n            this.remove();\n        };\n        (window.document.head || window.document.documentElement).appendChild(s);\n  ";
    chrome.tabs.executeScript(tab.id, {
        code: actualCode,
        frameId: 0
    });
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
});
function onValueChanged() {
    var query = Object.keys(values)
        .map(function (v, i, a) { return "search[" + v + "]=" + values[v]; });
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
