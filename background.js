const API_KEY = 'AIzaSyAGOZpBtg025JFWrY9vl7cPij1ZbI4mgN4';
const DISCOVERY_DOCS = ["https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1"];


function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load('https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1');
}

chrome.runtime.onInstalled.addListener(() => {
  loadClient().then(() => {
    console.log('API client loaded for extension');
  }, (error) => {
    console.error('Error loading API client:', error);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received message:', request);
  if (request.method === 'analyzeParagraph') {
    const analyzeRequest = {
      comment: {
        text: request.paragraph,
      },
      requestedAttributes: {
        TOXICITY: {},
      },
      languages: ["en"]
    };

    gapi.client.commentanalyzer.comments.analyze({
      resource: analyzeRequest,
    }).then((response) => {
      console.log('sending response:', response.result.attributeScores.TOXICITY.summaryScore.value);
      sendResponse({
        isToxic: response.result.attributeScores.TOXICITY.summaryScore.value >= 0.4
      });
    }).catch((error) => {
      console.error('Error analyzing paragraph:', error);
      sendResponse({
        isToxic: false
      });
    });

    return true; // indicate that the response will be sent asynchronously
  }
});
