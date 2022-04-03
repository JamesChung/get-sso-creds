import { Command, Flags, CliUx } from '@oclif/core';
import { getProfileNames } from '../lib/profile-helper';
import { output, clipboardOutput } from '../lib/output-helper';
import { IFlags } from '../lib/interfaces';
import { getProfileCredentials, writeCredentialsFile } from '../lib/creds-helper';
import * as inquirer from 'inquirer';

export default class Get extends Command {
  static description = 'Get AWS SSO credentials from existing profiles in ~/.aws/config.';

  static examples = [
    `$ gscreds get
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
    help: Flags.help(),
    credentials: Flags.boolean({
      char: 'c',
      default: false,
      description: 'Writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag is not used).',
      exclusive: ['clipboard'],
    }),
    clipboard: Flags.boolean({
      char: 'b',
      default: false,
      description: 'Writes credentials to clipboard.',
      exclusive: ['credentials'],
    }),
    preserve: Flags.boolean({
      char: 'P',
      description: 'Sets selected profile name as the profile name in ~/.aws/credentials when using --credentials flag.',
      dependsOn: ['credentials'],
    }),
    json: Flags.boolean({
      default: false,
      description: 'Outputs credentials in json format.',
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
        json: flags.json,
      };

      const { credentials } = await getProfileCredentials(response.profile);

      if (flags.clipboard) {
        CliUx.ux.action.start('❯ Saving to clipboard');
        clipboardOutput(credentials);
        CliUx.ux.action.stop();
      } else if (flags.credentials) {
        CliUx.ux.action.start('❯ Writing to credentials file');
        if (flags.preserve) {
          writeCredentialsFile(credentials, response.profile);
        }
        writeCredentialsFile(credentials);
        CliUx.ux.action.stop();
      } else {
        await output(this, input);
      }
    } catch (error: any) {
      this.error(error.message);
    }
  }
}
