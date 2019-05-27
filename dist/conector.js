console.log("CONECTOR LOADED");
chrome.runtime.onMessage.addListener(function (msg, sender) {
    console.log("GOT MESSAGEEEEEEE", msg, document.querySelectorAll(".c-product-seller"));
});
window.addEventListener('message', function (e) {
    console.log("IXXM GOT MESSAGE", e.data);
});
