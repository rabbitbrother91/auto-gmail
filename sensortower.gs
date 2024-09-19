function sendEmailToArrayOfRecipients() {

  // var recipientArray = [
  //   "jamesjones94921@gmail.com",
  //   "satoshinakao.kk@gmail.com",
  //   "rabbitbrother91@gmail.com",
  //   "david11210903@gmail.com",
  //   "goldenrabbit0123579@gmail.com",
  //   "jinjin9990901@gmail.com",
  //   "topdevstar99@gmail.com",
  //   "skystarxtogether@gmail.com",
  //   "harryleo9173@gmail.com",
  //   "passiondev91@gmail.com"
  // ];

  // Get the stored index of the last sent email
  var properties = PropertiesService.getScriptProperties();
  var recipientArray = JSON.parse(properties.getProperty("dists"));

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

  var company = recipientArray[nextIndex][0];
  company = company.split(" ")[0];

  var emailaddress = recipientArray[nextIndex][1]; // Get the next recipient
  var subject = getSubject();
  var body = getMessage(company);

  try {
    GmailApp.sendEmail(emailaddress, subject, body, {
      htmlBody: body // Use HTML body for custom formatting
    });
    Logger.log("Current Index: " + nextIndex);

    // Store the new index
    properties.setProperty('lastIndex', nextIndex);
    Logger.log("Last Index After: " + properties.getProperty('lastIndex'));
  } catch (error) {
    Logger.log("Error sending email: " + error.message);
  }
}

function getSubject() {
  return `Proposal for Professional Collaboration(In Google Appstore)`;
}

function getGithubSubject() {
  return `Proposal for a Win-Win Collaboration (Via GitHub)`;
}

function getGithubMessage(name) {
  return `Hello ${name},
  
I hope this message finds you well. My name is James  and I am a Full Stack Developer with more than 3 years of Work Experience.
I am currently exploring task opportunities that not only provide financial growth but also valuable professional relationships.

Today, I checked out your GitHub profile  and I saw you are CEO, so I was impressed and believe there may be potential for collaboration and work. 
I can help you with my personality and skills, further integrity. If you're facing challenges or planning to enhance the quality of your work, I would appreciate the opportunity to collaborate with you.

For reliability, I can work on your project for free while I adapt. After assessing my personality and skills, I believe I can continue working on your project within your budget. In simple terms, if you give me tasks, I will complete them for you within your budget and timeline.

Would you be available for a conversation at your convenience? I would appreciate the opportunity to discuss how we might work together in a mutually beneficial manner.
I was just inquiring. Even if you say you are not interested,  I'm not disappointed. I enjoy discovering better results, it makes more sense to me. 
I would appreciate it if you could stay in touch with me as you plan to expand your development business. It was simply my suggestion to collaborate.

Thanks For Your Consideration, 
James Jones
`;
}

function getMessage(company) {
  return `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: black;">
            <p><strong>Dear ${company} Team,</strong></p>
            <p>I hope this message finds you in great spirits. My name is James, and I am a Full Stack and Mobile Game Developer with over 3 years of work experience, specializing in JavaScript and C#.</p>
            <p>I recently explored your games and visited your website, and I must say, I was thoroughly impressed. Your creativity and dedication to game development truly shine through.</p>
            <p>I believe that an engaging and efficient website is crucial for promoting your games, especially with the unique customization features you offer. Imagine having a dynamic platform that not only showcases your games but also enhances your brand presence and engages your audience effectively.</p>
            <p>I would love the opportunity to discuss how I can contribute to optimizing your website for better promotion and user interaction. If this sounds interesting to you, please let me know, and we can arrange a time to chat.</p>
            <p>Thank you for your time, and I look forward to the possibility of working together.</p>
            <p><strong>Best regards,</strong><br><strong>James Jones</strong></p>
        </div>
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

