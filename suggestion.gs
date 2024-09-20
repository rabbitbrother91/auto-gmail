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

  // Generate Message
  var name = recipientArray[nextIndex][0];
  name = name.split(" ")[0];

  // Send mail
  try {
    GmailApp.sendEmail(emailaddress, subject, "", {
      htmlBody: getMessage(name),
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

function getMessage(name) {
  return `
    <p>Hello ${name}</p>
    
    <p>I saw your profile on Github. We are in the process of updating our website with a new design, which you can view here: <a href="https://www.figma.com/design/XKP1pwZdIdPGxMXLo6Yts5/AutoSquare.su?node-id=452-7274">Figma Design</a>. We are seeking a skilled software engineer to assist us with this endeavor.</p>
    
    <p>We have access to the current project of our website, and you are welcome to review it to determine whether to update the existing framework or initiate a new development project.</p>
    
    <p>If this opportunity aligns with your expertise and interests, please feel free to reach out.</p>
  `;
}

function stopTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}
