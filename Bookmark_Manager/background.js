// Function to handle bookmark changes
function handleBookmarkChange(id, info) {
    if (info.url) {
      chrome.storage.sync.get('bookmark', (data) => {
        const bookmark = data.bookmark || {};
        bookmark.url = info.url;
        bookmark.title = info.title;
  
        // Save the updated bookmark data
        chrome.storage.sync.set({ bookmark }, () => {
          chrome.runtime.sendMessage({ action: 'updateBookmark' });
        });
      });
    }
  }
  
  // Function to handle incoming messages
  function handleMessage(request, sender, sendResponse) {
    if (request.action === 'updateBookmark') {
      // Handle the updateBookmark action
      console.log('Bookmark updated');
    }
    // Handle other actions if needed
  }
  
  // Add listeners for bookmark changes and messages
  chrome.bookmarks.onChanged.addListener(handleBookmarkChange);
  chrome.runtime.onMessage.addListener(handleMessage);