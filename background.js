chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: "index.html",
    type: "popup",
    width: 600,
    height: 700
  });
});
