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
