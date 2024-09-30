function getKeyValueData(sheet) {
  // Get all values from the sheet
  var data = sheet.getDataRange().getValues();

  var keys = data[0]; // First row as keys
  var result = [];

  // Loop through the data starting from the second row (index 1)
  for (var i = 1; i < data.length; i++) {
    var item = {};
    for (var j = 0; j < sheet.getLastColumn(); j++) {
      item[keys[j]] = data[i][j]; // Assign each value to the corresponding key
    }
    result.push(item); // Add the item to the result array
  }

  // Log the result object
  // Logger.log("Result: " + JSON.stringify(result, null, 2)); // Pretty print the result with indentation

  return result;
}

// Get key-value arrays from sheet by ss_id and sheet_name
function getKeyValueDataById(ss_id, sheet_name) {
  var sheet = SpreadsheetApp.openById(ss_id).getSheetByName(sheet_name); // Replace 'User' with your sheet name
  return getKeyValueData(sheet);
}

// temp code
function importCSVFromURL() {
  var url =
    "https://docs.google.com/spreadsheets/d/1qg-z1jd3QfjhbOvhFXyTr00bpjd5RwBCreW9lpfChPw/edit?gid=0#gid=0"; // Replace with your CSV file URL
  var response = UrlFetchApp.fetch(url);
  var csvData = response.getContentText();
  var data = Utilities.parseCsv(csvData);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Optional: Clear existing data
  Logger.log(sheet.getDataRange());
}

// code tested
function useGoogleSheet() {
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Get the active sheet
  var sheet = spreadsheet.getActiveSheet();

  // Get the name of the sheet
  var sheetName = sheet.getName();
  Logger.log("Current sheet name: " + sheetName);

  // Get the last row in column B
  var lastRow = sheet.getLastRow();

  // Set the range from A2 to B last row
  var range = sheet.getRange("A2:B" + lastRow);

  // Log the range for verification
  Logger.log("Range set to: " + range.getA1Notation());

  // Get values from the range
  var values = range.getValues();
  Logger.log("Length: " + values.length);

  var properties = PropertiesService.getScriptProperties();
  properties.setProperty("dists", JSON.stringify(values));
  return values;
}
