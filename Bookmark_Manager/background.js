import { GEMINI_API_KEY } from './secrets.js';

async function generateDescription(title, url) {
  const prompt = `Generate a one-line description (as few words as possible) for a bookmark with the title "${title}" and URL "${url}". The description should help a person instantly understand what the bookmark is used for.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

function getBookmarkPath(bookmarkId) {
  return new Promise((resolve) => {
    function getFullPath(id, path = []) {
      chrome.bookmarks.get(id, (bookmark) => {
        if (bookmark[0].parentId) {
          path.unshift(bookmark[0].title);
          getFullPath(bookmark[0].parentId, path);
        } else {
          resolve(path);
        }
      });
    }
    getFullPath(bookmarkId);
  });
}

function isInAllowedFolder(path) {
  return path.includes('Tools') || path.includes('Learning');
}

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  try {
    const path = await getBookmarkPath(id);
    
    if (!isInAllowedFolder(path)) {
      console.log('Bookmark not in Tools or Learning folder. Skipping.');
      return;
    }

    const description = await generateDescription(bookmark.title, bookmark.url);
    
    console.log("Generating bookmark with ID:", id);
    const data = {
      id: id.toString(),
      title: bookmark.title,
      url: bookmark.url,
      description: description,
      tags: path.join('/')
    };
    
    console.log('Sending create request to Google Apps Script:', data);
    
    // Send data to Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbwpQlSVs2LoN2c3pTUI8g-5gILNUosyThmk8zq_goCN06Ld2JKS4cn6VUbvrT1-F2Y/exec', {
      mode: "no-cors",
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.message == "Success") {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
      console.log('Bookmark synced:', response.message);
    }
  } catch (error) {
    console.error('Error syncing bookmark:', error);
  }
});

// Add this new event listener for bookmark deletion
chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  console.log('Bookmark removal detected. ID:', id);
  try {
    const data = {
      action: "delete",
      id: id.toString() // Ensure id is a string
    };

    console.log('Sending delete request to Google Apps Script:', data);

    const response = await fetch('https://script.google.com/macros/s/AKfycbwpQlSVs2LoN2c3pTUI8g-5gILNUosyThmk8zq_goCN06Ld2JKS4cn6VUbvrT1-F2Y/exec', {
      mode: "no-cors",
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.message == "Success") {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
      console.log('Bookmark deleted:', response.message);
    }

  } catch (error) {
    console.error('Error deleting bookmark from sheet:', error);
  }
});