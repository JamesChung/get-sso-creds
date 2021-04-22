import { Command, flags } from '@oclif/command';
import { clearCredentials } from '../lib/creds-helper';
import cli from 'cli-ux';

export default class Clear extends Command {
  static description = 'clears credentials in ~/.aws/credentials';

  static examples = [
    `$ gsc clear`,
  ];

  static flags = {
    help: flags.help({
      char: 'h',
      description: undefined
    }),
    profile: flags.string({
      char: 'p',
      description: 'clears given profile credentials in ~/.aws/credentials'
    }),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Clear);

    try {
      cli.action.start('❯ Clearing');
      clearCredentials(this, flags.profile);
      cli.action.stop();
    } catch (error) {
      cli.action.stop('failed');
      this.error(error);
    }
  }
}
