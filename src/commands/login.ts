import { Command, flags } from '@oclif/command';
import { login } from '../lib/login-helper';
import cli from 'cli-ux';

export default class LogIn extends Command {
  static description = 'initiates AWS SSO login';

  static examples = [
    `$ gsc login --profile your-profile
Logging in... ⣽`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
    profile: flags.string({ char: 'p', default: 'default' })
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(LogIn);

    try {
      cli.action.start('Logging in');
      await login(flags.profile);
      cli.action.stop();
    } catch (error) {
      cli.action.stop('failed');
      this.log(error);
    }
  }
}
