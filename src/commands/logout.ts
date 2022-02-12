import { Command, Flags, CliUx } from '@oclif/core';
import { logout } from '../lib/logout-helper';

export default class LogOut extends Command {
  static description = 'initiates AWS SSO logout';

  static examples = [
    `$ gsc logout --profile your-profile
Logging out... ⣽`,
  ];

  static flags = {
    help: Flags.help({
      char: 'h',
      description: undefined
    }),
    profile: Flags.string({
      char: 'p',
      default: 'default'
    })
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(LogOut);

    try {
      CliUx.ux.action.start('❯ Logging out');
      await logout(flags.profile);
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
