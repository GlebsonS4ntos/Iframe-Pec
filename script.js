window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = "<div style='font-family: sans-serif; padding: 10px;'>Teste!</div>";
  iframe.style.position = "fixed";
  iframe.style.top = "60px";
  iframe.style.right = "20px";
  iframe.style.width = "300px";
  iframe.style.height = "120px";
  iframe.style.border = "none";
  iframe.style.background = "white";
  iframe.style.zIndex = "9999";
  document.body.appendChild(iframe);
});