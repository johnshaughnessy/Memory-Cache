function getPageText() {
  const head = document.head.innerHTML;
  const body = document.body.innerText;
  return `<!DOCTYPE html>\n<head>\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>`;
}

// Use html2pdf to generate a PDF of the current page.
//
// We import the following scripts (in order):
//
//   "es6-promise.auto.min.js",
//   "jspdf.min.js",
//   "html2canvas.min.js",
//   "html2pdf.min.js",
async function getPagePdf() {
  console.log("hello, world");
  console.log(window.html2pdf);
  console.log("D");
  console.log(html2pdf);
  const body = document.body;
  console.log(body);
  try {
    await html2pdf(body);
  } catch (e) {
    console.error(e);
    console.error("[MemoryCache Extension] Failed to generate PDF.");
  }
  return null;
}

browser.runtime.onMessage.addListener((message, _sender) => {
  console.log("[MemoryCache Extension] Received message:", message);
  if (message.action === "getPageText") {
    return Promise.resolve(getPageText());
  } else if (message.action === "getPagePdf") {
    console.log("c!");
    return Promise.resolve(getPagePdf());
  }

  console.log("d!");
});
