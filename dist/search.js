// console.log("LOADED QUICK SEACH,", location.href, document.querySelector("body"));
var query = {};
var template = "\n<a href=\"#\" class=\"_bmsqc c-btn c-btn--small c-btn--red c-btn--block\" target=\"_BLANK\">Quick Search</a>";
function runtime() {
    var button = document.createElement('button');
    button.className = 'c-btn c-btn--small c-btn--red c-btn--block';
    button.innerText = "Quick Search";
    button.onclick = function (e) {
        console.log("Button Clicked", e.target);
    };
    console.log(button, document.querySelectorAll('.c-product-seller'));
    document.querySelectorAll('.c-product-seller')
        .forEach(function (v, i, a) {
        v.innerHTML = v.innerHTML + template;
    });
}
window.onload = function (state) {
    console.log("Ready STATE CHANGE", state);
    runtime();
    replaceXHR();
};
function replaceXHR() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        console.log('request started!');
        console.log('OPPX', arguments);
        this.addEventListener('load', function () {
            console.log('request completed!');
            console.log(this.readyState); //will always be 4 (ajax is completed successfully)
            console.log(this.responseText); //whatever the response was
        });
        origOpen.apply(this, arguments);
    };
}
chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.event == 'change') {
        query = msg.value;
        console.log("GOT MESSAGE", query);
    }
});
window.addEventListener('DOMContentLoaded', function () {
    console.log('CCCC', 'DOMContentLoaded');
});
window.addEventListener('change', function () {
    console.log('CCCC', 'change');
});
window.addEventListener('page:fetch', function () {
    console.log('CCCC', 'page:fetch');
});
