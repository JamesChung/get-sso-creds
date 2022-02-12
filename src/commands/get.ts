import { Command, Flags, CliUx } from '@oclif/core';
import { getProfileNames } from '../lib/profile-helper';
import { output } from '../lib/output-helper';
import { IFlags } from '../lib/interfaces';
import { getProfileCredentials, writeCredentialsFile } from '../lib/creds-helper';
import * as inquirer from 'inquirer';

export default class Get extends Command {
  static description = 'Get AWS SSO credentials via existing profile in ~/.aws/config';

  static examples = [
    `$ gsc select-profile
? Select a profile: (Use arrow keys)
❯ default
 dev
 prod
 personal

Profile: my-profile
Credentials expire at: 6:20:24 PM

export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>`,
  ];

  static flags = {
    help: Flags.help({
      char: 'h',
      description: undefined
    }),
    credentials: Flags.boolean({
      char: 'c',
      description: 'writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag is not used)',
      default: false
    }),
    preserve: Flags.boolean({
      char: 'P',
      description: 'uses selected profile name when using --credentials flag',
      dependsOn: ['credentials']
    }),
    quiet: Flags.boolean({
      name: 'quiet',
      char: 'q',
      default: false
    }),
    json: Flags.boolean({
      name: 'json',
      default: false
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Get);

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
        CliUx.ux.action.start('❯ Writing to credentials file');
        if (flags.preserve) {
          writeCredentialsFile(credentials, response.profile);
        }
        writeCredentialsFile(credentials);
        CliUx.ux.action.stop();
        return;
      }

      await output(this, input);
    } catch (error: any) {
      this.error(error.message);
    }
  }
}
