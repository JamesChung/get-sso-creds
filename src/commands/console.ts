import { Command, Flags, CliUx } from '@oclif/core';
import { getProfileCredentials, getCredentialsFromCredentialsFile } from '../lib/creds-helper';
import { generateLoginURL } from '../lib/console-helper';
import { getCredProfiles, getProfileNames } from '../lib/profile-helper';
import * as inquirer from 'inquirer';
import * as open from 'open';
import { ICredentials } from '../lib';

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
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Console);

    try {
      const { profileType } = await inquirer.prompt([{
        name: 'profileType',
        message: 'Select a file:',
        type: 'list',
        choices: ['config', 'credentials'],
      }]);

      const { profile } = await inquirer.prompt([{
        name: 'profile',
        message: 'Select a profile:',
        type: 'list',
        choices: profileType === 'config' ? getProfileNames() : getCredProfiles(),
      }]);

      CliUx.ux.action.start('❯ Opening Console');
      if (profileType === 'config') {
        const credentials = (await getProfileCredentials(profile)).credentials;
        const loginURL = await generateLoginURL(credentials);
        open(loginURL, {});
      }
      if (profileType === 'credentials') {
        const credentials = getCredentialsFromCredentialsFile(profile);
        const loginURL = await generateLoginURL(credentials);
        open(loginURL, {});
      }
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
