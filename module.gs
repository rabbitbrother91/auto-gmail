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
  values[values.length] = ["Passion", "passiondev91@gmail.com"];
  Logger.log("Length: " + values.length);

  var properties = PropertiesService.getScriptProperties();
  properties.setProperty("dists", JSON.stringify(values));
  return values;
  // Log the values to the console
  for (var i = 0; i < values.length; i++) {
    Logger.log(values[i]);
  }
}
