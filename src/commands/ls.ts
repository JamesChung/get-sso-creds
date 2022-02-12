import { Command, Flags, CliUx } from '@oclif/core';
import { getCredProfiles, getProfileNames } from '../lib/profile-helper';
import * as inquirer from 'inquirer';

export default class Ls extends Command {
  static description = 'lists profile names by file';

  static examples = [
    `$ gsc ls
? Select a file: (Use arrow keys)
❯ config
 credentials`,
  ];

  static flags = {
    help: Flags.help({
      char: 'h',
      description: undefined
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    try {
      const response = await inquirer.prompt([{
        name: 'file',
        message: 'Select a file:',
        type: 'list',
        choices: ['config', 'credentials']
      }]);

      if (response.file === 'config') {
        for (let profile of getProfileNames()) {
          this.log(profile);
        }
        return;
      }

      if (response.file === 'credentials') {
        for (let profile of getCredProfiles()) {
          this.log(profile);
        }
        return;
      }
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
