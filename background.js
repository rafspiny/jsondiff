browser.browserAction.onClicked.addListener(() => {
    function onCreateTab(tab) {
        console.log('Created new tab: ' + tab.id)
    }

    function onError(error) {
        console.log('Error: ${error}');
    }
//    If tomorrow I want to point to the previous opened tab, I can use something like this
//    var querying = browser.tabs.query({url: "moz-extension://*/data/html/panel.html"});
//    querying.then(openMainTab, onError);
    var creating = browser.tabs.create({
        url:"/data/html/panel.html"
    });
    creating.then(onCreateTab, onError);
});