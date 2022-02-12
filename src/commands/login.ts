import { Command, Flags, CliUx } from '@oclif/core';
import { login } from '../lib/login-helper';

export default class LogIn extends Command {
  static description = 'Initiates AWS SSO login';

  static examples = [
    `$ gsc login --profile your-profile
Logging in... ⣽`,
  ];

  static flags = {
    help: Flags.help(),
    profile: Flags.string({
      char: 'p',
      default: 'default',
      description: 'Profile name to use for login',
    })
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(LogIn);

    try {
      CliUx.ux.action.start('❯ Logging in');
      await login(flags.profile);
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
