chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getUrlList") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      const urlList = [currentUrl];
      let url = currentUrl;
      if (url != null) {
        while (url.lastIndexOf("/") > 7) {
          url = url.substring(0, url.lastIndexOf("/"));
          urlList.push(url);
        }
        sendResponse({ urls: urlList });
      }
    });
    return true;
  }
  sendResponse({ });
});
