const toxicComments = [];
let currentFontSize = 60;
const storage = chrome.storage;

async function analyzeParagraph(paragraph) {
  console.log('analyzing paragraph:', paragraph.innerText.trim());
  chrome.runtime.sendMessage({
    method: 'analyzeParagraph',
    paragraph: paragraph.innerText.trim()
  }, function (response) {
    console.log('response received:', response);
    if (response.isToxic) {
      // If the paragraph is deemed toxic, highlight it in yellow
      paragraph.style.backgroundColor = '#FBFF49';
      paragraph.style.color = 'black';
      paragraph.style.fontSize = '100px';
      paragraph.style.fontWeight = 'bold';
      paragraph.style.fontSize = '60px';
      paragraph.style.lineHeight = '68px';
      paragraph.style.padding = '12px';
      toxicComments.push(paragraph.innerText.trim());
      console.log("pushed paragraph", paragraph.innerText.trim())

      paragraph.classList.add('bounce');


    }
  });
}

// Get all paragraphs on the page
const paragraphs = document.querySelectorAll('p,span')

// Loop through the paragraphs and analyze each one for toxicity
for (let i = 0; i < paragraphs.length; i++) {
  const paragraph = paragraphs[i];
  const text = paragraph.innerText.trim();
  if (text.length > 0) {
    analyzeParagraph(paragraph);
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === 'setFontSize') {
    const paragraphs = document.getElementsByTagName('p');

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].innerText.trim();
      if (toxicComments.includes(paragraph)) {
        paragraphs[i].style.fontSize = `${request.fontSize}px`;
        currentFontSize = request.fontSize;
        paragraphs[i].style.lineHeight = `${currentFontSize * 1.1}px`;
      }
    }
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getSelection") {
    sendResponse({ selection: window.getSelection().toString() });
  } else {
    sendResponse({});
  }
});

function saveComment(comment) {
  chrome.storage.sync.get('savedComments', function (data) {
    const savedComments = data.savedComments || [];
    savedComments.push(comment);
    chrome.storage.sync.set({ savedComments }, function () {
      chrome.runtime.sendMessage({ method: 'updatePopup' });
    });
  });
}
