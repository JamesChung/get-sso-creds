import { Command, Flags } from '@oclif/core';
import { output } from '../lib/output-helper';

export default class Get extends Command {
  static description = 'get AWS SSO credentials by ~/.aws/config profile';

  static examples = [
    `$ gsc get --profile my-profile
Profile: my-profile
Credentials expire at: 6:20:24 PM

export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>`,
  ];

  static flags = {
    help: Flags.help({
      char: 'h',
      description: undefined
    }),
    profile: Flags.string({
      name: 'profile',
      char: 'p',
      default: 'default'
    }),
    quiet: Flags.boolean({
      name: 'quiet',
      char: 'q',
      default: false
    }),
    json: Flags.boolean({
      name: 'json',
      default: false
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Get);

    try {
      await output(this, flags);
    } catch (error: any) {
      this.error(error.message);
    }
  }
}
