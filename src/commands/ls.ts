import { Command, flags } from '@oclif/command';
import { getCredProfiles, getProfileNames } from '../lib/profile-helper';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

export default class Ls extends Command {
  static description = 'lists profile names by file';

  static examples = [
`$ gsc ls
? Select a file: (Use arrow keys)
❯ config
 credentials`,
  ];

  static flags = {
    help: flags.help({
      char: 'h',
      description: undefined
    }),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Ls);

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
    } catch (error) {
      cli.action.stop('failed');
      this.error(error.message);
    }
  }
}
