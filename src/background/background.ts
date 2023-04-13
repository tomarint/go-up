chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getUrlList") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      const urlList = [currentUrl];
      let url = currentUrl;
      if (url != null) {
        // Check if url contains # or ? and remove them
        if (url.indexOf("#") > 0) {
          url = url.substring(0, url.indexOf("#"));
          urlList.push(url);
        }
        if (url.indexOf("?") > 0) {
          url = url.substring(0, url.indexOf("?"));
          urlList.push(url);
        }
        // Remove last slash of url
        if (url.endsWith("/") && !url.endsWith("//")) {
          url = url.substring(0, url.length - 1);
        }
        // Remove last directory of url
        let idx = 0;
        while ((idx = url.lastIndexOf("/")) > 0) {
          if (idx > 0 && url.substring(idx - 1, idx) === "/") {
            break;
          }
          url = url.substring(0, idx);
          urlList.push(url);
        }
        sendResponse({ urls: urlList });
      }
    });
    return true;
  }
  sendResponse({ });
});
