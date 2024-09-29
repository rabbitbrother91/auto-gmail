// Terms
// ss : SpreadSheet

var account_ss_id = "148DSZ_QvizBYK09jAqmFYcZ-4kgr41NSUeDu6J9Fs5I";
var contact_ss_id = "1YcVGy2oqHOWxOezIFfWduPYQyHARQ09ZWkyYGDKt9ec";
var mail_ss_id = "1dSR5IgbVjGUVamqDO3UgAbjUdj8E-E0QQ8Dkj66UtAI";
var github_ss_id = "1ampRcVGr-ZUrSYSjZ7fAaMWh6jpj0enrVDYCCSt5RFA";
var import_ss_id = github_ss_id;

var sender = {
  first_name: "Satoshi",
  last_name: "Nakamoto",
  name: "Satoshi Nakamoto",
  email: "satoshinakamoto.k@gmail.com",
};

var receivers = [];
var lastIndex = 0;
var properties;
// Get valid email addresses from account spreadsheet, ss_id = 148DSZ_QvizBYK09jAqmFYcZ-4kgr41NSUeDu6J9Fs5I
function getMyEmails() {
  var sheet = SpreadsheetApp.openById(account_ss_id).getSheetByName("User");

  // Get the last row in column A
  var lastRow = sheet.getLastRow();

  // Set the range from A2 to A last row
  var range = sheet.getRange("A2:A" + lastRow);

  // Log the range for verification
  // Logger.log("Range set to: " + range.getA1Notation());

  // Get values from the range
  var values = range.getValues();

  // Initialize an array to hold valid emails
  var validEmails = [];

  // Regular expression for validating email addresses
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Log the values and filter valid emails
  for (var i = 0; i < values.length; i++) {
    var email = values[i][0]; // Access the email string
    if (emailPattern.test(email)) {
      validEmails.push(email);
      // Logger.log("Valid email found: " + email);
    } else {
      // Logger.log("Invalid email skipped: " + email);
    }
  }

  return validEmails;
}

function getMessageTemplate(tags) {
  var mail_templates = getKeyValueDataById(mail_ss_id, "template");

  // Find the index of the item that has all matching tags
  var matchingIndex = mail_templates.findIndex((item) => {
    // Split the item's tag into an array
    var itemTags = item.tags.split(",").map((tag) => tag.trim());
    // Check if every tag in the tags array is included in the item's tags
    return tags.every((tag) => itemTags.includes(tag));
  });

  // Log the matching index
  if (matchingIndex !== -1) {
    Logger.log(
      "Index of item matching all tags '" +
        tags.join(", ") +
        "': " +
        matchingIndex
    );
    return mail_templates[matchingIndex];
  } else {
    Logger.log("No item found matching all tags '" + tags.join(", ") + "'.");
  }
}

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

function getKeyValueDataById(ss_id, sheetName) {
  var sheet = SpreadsheetApp.openById(ss_id).getSheetByName(sheetName); // Replace 'User' with your sheet name
  return getKeyValueData(sheet);
}

function initPref() {
  properties = PropertiesService.getScriptProperties();
  // Initialize lastIndex to -1 if it hasn't been set yet
  lastIndex = parseInt(properties.getProperty("lastIndex"));
  if (isNaN(lastIndex)) {
    lastIndex = 0; // Default to -1 if not set
  }
}

