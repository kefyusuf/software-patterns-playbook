import {
  ConsoleLogger,
  LegacySmsClient,
  LoggingSender,
  NotificationMessage,
  SmsSenderAdapter
} from "./notification/notification";

const sender = new LoggingSender(
  new SmsSenderAdapter(new LegacySmsClient()),
  new ConsoleLogger()
);

const message: NotificationMessage = {
  recipient: "+905551112233",
  body: "Your verification code is 482991",
  sender: "Playbook"
};

sender.send(message);
