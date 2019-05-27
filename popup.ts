const values = {};
let tab: chrome.tabs.Tab;

let inject = (e: MouseEvent) => {
    let myId = location.host
    let myscriptUrl = location.href.substr(0, location.href.indexOf(location.pathname)) + '/dist/inject.js#' +
        encodeURIComponent( JSON.stringify(values) );
    const actualCode = `
    var s = document.createElement('script');
    s.src = '${myscriptUrl}';
    s.onload = function() {
        window['_bms_values'] = JSON.parse(decodeURIComponent(this.src.substr(this.src.indexOf('#')+1)));
        console.log(window['_bms_values']);
        window['_bms_inject']();
    };
    (window.document.head || window.document.documentElement).appendChild(s);
`;

    chrome.tabs.executeScript(tab.id, {
        code: actualCode
    })

}
( document.querySelector('#ok_button') as HTMLButtonElement ).onclick = inject;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs.length) return;

    tab = tabs[0];


    document.querySelectorAll('input').forEach(
        (v) => {
            v.onchange = v.onkeyup = v.onpaste = inputChanged
            if (localStorage[v.name]) {
                v.value = localStorage[v.name];
                values[v.name] = v.value;
            }
        })
    onValueChanged()

    chrome.runtime.onMessageExternal.addListener(
        (msg, sender, response) => {
            console.log("GOT MESSAGE", msg);
            response(values)
        }
    )
    chrome.runtime.onMessage.addListener(
        (msg, sender) => {
            console.log("GOTTTTTTTTTTTTTTTTTT", msg);

        }
    )
});
function onValueChanged() {
    let query = Object.keys(values)
        .map((v, i, a) => `search[${v}]=${values[v]}`);
    chrome.runtime.sendMessage(values)
    chrome.tabs.executeScript(tab.id, {
        code:
            `window._bms_last_query = '/?${encodeURI(query.join('&'))}';
        document.querySelectorAll('._bmsqc').forEach(
        v => v.href = v.parentElement.parentElement.parentElement.querySelector('.c-product-seller a').href
             + _bms_last_query
    )`
    })

}

function updateValue(name, value) {
    if (values[name] != value) {
        values[name] = value
        /* chrome.tabs.sendMessage(tab.id, {
            event: "change",
            value: values
        }) */
        onValueChanged()
        // chrome.storage.local.set(values)
        Object.keys(values).forEach(
            (v) => localStorage[v] = values[v]
        )
    }
}

let inputChanged = (e: Event) => {
    let target: HTMLInputElement = e.target as any;
    updateValue(target.name, target.value.trim())
}
