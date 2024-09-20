var recipientArray;

function sendEmailToArrayOfRecipients() {

  // Get the stored index of the last sent email
  var properties = PropertiesService.getScriptProperties();
  recipientArray = JSON.parse(properties.getProperty("dists"));

  // Initialize lastIndex to -1 if it hasn't been set yet
  var lastIndex = parseInt(properties.getProperty('lastIndex'));
  if (isNaN(lastIndex)) {
    lastIndex = -1; // Default to -1 if not set
  }

  Logger.log("Last Index Before: " + lastIndex);

  // Calculate the next index
  var nextIndex = (lastIndex + 1) % recipientArray.length;

  // Check if we've looped through all recipients
  if (nextIndex === 0) {
    Logger.log("All recipients have been contacted.Stopping further emails.");
    // Stop the trigger
    stopTrigger();
    // Reset the index
    properties.setProperty('lastIndex', 0);
    return; // Exit the function
  }

  // Generate Subject
  var emailaddress = recipientArray[nextIndex][1]; // Get the next recipient
  var subject = getGithubSubject();

  // Generate Message
  var name = recipientArray[nextIndex][0];
  name = name.split(" ")[0];

  var body = getGithubMessage(name);

  // Send mail
  try {
    GmailApp.sendEmail(emailaddress, subject, '', { htmlBody: getGithubMessage(name) });
     
    Logger.log("Current Index: " + nextIndex);

    // Store the new index
    properties.setProperty('lastIndex', nextIndex);
    Logger.log("Last Index After: " + properties.getProperty('lastIndex'));

    // Search for the most recent email sent to the recipient
    var threads = GmailApp.search('to:' + emailaddress, 0, 1);
    if (threads.length > 0) {
      var thread = threads[0];

      // Get or create a label
      var labelName = "Collaboration-Github"; // Change this to your desired label name
      var label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);

      // Apply the label to the thread
      label.addToThread(thread);
    }

  } catch (error) {
    Logger.log("Error sending email: " + error.message);
  }
}

function getGithubSubject()
{
  return `Proposal for a Win-Win Collaboration (Via GitHub)`;
}

function getGithubMessage(name) {
  return `
    <p>Hello ${name},</p>
    
    <p>I hope this message finds you well. My name is James and I am a Full Stack Developer with more than 3 years of work experience. I am currently exploring task opportunities that not only provide financial growth but also valuable professional relationships.</p>
    
    <p>Today, I checked out your GitHub profile and saw that you are the CEO, so I was impressed and believe there may be potential for collaboration and work. I can help you with my personality and skills, further integrity. If you're facing challenges or planning to enhance the quality of your work, I would appreciate the opportunity to collaborate with you.</p>
    
    <p>For reliability, I can work on your project for free while I adapt. After assessing my personality and skills, I believe I can continue working on your project within your budget. In simple terms, if you give me tasks, I will complete them for you within your budget and timeline.</p>
    
    <p>Would you be available for a conversation at your convenience? I would appreciate the opportunity to discuss how we might work together in a mutually beneficial manner. I was just inquiring. Even if you say you are not interested, I'm not disappointed. I enjoy discovering better results; it makes more sense to me.</p>
    
    <p>I would appreciate it if you could stay in touch with me as you plan to expand your development business. It was simply my suggestion to collaborate.</p>
    
    <p>Thanks for your consideration,<br>James Jones</p>
  `;
}


function stopTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function importCSVFromURL() {
  var url = 'https://docs.google.com/spreadsheets/d/1qg-z1jd3QfjhbOvhFXyTr00bpjd5RwBCreW9lpfChPw/edit?gid=0#gid=0'; // Replace with your CSV file URL
  var response = UrlFetchApp.fetch(url);
  var csvData = response.getContentText();
  var data = Utilities.parseCsv(csvData);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Optional: Clear existing data
  Logger.log(sheet.getDataRange());
}

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
  // Log the values to the console
  for (var i = 0; i < values.length; i++) {
    Logger.log(values[i]);
  }
}

