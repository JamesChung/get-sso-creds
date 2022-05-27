import { Command, Flags, CliUx } from '@oclif/core';
import { getProfileCredentials } from '../lib/creds-helper';
import { generateLoginURL } from '../lib/console-helper';
import { getCredProfiles } from '../lib/profile-helper';
import * as inquirer from 'inquirer';
import * as open from 'open';

export default class Console extends Command {
  static description = 'Opens AWS Console for a selected profile.';

  static examples = [
    `$ gscreds console
? Select a profile: (Use arrow keys)
❯ default
  personal`,
  ];

  static flags = {
    help: Flags.help(),
    profile: Flags.string({
      char: 'p',
      default: 'default',
      description: 'Desired SSO config profile to use.'
    }),
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
      CliUx.ux.action.start('❯ Opening Console');
      const info = await getProfileCredentials(response?.profile);
      const loginURL = await generateLoginURL(info.credentials);
      open(loginURL, {});
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
