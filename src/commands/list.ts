import { Command, flags } from '@oclif/command';
import { getProfileNames } from '../lib/profile-helper';
import { output } from '../lib/output-helper';
import { IFlags } from '../lib/interfaces';
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
    quiet: flags.boolean({ name: 'quiet', char: 'q', default: false }),
    json: flags.boolean({ name: 'json', default: false }),
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

      const input: IFlags = {
        profile: response.profile,
        quiet: flags.quiet,
        json: flags.json,
      };

      await output(this, input);
    } catch (error) {
      console.log(error);
    }
  }
}
