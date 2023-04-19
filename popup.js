
const slider = document.getElementById('font-size-slider');
slider.addEventListener('input', (event) => {
  const fontSize = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { method: 'setFontSize', fontSize });
  });
});

