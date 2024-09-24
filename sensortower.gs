var recipientArray;

function sendEmailToArrayOfRecipients() {
  // Get the stored index of the last sent email
  var properties = PropertiesService.getScriptProperties();
  var recipientArray = JSON.parse(properties.getProperty("dists"));

  // Initialize lastIndex to -1 if it hasn't been set yet
  var lastIndex = parseInt(properties.getProperty("lastIndex"));
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
    properties.setProperty("lastIndex", 0);
    return; // Exit the function
  }

  var emailaddress = recipientArray[nextIndex][1]; // Get the next recipient

  // Get email subject
  var subject = getSubject();

  // Get email message
  var company = recipientArray[nextIndex][0];

  // Send mail
  try {
    GmailApp.sendEmail(emailaddress, subject, "", {
      htmlBody: getMessage(company),
    });

    Logger.log("Current Index: " + nextIndex);

    // Store the new index
    properties.setProperty("lastIndex", nextIndex);
    Logger.log("Last Index After: " + properties.getProperty("lastIndex"));

    // Search for the most recent email sent to the recipient
    var threads = GmailApp.search("to:" + emailaddress, 0, 1);
    if (threads.length > 0) {
      var thread = threads[0];

      // Get or create a label
      var labelName = "Collaboration-Appstore"; // Change this to your desired label name
      var label =
        GmailApp.getUserLabelByName(labelName) ||
        GmailApp.createLabel(labelName);

      // Apply the label to the thread
      label.addToThread(thread);
    }
  } catch (error) {
    Logger.log("Error sending email: " + error.message);
  }
}

function getSubject() {
  return `Proposal for Professional Collaboration(In Google Appstore)`;
}

function getMessage(company) {
  return `
    <p>Hello ${name},</p>
    
    <p>I hope this message finds you well. My name is James, and I am a Full Stack Developer with over three years of experience. I recently came across your GitHub profile and was impressed by your work.</p>
    
    <p>I see potential for collaboration on projects that could enhance your business. I would be happy to offer my skills and support, especially if you are encountering any challenges.</p>
    
    <p>If you're open to it, I would appreciate the opportunity for a brief conversation to explore how we might work together. I can adjust my schedule to fit yours.</p>
    
    <p>Thank you for your time, and I look forward to hearing from you.</p>
    
    <p>Best regards,<br>James Jones</p>
  `;
}

function stopTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}
