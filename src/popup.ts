document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ type: "getUrlList" }, (response) => {
    const urlList = response.urls;
    const main = document.getElementById("main") as HTMLDivElement;
    urlList.forEach((url: string) => {
      const div = document.createElement("div");
      div.style.margin = "0.5rem";
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
