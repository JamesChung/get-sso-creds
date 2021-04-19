import { Command, flags } from '@oclif/command';
import { getProfileNames } from '../lib/profile-helper';
import { output } from '../lib/output-helper';
import * as inquirer from 'inquirer';

export default class List extends Command {
  static description = 'interactive AWS SSO credentials retrieval';

  static examples = [
    `$ gsc list
? Select a profile: (Use arrow keys)
❯ default 
dev
prod
personal`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(List);

    try {
      const response = await inquirer.prompt([{
        name: 'profile',
        message: 'Select a profile:',
        type: 'list',
        choices: getProfileNames()
      }]);
      output(this, response.profile);
    } catch (error) {
      console.log(error);
    }
  }
}
