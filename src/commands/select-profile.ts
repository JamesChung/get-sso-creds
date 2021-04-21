import { Command, flags } from '@oclif/command';
import { getProfileNames } from '../lib/profile-helper';
import { output } from '../lib/output-helper';
import { IFlags } from '../lib/interfaces';
import * as inquirer from 'inquirer';
import { getProfileCredentials, writeCredentialsFile } from '../lib/creds-helper';
import cli from 'cli-ux';

export default class SelectProfile extends Command {
  static description = 'get AWS SSO credentials by interactive profile selection';

  static examples = [
    `$ gsc select-profile
? Select a profile: (Use arrow keys)
❯ default
 dev
 prod
 personal`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
    credentials: flags.boolean({ char: 'c', description: 'writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag is not used)', default: false }),
    preserve: flags.boolean({ char: 'P', description: 'uses selected profile name when using --credentials flag', dependsOn: ['credentials'] }),
    quiet: flags.boolean({ name: 'quiet', char: 'q', default: false }),
    json: flags.boolean({ name: 'json', default: false }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(SelectProfile);

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
      
      if (flags.credentials) {
        const { credentials } = await getProfileCredentials(response.profile);
        cli.action.start('❯ Writing to credentials file');
        if (flags.preserve) {
          writeCredentialsFile(credentials, response.profile);
        }
        writeCredentialsFile(credentials);
        cli.action.stop();
        return;
      }

      await output(this, input);
    } catch (error) {
      this.error(error);
    }
  }
}
