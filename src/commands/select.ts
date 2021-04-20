import { Command, flags } from '@oclif/command';
import { roleOutput } from '../lib/output-helper';
import { writeCredentialsFile } from '../lib/creds-helper';
import {
  getSsoConfigs,
  getAccounts,
  getToken,
  getRoles,
  getRoleCredentials
} from '../lib/select-helper';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

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
    help: flags.help({ char: 'h', description: undefined }),
    credentials: flags.boolean({ char: 'c', description: 'writes credentials to ~/.aws/credentials as default', default: false }),
    quiet: flags.boolean({ name: 'quiet', char: 'q', default: false }),
    json: flags.boolean({ name: 'json', default: false }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Select);

    try {
      const ssoConfigs = await getSsoConfigs();
      const urlChoices: string[] = [];
      for (let ssoConfig of ssoConfigs) {
        urlChoices.push(ssoConfig.startUrl);
      }

      if (urlChoices.length === 0) {
        throw '❯ Sign in first (aws sso login | gsc login)';
      }

      const accounts = await getAccounts(ssoConfigs);

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
        cli.action.start('Writing to credentials file');
        writeCredentialsFile(roleCreds);
        cli.action.stop();
        return;
      }
      roleOutput(this, ssoRoleResponse.ssoRole, roleCreds, flags);
    } catch (error) {
      this.log(error);
    }
  }
}
