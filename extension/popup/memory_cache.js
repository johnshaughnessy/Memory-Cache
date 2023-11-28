const DOWNLOAD_SUBDIRECTORY = "MemoryCache";

/*
Generate a file name based on date and time
*/
function generateFileName(ext) {
  return (
    new Date().toISOString().concat(0, 19).replaceAll(":", ".") + "." + ext
  );
}

// Send a message to the content script.
//
// We need code to run in the content script context for anything
// that accesses the DOM or needs to outlive the popup window.
function send(message) {
  return new Promise((resolve, _reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(browser.tabs.sendMessage(tabs[0].id, message));
    });
  });
}

async function saveHtml() {
  const text = await send({ action: "getPageText" });
  const filename = `${DOWNLOAD_SUBDIRECTORY}/PAGE${generateFileName("html")}`;
  const file = new File([text], filename, { type: "text/plain" });
  const url = URL.createObjectURL(file);
  browser.downloads.download({ url, filename, saveAs: false });
}

function saveNote() {
  const text = document.querySelector("#text-note").value;
  const filename = `${DOWNLOAD_SUBDIRECTORY}/NOTE${generateFileName("txt")}`;
  const file = new File([text], filename, { type: "text/plain" });
  const url = URL.createObjectURL(file);
  browser.downloads.download({ url, filename, saveAs: false });

  document.querySelector("#text-note").value = "";
  browser.storage.local.set({ noteDraft: "" });
}

function debounce(func, delay) {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

function saveNoteDraft() {
  const noteDraft = document.querySelector("#text-note").value;
  browser.storage.local.set({ noteDraft });
}

document.getElementById("save-html-button").addEventListener("click", saveHtml);
document.getElementById("save-note-button").addEventListener("click", saveNote);
document
  .getElementById("text-note")
  .addEventListener("input", debounce(saveNoteDraft, 250));

browser.storage.local.get("noteDraft").then((res) => {
  if (res.noteDraft) {
    document.querySelector("#text-note").value = res.noteDraft;
  }
});
