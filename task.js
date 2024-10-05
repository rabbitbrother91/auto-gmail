class Task {
  constructor() {
    this.id = null;
    this.mail_account = null;
    this.sheet_id = null;
    this.sheet_name = null;
    this.status = "idle";
    this.task_ss_id = "15zhFUXcxzEjiwNrvtdvEPWtyJRdPtm9ynCtNPRVziWI";
  }
}

function init() {
  let task = new Task(); // Instantiate a new Task object

  Logger.log(task.status);
}
