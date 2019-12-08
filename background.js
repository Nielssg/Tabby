chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({ url: "src/options.html" });
});