document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('titleInput');
    const submitBtn = document.getElementById('submitBtn');
    const statusElement = document.getElementById('status');
  
    // Get the current tab's title and URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      titleInput.value = currentTab.title;
    });
  
    submitBtn.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const data = {
          title: titleInput.value,
          url: currentTab.url,
          dateAdded: new Date().toISOString()
        };
  
        // Send data to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbxEgfgwOWny5n8MaJpcdB69Dsxp0Q2yG5MD_uRUSMGtIEtH3jpzMVhy6UlbLz1qY1Ei/exec', {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
          statusElement.textContent = 'Bookmark saved successfully!';
          setTimeout(() => { window.close(); }, 2000);
        })
        .catch(error => {
          console.error('Error:', error);
          statusElement.textContent = 'Error saving bookmark.';
        });
      });
    });
  });