function fallbackCopyTextToClipboard(text: string) {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      resolve(successful);
    } catch (err) {
      reject(err);
    }

    document.body.removeChild(textArea);
  });
}

export default async function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    await fallbackCopyTextToClipboard(text);
    return;
  }

  return navigator.clipboard.writeText(text);
}
