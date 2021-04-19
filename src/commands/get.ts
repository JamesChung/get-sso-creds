import { Command, flags } from '@oclif/command';
import { output } from '../lib/output-helper';

export default class Get extends Command {
  static description = 'get AWS SSO credentials';

  static examples = [
`$ gsc get --profile my-profile
Profile: my-profile
Credentials expire at: 6:20:24 PM

export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: '' }),
    profile: flags.string({ name: 'profile', char: 'p', default: 'default' }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Get);

    try {
      await output(this, flags.profile);
    } catch (error) {
      console.error(error);
    }
  }
}