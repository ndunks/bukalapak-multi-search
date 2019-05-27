console.log("CONECTOR LOADED");

chrome.runtime.onMessage.addListener(
    (msg, sender) => {
        console.log("GOT MESSAGEEEEEEE", msg, document.querySelectorAll(".c-product-seller"))
    }
)

window.addEventListener('message', (e) => {
    console.log("IXXM GOT MESSAGE", e.data);
})