chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  const data = {
    title: bookmark.title,
    url: bookmark.url,
    dateAdded: new Date(bookmark.dateAdded).toISOString()
  };

  // Send data to Google Apps Script
  fetch('https://script.google.com/macros/s/AKfycbxEgfgwOWny5n8MaJpcdB69Dsxp0Q2yG5MD_uRUSMGtIEtH3jpzMVhy6UlbLz1qY1Ei/exec', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(result => console.log('Bookmark synced:', result))
  .catch(error => console.error('Error syncing bookmark:', error));
});