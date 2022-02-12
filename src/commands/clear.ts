import { Command, Flags, CliUx } from '@oclif/core';
import { clearCredentials } from '../lib/creds-helper';

export default class Clear extends Command {
  static description = 'clears all credentials in ~/.aws/credentials';

  static examples = [
    `$ gsc clear`,
  ];

  static flags = {
    help: Flags.help({
      char: 'h',
      description: undefined
    }),
    profile: Flags.string({
      char: 'p',
      description: 'clears given profile credentials in ~/.aws/credentials',
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Clear);

    try {
      CliUx.ux.action.start('❯ Clearing');
      clearCredentials(this, flags.profile);
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
