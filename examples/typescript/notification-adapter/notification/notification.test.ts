import {
  LegacySmsClient,
  Logger,
  LoggingSender,
  NotificationMessage,
  SmsSenderAdapter
} from "./notification";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

class MemoryLogger implements Logger {
  readonly entries: string[] = [];

  info(message: string): void {
    this.entries.push(message);
  }
}

const client = new LegacySmsClient();
const adapter = new SmsSenderAdapter(client);
const logger = new MemoryLogger();
const sender = new LoggingSender(adapter, logger);

const message: NotificationMessage = {
  recipient: "+905551112233",
  body: "Your verification code is 482991",
  sender: "Playbook"
};

sender.send(message);

assert(client.sentPayloads.length === 1, "expected one vendor payload");
assert(client.sentPayloads[0]?.gsm === message.recipient, "expected recipient to map to gsm");
assert(client.sentPayloads[0]?.msg === message.body, "expected body to map to msg");
assert(client.sentPayloads[0]?.originator === message.sender, "expected sender to map to originator");
assert(logger.entries.length === 2, "expected start and finish log entries");

console.log("notification-adapter tests passed");
