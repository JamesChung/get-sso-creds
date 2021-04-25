import { Command, flags } from '@oclif/command';
import { getCredProfiles } from '../lib/profile-helper';
import { clearCredentials } from '../lib/creds-helper';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

export default class SelectClear extends Command {
  static description = 'clears credentials in ~/.aws/credentials by interactive profile selection';

  static examples = [
`$ gsc clear-profile
? Select a profile: (Use arrow keys)
❯ default
 personal`,
  ];

  static flags = {
    help: flags.help({
      char: 'h',
      description: undefined
    }),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(SelectClear);

    try {
      const response = await inquirer.prompt([{
        name: 'profile',
        message: 'Select a profile:',
        type: 'list',
        choices: getCredProfiles()
      }]);
      cli.action.start('❯ Clearing');
      clearCredentials(this, response.profile);
      cli.action.stop();
    } catch (error) {
      cli.action.stop('failed');
      this.error(error.message);
    }
  }
}