function validate() {
  // Check if we've looped through all recipients
  if (lastIndex + 1 >= receivers.length) {
    Logger.log("All recipients have been contacted.Stopping further emails.");
    // Stop the trigger
    // stopTrigger();
    // Reset the index
    // properties.setProperty("lastIndex", 0);
    return; // Exit the function
  }
}
function sendMyEmail() {
  getUser();
  initPref();
  validate();

  receiver = receivers[lastIndex];
  var tags = ["Collaboration", "Github"];

  var message_template = getMessageTemplate(tags);
  var subject = message_template.subject;
  var message = message_template.message_html.replace(
    /\${pronoun}/g,
    receiver.name
  );
  message = message.replace(/\${firstName}/g, sender.first_name);
  message = message.replace(/\${Name}/g, sender.name);

  var options = {
    htmlBody: message,
    from: sender.email,
    name: sender.name,
  };

  if (lastIndex % 12 == 0) {
    var testEmails = getMyEmails();
    GmailApp.sendEmail(
      testEmails[generateRandomInteger(0, testEmails.length - 1)],
      subject,
      "",
      options
    );
  }

  try {
    GmailApp.sendEmail(receiver.email, subject, "", options);

    // Store the new index
    properties.setProperty("lastIndex", lastIndex + 1);
    Logger.log(
      "Last Index After: " +
        properties.getProperty("lastIndex") +
        "/" +
        receivers.length
    );

    insertTags(receiver.email, tags);

    insertLog([
      sender.email,
      receiver.email,
      getCurrentTimeGMTPlus9(),
      "sent",
      "git",
    ]);
    Logger.log("Sent to " + receiver.email);
  } catch (error) {
    Logger.log(error);
    insertLog([
      sender.email,
      receiver.email,
      getCurrentTimeGMTPlus9(),
      error,
      "git",
    ]);
    Logger.log("Not sent to " + receiver.email);
  }
  Logger.log("Sent Successfully");
}

function insertTags(email, tags) {
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    // Search for the most recent email sent to the recipient
    var threads = GmailApp.search("to:" + email, 0, 1);
    if (threads.length > 0) {
      var thread = threads[0];

      // Get or create a label
      var label = GmailApp.getUserLabelByName(tag) || GmailApp.createLabel(tag);

      // Apply the label to the thread
      label.addToThread(thread);
    }
  }
}
function insertLog(log) {
  var sheet = SpreadsheetApp.openById(mail_ss_id).getSheetByName("log");
  sheet.insertRowAfter(sheet.getLastRow());

  var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, log.length);
  range.setValues([log]);
}

function getUser() {
  // // id, user_id, from_email, to_email, send_date, send_status, type, reply
  // var sheet = SpreadsheetApp.openById(mail_ss_id).getSheetByName('log')

  // var sent_emails = sheet.getRange(2, 2, sheet.getLastRow()).getValues().map(function (row) {
  //   return row[0];
  // });

  // Logger.log(sent_emails[0])

  // id, name, location, email, github
  var sheet = SpreadsheetApp.openById(import_ss_id).getSheetByName("users");
  var values = getDeafultData(sheet);
  for (var i = 0; i < values.length; i++) {
    var receiver = {};
    receiver.name = values[i][0];
    receiver.email = values[i][1];
    receiver.firstName = receiver.name.split(" ")[0];

    receivers.push(receiver);
  }
  // var to_emails = emails.filter(function (e) {
  //   return !sent_emails.includes(e);
  // });

  // sendMyEmail(to_emails[0])
}

function getDeafultData(sheet) {
  return sheet.getRange("A2:B" + sheet.getLastRow()).getValues();
}
function getCurrentTimeGMTPlus9() {
  // Create a new Date object for the current time
  var date = new Date();

  // Get the current time in GMT
  var gmtTime = date.getTime() + date.getTimezoneOffset() * 60000;

  // Create a new Date object for GMT +9
  var gmtPlus9 = new Date(gmtTime + 9 * 60 * 60 * 1000);

  var year = gmtPlus9.getFullYear();
  var month = String(gmtPlus9.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  var day = String(gmtPlus9.getDate()).padStart(2, "0");
  var hours = String(gmtPlus9.getHours()).padStart(2, "0");
  var minutes = String(gmtPlus9.getMinutes()).padStart(2, "0");
  var seconds = String(gmtPlus9.getSeconds()).padStart(2, "0");

  var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // Log or return the formatted date string
  Logger.log(formattedDate); // This will log the date in the Apps Script console
  return formattedDate;
  return gmtPlus9;
}

function generateRandomInteger(min, max) {
  // Generate a random integer between min and max (inclusive)
  var randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
  Logger.log("Random Integer: " + randomInteger); // Log the random integer
  return randomInteger; // Return the random integer
}
