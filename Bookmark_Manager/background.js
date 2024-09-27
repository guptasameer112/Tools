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
    chrome.bookmarks.get(bookmarkId, (bookmark) => {
      if (bookmark[0].parentId) {
        chrome.bookmarks.get(bookmark[0].parentId, (parent) => {
          resolve(parent[0].title);
        });
      } else {
        resolve("Root");
      }
    });
  });
}

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  try {
    const [path, description] = await Promise.all([
      getBookmarkPath(id),
      generateDescription(bookmark.title, bookmark.url)
    ]);

    const data = {
      title: bookmark.title,
      url: bookmark.url,
      description: description,
      tags: path
    };

    // Send data to Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbxEgfgwOWny5n8MaJpcdB69Dsxp0Q2yG5MD_uRUSMGtIEtH3jpzMVhy6UlbLz1qY1Ei/exec', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await response.text();
    console.log('Bookmark synced:', result);
  } catch (error) {
    console.error('Error syncing bookmark:', error);
  }
});