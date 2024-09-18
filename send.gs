function sendEmailToArrayOfRecipients() {
  var recipientArray = [
    "jamesjones94921@gmail.com",
    "satoshinakao.kk@gmail.com",
    "rabbitbrother91@gmail.com",
    "david11210903@gmail.com",
    "goldenrabbit0123579@gmail.com",
    "jinjin9990901@gmail.com",
    "topdevstar99@gmail.com",
    "skystarxtogether@gmail.com",
    "harryleo9173@gmail.com",
    "passiondev91@gmail.com"
  ];

  // Get the stored index of the last sent email
  var properties = PropertiesService.getScriptProperties();

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

  var emailaddress = recipientArray[nextIndex]; // Get the next recipient
  var subject = getSubject();

  var company;
  var body = getMessage(company);

  try {
    GmailApp.sendEmail(emailaddress, subject, body);
    Logger.log("Sending email to: " + emailaddress);
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

function getMessage(company) {
  return `Dear ${company} Team,
  
I hope this message finds you in great spirits. My name is James, and I am a Full Stack and Mobile Game Developer with over 3 years of work experience, specializing in JavaScript and C#.

I recently explored your games and visited your website, and I must say, I was thoroughly impressed. Your creativity and dedication to game development truly shine through.

I believe that an engaging and efficient website is crucial for promoting your games, especially with the unique customization features you offer. Imagine having a dynamic platform that not only showcases your games but also enhances your brand presence and engages your audience effectively.

I would love the opportunity to discuss how I can contribute to optimizing your website for better promotion and user interaction. If this sounds interesting to you, please let me know, and we can arrange a time to chat.

Thank you for your time, and I look forward to the possibility of working together.

Best regards,
James Jones`;
}

function stopTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}