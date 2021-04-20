import { Command, flags } from '@oclif/command';
import { roleOutput } from '../lib/output-helper';
import {
  getSsoConfigs,
  getAccounts,
  getToken,
  getRoles,
  getRoleCredentials
} from '../lib/list-sso-helper';
import * as inquirer from 'inquirer';

export default class ListSso extends Command {
  static description = 'interactive AWS SSO selection';

  static examples = [
    `$ gsc list-sso
? Select an SSO url: (Use arrow keys)
❯ https://alpha.awsapps.com/start
 https://delta.awsapps.com/start
? Select an SSO account:
❯ Log archive | ctlogs@google.com | 111111111111
 test-alpha | testalpha@yahoo.com | 222222222222
 Audit | ctaudit@hotmail.com | 333333333333
 test-delta | testdelta@outlook.com | 444444444444
 test-beta | testbeta@aol.com | 555555555555
 test-epsilon | testepsilon@icloud.com | 666666666666
? Select an SSO role: (Use arrow keys)
❯ AWSServiceCatalogEndUserAccess
 AWSAdministratorAccess
 ...
 Credentials expire at: 6:06:34 AM

 export AWS_ACCESS_KEY_ID=<Access Key ID>
 export AWS_SECRET_ACCESS_KEY=<Secret Access Key>
 export AWS_SESSION_TOKEN=<Session Token>`,
  ];

  static flags = {
    help: flags.help({ char: 'h', description: undefined }),
    quiet: flags.boolean({ name: 'quiet', char: 'q', default: false }),
    json: flags.boolean({ name: 'json', default: false }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(ListSso);

    try {
      const ssoConfigs = await getSsoConfigs();
      const urlChoices: string[] = [];
      for (let ssoConfig of ssoConfigs) {
        urlChoices.push(ssoConfig.startUrl);
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
      roleOutput(this, ssoRoleResponse.ssoRole, roleCreds, flags);
    } catch (error) {
      this.log(error);
    }
  }
}
