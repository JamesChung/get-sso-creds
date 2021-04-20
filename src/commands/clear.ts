import { Command, flags } from '@oclif/command';
import { clearCredentials } from '../lib/creds-helper';
import cli from 'cli-ux';

export default class Clear extends Command {
  static description = 'clears default credentials in ~/.aws/credentials';

  static examples = [
    `$ gsc clear`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Clear);

    try {
      cli.action.start('Clearing');
      clearCredentials(this);
      cli.action.stop();
    } catch (error) {
      cli.action.stop('failed');
      this.log(error);
    }
  }
}
