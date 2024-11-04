import { getCurrentTab, updateTab } from '../utils/tabs';
import { createUrlList } from '../utils/urls';

async function onClickHandler(url: string): Promise<void> {
  const tabId = (await getCurrentTab())?.id;
  if (tabId == null) {
    return;
  }
  await updateTab(tabId, { url: url });
  window.close();
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
    div.style.boxSizing = "border-box";
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
