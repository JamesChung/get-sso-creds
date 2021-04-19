import { Command, flags } from '@oclif/command';
import { signin } from '../lib/signin-helper';
import cli from 'cli-ux';

export default class SignIn extends Command {
  static description = 'initiates AWS SSO signin';

  static examples = [
    `$ gsc signin --profile your-profile
Signing in... ⣽`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
    profile: flags.string({ char: 'p', default: 'default' })
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(SignIn);

    try {
      cli.action.start('Signing in');
      await signin(flags.profile);
      cli.action.stop();
    } catch (error) {
      console.log(error);
    }
  }
}
