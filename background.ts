chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.id, {
		file: 'dist/inject.js'
	});
});
console.log("BACKGRON LLOAD");

chrome.tabs.getCurrent(
    (e) => {
        console.log("TABBB", e);
    
    }
)
