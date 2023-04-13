document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ type: "getUrlList" }, (response) => {
    const urlList = response.urls;
    const main = document.getElementById("main") as HTMLDivElement;
    urlList.forEach((url: string) => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.margin = "0.0rem";
      div.style.padding = "0.5rem";
      // div.style.overflowWrap = "anywhere";
      // div.style.whiteSpace = "pre";
      // div.style.wordBreak = "break-all";
      // div.style.whiteSpace = "pre-wrap";
      // div.style.width = "max(100%,max-content)";
      // div.style.width = "max-content";
      div.style.width = "100%";
      // div.style.wordBreak = "break-all";
      div.style.borderBottom = "0.1rem solid #eee";

      // if clicked, open url in current tab
      div.onclick = (event: MouseEvent) => {
        event.preventDefault();
        chrome.tabs.update({ url: url }, () => {
          window.close();
        });
      };
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
      link.addEventListener("click", (event: MouseEvent) => {
        event.preventDefault();
        chrome.tabs.update({ url: url }, () => {
          window.close();
        });
      });
      div.appendChild(link);
      main.appendChild(div);
    });
  });
});
