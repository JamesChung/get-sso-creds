import { Command, flags } from '@oclif/command';
import { logout } from '../lib/logout-helper';
import cli from 'cli-ux';

export default class LogOut extends Command {
  static description = 'initiates AWS SSO logout';

  static examples = [
    `$ gsc logout --profile your-profile
Logging out... ⣽`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
    profile: flags.string({ char: 'p', default: 'default' })
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(LogOut);

    try {
      cli.action.start('Logging out');
      await logout(flags.profile);
      cli.action.stop();
    } catch (error) {
      cli.action.stop('failed');
      console.log(error);
    }
  }
}
