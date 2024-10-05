// Terms
// ss : SpreadSheet

var account_ss_id = "148DSZ_QvizBYK09jAqmFYcZ-4kgr41NSUeDu6J9Fs5I";
var contact_ss_id = "1YcVGy2oqHOWxOezIFfWduPYQyHARQ09ZWkyYGDKt9ec";
var mail_ss_id = "1dSR5IgbVjGUVamqDO3UgAbjUdj8E-E0QQ8Dkj66UtAI";
var github_ss_id = `1ampRcVGr-ZUrSYSjZ7fAaMWh6jpj0enrVDYCCSt5RFA`;
var task_ss_id = `15zhFUXcxzEjiwNrvtdvEPWtyJRdPtm9ynCtNPRVziWI`;
var task_sheet_name = "mail";

var sender;
var receivers = [];

var properties;
var lastIndex = -1;
var inited = -1;

var task;
class Mail {
  send() {}
}

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

function getMyPrimaryEmail() {
  Logger.log(Session.getActiveUser().getEmail());
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

function deInit() {
  properties.setProperty("inited", -1);
  properties.setProperty("lastIndex", -1);
}

function init() {
  properties = PropertiesService.getScriptProperties();
  inited = parseInt(properties.getProperty("inited"));

  // Initialize lastIndex to -1 if it hasn't been set yet
  lastIndex = parseInt(properties.getProperty("lastIndex"));
  if (isNaN(lastIndex)) {
    lastIndex = 0; // Default to -1 if not set
  }

  initTask();
  initSender();
  initReceivers();

  properties.setProperty("inited", 1);
  inited = 1;
}

function initTask() {
  this.task = getTask();
}

function getTask() {
  var tasks = getKeyValueDataById(task_ss_id, task_sheet_name);
  var task = tasks.find(
    (t) => t.account === Session.getActiveUser().getEmail()
  );
  return task;
}

function update() {}

function initSender() {
  this.sender = getSender();
}

function getSender() {
  var sender = {
    first_name: "James",
    last_name: "Johnson",
    name: "James Johnson",
    email: Session.getActiveUser().getEmail(),
  };

  return sender;
}
function isInvalid() {
  // Check if we've looped through all recipients
  if (lastIndex + 1 >= receivers.length) {
    Logger.log("All recipients have been contacted.Stopping further emails.");
    // Stop the trigger
    // stopTrigger();
    // Reset the index
    // properties.setProperty("lastIndex", 0);
    return false; // Exit the function
  }

  return true;
}

function sendMyEmail() {
  init();

  if (!isInvalid()) return;

  var receiver = receivers[lastIndex];
  var tags = ["Collaboration", "Github"];

  var message_template = getMessageTemplate(tags);
  var subject = message_template.subject;

  var message = message_template.message_html.replace(
    /\${pronoun}/g,
    receiver.firstName
  );
  message = message.replace(/\${firstName}/g, sender.first_name);
  message = message.replace(/\${Name}/g, sender.name);

  var options = {
    htmlBody: message,
    from: sender.email,
    name: sender.name,
    subject: subject,
  };

  testEmail(options);

  try {
    GmailApp.sendEmail(receiver.email, subject, "", options);

    // Store the new index
    properties.setProperty("lastIndex", lastIndex + 1);
    Logger.log("Last Index After: " + properties.getProperty("lastIndex"));

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

function testEmail(subject, options) {
  if (lastIndex % 20 == 0) {
    var testEmails = getMyEmails();
    GmailApp.sendEmail(
      testEmails[generateRandomInteger(0, testEmails.length - 1)],
      "",
      options
    );
  }
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

function initReceivers() {
  this.receivers = getReceivers();
}

function getReceivers() {
  if (task === null) return;

  var sheet = SpreadsheetApp.openById(task.sheet_id).getSheetByName(
    task.sheet_name
  );
  var values = getDeafultData(sheet);
  var receivers = [];
  for (var i = 0; i < values.length; i++) {
    var receiver = {};
    receiver.name = values[i][0];
    receiver.email = values[i][1];
    receiver.firstName = receiver.name.split(" ")[0];

    receivers.push(receiver);
  }
  return receivers;
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
