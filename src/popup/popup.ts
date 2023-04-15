'use strict';

async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  if (tabs.length === 0) {
    return null;
  }
  return tabs[0];
}

async function createUrlList(url: string): Promise<string[]> {
  const urlList = [url];
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
  return urlList;
}

async function onClickHandler(url: string): Promise<void> {
  const tabId = (await getCurrentTab())?.id;
  if (tabId == null) {
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (url) => {
      //window.history.pushState({}, "", window.location.href);
      window.location.href = url;
    },
    args: [url]
  }, () => {
    if (chrome.runtime.lastError) {
      // console.log(chrome.runtime.lastError);
    }
    window.close();
  });
}

async function buildPopup(urlList: string[]) {
  const main = document.getElementById("main") as HTMLDivElement;
  urlList.forEach((url: string | undefined) => {
    if (url == null) {
      return;
    }
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.margin = "0.0rem";
    div.style.padding = "0.5rem";
    // div.style.overflowWrap = "anywhere";
    // div.style.whiteSpace = "pre";
    // div.style.wordBreak = "break-all";
    // div.style.whiteSpace = "pre-wrap";
    div.style.width = "100%";
    div.style.borderBottom = "0.1rem solid #eee";

    // if clicked, open url in current tab
    div.addEventListener("click", async (event: MouseEvent) => {
      event.preventDefault();
      await onClickHandler(url);
    });
    div.style.cursor = "pointer";
    div.addEventListener("mouseover", (event: MouseEvent) => {
      div.style.backgroundColor = "#eee";
    });
    div.addEventListener("mouseout", (event: MouseEvent) => {
      div.style.backgroundColor = "#fff";
    });
    const link = document.createElement("a");
    link.href = url;
    link.innerText = url;
    link.addEventListener("click", async (event: MouseEvent) => {
      event.preventDefault();
      await onClickHandler(url);
    });
    div.appendChild(link);
    main.appendChild(div);
  });
}

async function DOMContentLoadedHandler() {
  let url = (await getCurrentTab())?.url;
  if (url == null) {
    return;
  }
  const urlList = await createUrlList(url);
  await buildPopup(urlList);
}

async function entry() {
  document.addEventListener("DOMContentLoaded", async () => {
    await DOMContentLoadedHandler();
  });
}

(async () => {
  await entry();
})();
