// function addBookmark(id, title, url, description, tags) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   sheet.appendRow([id, title, url, description, tags]);
// }

// function doPost(e) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   var data = JSON.parse(e.postData.contents);
  
//   if (data.action === 'delete') {
//     // Find and delete the row with the matching ID
//     var values = sheet.getDataRange().getValues();
//     for (var i = values.length - 1; i >= 0; i--) {
//       if (String(values[i][0]) === data.id) {  // ID is in the first column
//         sheet.deleteRow(i + 1);
//         return ContentService.createTextOutput("Bookmark deleted successfully");
//       }
//     }
//     return ContentService.createTextOutput("Bookmark not found");
//   } else {
//     var params = JSON.parse(e.postData.contents);
//     addBookmark(params.id, params.title, params.url, params.description, params.tags);
//     return ContentService.createTextOutput(JSON.stringify({
//       message: "Success",
//       id: params.id
//     }));
//   }
// }

// // Run this function once to set up the sheet headers
// function setupSheetHeaders() {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   sheet.getRange(1, 1, 1, 5).setValues([["ID", "Title", "URL", "Description", "Tags"]]);
// }





// // TESTING

// function testDoPost() {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
//   // Clear the sheet before testing
//   sheet.clear();
//   setupSheetHeaders();
  
//   // Test adding a bookmark
//   var addEvent = {
//     postData: {
//       contents: JSON.stringify({
//         id: "test123",
//         title: "Test Bookmark",
//         url: "https://example.com",
//         description: "This is a test bookmark",
//         tags: "test,unit test"
//       })
//     }
//   };
  
//   var addResult = doPost(addEvent);
//   var addResponse = JSON.parse(addResult.getContent());
  
//   if (addResponse.message !== "Success" || addResponse.id !== "test123") {
//     throw new Error("Add bookmark test failed");
//   }
  
//   // Verify the bookmark was added to the sheet
//   var values = sheet.getDataRange().getValues();
//   if (values[1][0] !== "test123" || values[1][1] !== "Test Bookmark") {
//     throw new Error("Bookmark not added to sheet correctly");
//   }
  
//   // Test deleting a bookmark
//   var deleteEvent = {
//     postData: {
//       contents: JSON.stringify({
//         action: "delete",
//         id: "test123"
//       })
//     }
//   };
  
//   var deleteResult = doPost(deleteEvent);
//   if (deleteResult.getContent() !== "Bookmark deleted successfully") {
//     throw new Error("Delete bookmark test failed");
//   }
  
//   // Verify the bookmark was deleted from the sheet
//   values = sheet.getDataRange().getValues();
//   if (values.length > 1) {
//     throw new Error("Bookmark not deleted from sheet");
//   }
  
//   // Test deleting a non-existent bookmark
//   var nonExistentDeleteEvent = {
//     postData: {
//       contents: JSON.stringify({
//         action: "delete",
//         id: "nonexistent"
//       })
//     }
//   };
  
//   var nonExistentDeleteResult = doPost(nonExistentDeleteEvent);
//   if (nonExistentDeleteResult.getContent() !== "Bookmark not found") {
//     throw new Error("Non-existent bookmark delete test failed");
//   } 
// }