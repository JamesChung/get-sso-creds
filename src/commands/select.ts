import { Command, Flags, CliUx } from '@oclif/core';
import { roleOutput } from '../lib/output-helper';
import { writeCredentialsFile } from '../lib/creds-helper';
import {
  getSSOConfigs,
  getAccounts,
  getToken,
  getRoles,
  getRoleCredentials,
} from '../lib/select-helper';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';

export default class Select extends Command {
  static description = 'get AWS SSO credentials by interactive AWS SSO selection';

  static examples = [
    `$ gsc select
? Select an SSO url: (Use arrow keys)
❯ https://alpha.awsapps.com/start
 https://delta.awsapps.com/start
? Select an SSO account:
❯ Log archive | ctlogs@google.com | 111111111111
 test-alpha | testalpha@yahoo.com | 222222222222
? Select an SSO role: (Use arrow keys)
❯ AWSServiceCatalogEndUserAccess
 AWSAdministratorAccess
 ...`,
  ];

  static flags = {
    help: Flags.string({ char: 'h', description: 'Help' }),
    credentials: Flags.boolean({ char: 'c', description: 'writes credentials to ~/.aws/credentials (will use default as the profile name if --profile-name flag is not used)' }),
    quiet: Flags.boolean({
      name: 'quiet',
      char: 'q',
      default: false
    }),
    json: Flags.boolean({
      name: 'json',
      default: false
    }),
    'profile-name': Flags.string({
      helpValue: 'name',
      char: 'n',
      dependsOn: ['credentials'],
      description: 'name of custom profile when using --credentials flag'
    }),
  }

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Select);

    try {
      CliUx.ux.action.start('❯ Loading');

      const ssoConfigs = await getSSOConfigs();
      const urlChoices: string[] = [];
      for (let ssoConfig of ssoConfigs) {
        urlChoices.push(ssoConfig.startUrl);
      }

      if (urlChoices.length === 0) {
        throw new Error(`sign in first ${chalk.red('(aws sso login | gsc login)')}`);
      }

      const accounts = await getAccounts(ssoConfigs);

      CliUx.ux.action.stop();

      const ssoUrlResponse = await inquirer.prompt([{
        name: 'ssoUrl',
        message: 'Select an SSO url:',
        type: 'list',
        choices: urlChoices
      }]);

      const ssoAccountNames = accounts.get(ssoUrlResponse.ssoUrl).accountList.map((value: any) => {
        return `${value.accountName} | ${value.emailAddress} | ${value.accountId}`;
      });

      const ssoAccountResponse = await inquirer.prompt([{
        name: 'ssoAccount',
        message: 'Select an SSO account:',
        type: 'list',
        choices: ssoAccountNames
      }]);

      const accountValue = ssoAccountResponse.ssoAccount.split('|').pop().trim();
      const accessToken = getToken(ssoUrlResponse.ssoUrl, ssoConfigs);
      const ssoRoleNames = await getRoles(accountValue, accessToken);

      const ssoRoleResponse = await inquirer.prompt([{
        name: 'ssoRole',
        message: 'Select an SSO role:',
        type: 'list',
        choices: ssoRoleNames
      }]);

      const roleCreds = await getRoleCredentials(ssoRoleResponse.ssoRole, accountValue, accessToken);
      if (flags.credentials) {
        CliUx.ux.action.start('❯ Writing to credentials file');
        writeCredentialsFile(roleCreds, flags['profile-name']);
        CliUx.ux.action.stop();
        return;
      }
      roleOutput(this, ssoRoleResponse.ssoRole, roleCreds, flags);
    } catch (error: any) {
      CliUx.ux.action.stop('failed');
      this.error(error.message);
    }
  }
}
