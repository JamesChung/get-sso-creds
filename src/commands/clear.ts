import { Command, Flags, CliUx } from '@oclif/core';
import { getCredProfiles } from '../lib/profile-helper';
import { clearCredentials } from '../lib/creds-helper';
import * as inquirer from 'inquirer';

export default class Clear extends Command {
  static description = 'Clears selected credentials in ~/.aws/credentials.';

  static examples = [
    `$ gsc clear
? Select a profile: (Use arrow keys)
❯ default
  personal`,
  ];

  static flags = {
    help: Flags.help(),
  };

  static args = [];

  public async run(): Promise<void> {
    try {
      const response = await inquirer.prompt([{
        name: 'profile',
        message: 'Select a profile:',
        type: 'list',
        choices: getCredProfiles()
      }]);
      CliUx.ux.action.start('❯ Clearing');
      clearCredentials(this, response.profile);
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
