var recipientArray;

function sendEmailToArrayOfRecipients() {
  // Get the stored index of the last sent email
  var properties = PropertiesService.getScriptProperties();
  recipientArray = JSON.parse(properties.getProperty("dists"));

  // Initialize lastIndex to -1 if it hasn't been set yet
  var lastIndex = parseInt(properties.getProperty("lastIndex"));
  if (isNaN(lastIndex)) {
    lastIndex = -1; // Default to -1 if not set
  }

  // Check if we've looped through all recipients
  if (nextIndex === 0) {
    Logger.log("All recipients have been contacted.Stopping further emails.");
    // Stop the trigger
    stopTrigger();
    // Reset the index
    properties.setProperty("lastIndex", 0);
    return; // Exit the function
  }

  Logger.log("Last Index Before: " + lastIndex);

  // Calculate the next index
  var nextIndex = (lastIndex + 1) % recipientArray.length;

  // Generate Subject
  var emailaddress = recipientArray[nextIndex][1]; // Get the next recipient

  // Get email subject
  var subject = getSubject();

  // Get email message
  var company = recipientArray[nextIndex][0];

  // Send mail
  try {
    // test email delivery status
    if (nextIndex % 10 == 0) {
      var testEmails = [
        "jamesjones9291@gmail.com",
        "jamesjones919132@gmail.com",
        "jamesjones94921@gmail.com",
        "lijongjon@gmail.com",
        "david7941512@gmail.com",
        "davidrichard41226@gmail.com",
        "jr1999722@gmail.com",
        "satoshinakao@gmail.com",
        "topdevstar99@gmail.com",
        "goldenrabbit123579@gmail.com",
        "jamesjones917911@gmail.com ",
        "passiondev91@gmail.com",
        "rabbitbrother91@gmail.com",
        "brotherrabbit91@gmail.com",
        "satoshinakamoto.k@gmail.com",
        "skystarxtogether@gmail.com",
        "david11210903@gmail.com",
        "david042671@gmail.com",
        "jamesjones04260408@gmail.com",
        "harryleo9173@gmail.com",
      ];

      GmailApp.sendEmail(
        testEmails[generateRandomInteger(0, 19)],
        subject,
        "",
        {
          htmlBody: getMessage(name),
        }
      );
    }

    // send email programmatically
    GmailApp.sendEmail(emailaddress, subject, "", {
      htmlBody: getMessage(company),
    });

    Logger.log(
      "Current Index: " + nextIndex + " ,Receiver Email: " + emailaddress
    );

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
  return `Proposal for a Win-Win Collaboration in Appstore`;
}

function generateRandomInteger(min, max) {
  // Generate a random integer between min and max (inclusive)
  var randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
  Logger.log("Random Integer: " + randomInteger); // Log the random integer
  return randomInteger; // Return the random integer
}

function test() {
  Logger.log(generateRandomInteger(0, 19));
}

function getMessage(name) {
  return `
    <p>Hello ${company},</p>
    
    <p>My name is James, and I am a Full Stack and Mobile Game Developer with over three years of experience. I recently explored your games and visited your website</p>
    
    <p>I believe there could be an opportunity to collaborate on projects that could benefit your business. I am eager to offer my skills and support</p>
    
    <p>If you’re interested, I can work on your project for free while I adapt. Thank you. I look forward to your response.</p>
    
    <p>Best regards,<br>James Jones</p>
  `;
}

function stopTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}
