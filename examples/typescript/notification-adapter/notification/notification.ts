export type NotificationMessage = {
  recipient: string;
  body: string;
  sender: string;
};

export interface Sender {
  send(message: NotificationMessage): void;
}

export type LegacySmsPayload = {
  gsm: string;
  msg: string;
  originator: string;
};

export class LegacySmsClient {
  readonly sentPayloads: LegacySmsPayload[] = [];

  deliver(payload: LegacySmsPayload): void {
    this.sentPayloads.push(payload);
  }
}

export class SmsSenderAdapter implements Sender {
  constructor(private readonly client: LegacySmsClient) {}

  send(message: NotificationMessage): void {
    this.client.deliver({
      gsm: message.recipient,
      msg: message.body,
      originator: message.sender
    });
  }
}

export interface Logger {
  info(message: string): void;
}

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(message);
  }
}

export class LoggingSender implements Sender {
  constructor(
    private readonly inner: Sender,
    private readonly logger: Logger
  ) {}

  send(message: NotificationMessage): void {
    this.logger.info(`notification.send.start recipient=${message.recipient}`);
    this.inner.send(message);
    this.logger.info(`notification.send.finish recipient=${message.recipient}`);
  }
}
