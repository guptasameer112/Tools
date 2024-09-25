function appendBookmarkData(bookmarks) {
  chrome.storage.sync.get('bookmark', (data) => {
    if (data.bookmark) {
      const sheet = SpreadsheetApp.getActive().getSheetByName("Tools")
      const row = sheet.getLastRow() + 1;
      
      // Append data to the sheet
      sheet.getRange(row, 1).setValue(data.bookmark.url);
    }
  });
}

function getBookmarkData() {
  const folders = ['Tools', 'Learning'];
  const bookmarks = chrome.bookmarks.getTree((tree) => {
    tree.forEach((node) => {
      if (node.id === folders[0]) {
        console.log(node.children);
        appendBookmarkData(node.children);
      }
    });
  });
}