class MailBot {
  constructor() {
    // Initialize any properties if needed
  }

  searchByTag(tag) {
    // Implement the search logic here
  }

  perform() {
    Logger.log("Mail Bot Launched");
  }

  getRecentEmails() {
    // Get the current date and time
    var now = new Date();

    // Calculate the date and time for 30 minutes ago
    var thirtyMinutesAgo = new Date(now.getTime() - 4000 * 60 * 1000);

    // Search for emails received since 30 minutes ago
    var threads = GmailApp.search("after:" + formatDate(thirtyMinutesAgo));

    // Log the results
    if (threads.length > 0) {
      threads.forEach(function (thread) {
        var messages = thread.getMessages();
        messages.forEach(function (message) {
          Logger.log("From: " + message.getFrom());
          Logger.log("Subject: " + message.getSubject());
          Logger.log("Date: " + message.getDate());
          Logger.log("Body: " + message.getBody());
        });
      });
    } else {
      Logger.log("No emails received in the last 30 minutes.");
    }
  }
}
// Helper function to format date for Gmail search
function formatDate(date) {
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "yyyy/MM/dd HH:mm:ss"
  );
}
function runBot() {
  const bot = new MailBot(); // Create an instance of MailBot
  bot.getRecentEmails(); // Call the perform method
}
