import { Command, Flags, CliUx } from "@oclif/core";
import { roleOutput, clipboardOutput } from "../lib/output-helper";
import { writeCredentialsFile } from "../lib/creds-helper";
import {
  getSSOConfigs,
  getAccounts,
  getToken,
  getRoles,
  getRoleCredentials,
} from "../lib/select-helper";
import * as inquirer from "inquirer";
import * as chalk from "chalk";

export default class Select extends Command {
  static description = "Get AWS SSO credentials via AWS SSO.";

  static examples = [
    `$ gscreds select
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
    help: Flags.help(),
    credentials: Flags.boolean({
      char: "c",
      default: false,
      description:
        "Writes credentials to ~/.aws/credentials (will use [default] as the profile name if --set-as flag is not used).",
      exclusive: ["clipboard"],
    }),
    clipboard: Flags.boolean({
      char: "b",
      default: false,
      description: "Writes credentials to clipboard.",
      exclusive: ["credentials"],
    }),
    json: Flags.boolean({
      default: false,
      description: "Outputs credentials in json format.",
    }),
    "set-as": Flags.string({
      char: "n",
      dependsOn: ["credentials"],
      description:
        "Desired name of profile when setting credentials via --credentials flag.",
    }),
    profile: Flags.string({
      char: "p",
      default: "default",
      description: "Desired SSO config profile to use.",
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(Select);

    try {
      CliUx.ux.action.start("❯ Loading");

      const ssoConfigs = await getSSOConfigs();
      const urlChoices: string[] = [];
      for (let ssoConfig of ssoConfigs) {
        urlChoices.push(ssoConfig.startUrl);
      }

      if (urlChoices.length === 0) {
        throw new Error(
          `sign in first ${chalk.red("(aws sso login | gscreds login)")}`
        );
      }

      const accounts = await getAccounts(ssoConfigs, flags.profile);

      CliUx.ux.action.stop();

      const ssoUrlResponse = await inquirer.prompt([
        {
          name: "ssoUrl",
          message: "Select an SSO url:",
          type: "list",
          choices: urlChoices,
        },
      ]);

      const ssoAccountNames = accounts
        .get(ssoUrlResponse.ssoUrl)
        .accountList.map((value: any) => {
          return `${value.accountName} | ${value.emailAddress} | ${value.accountId}`;
        });

      const ssoAccountResponse = await inquirer.prompt([
        {
          name: "ssoAccount",
          message: "Select an SSO account:",
          type: "list",
          choices: ssoAccountNames,
        },
      ]);

      const accountValue = ssoAccountResponse.ssoAccount
        .split("|")
        .pop()
        .trim();
      const accessToken = getToken(ssoUrlResponse.ssoUrl, ssoConfigs);
      const ssoRoleNames = await getRoles(
        accountValue,
        accessToken,
        flags.profile
      );

      const ssoRoleResponse = await inquirer.prompt([
        {
          name: "ssoRole",
          message: "Select an SSO role:",
          type: "list",
          choices: ssoRoleNames,
        },
      ]);

      const roleCreds = await getRoleCredentials(
        ssoRoleResponse.ssoRole,
        accountValue,
        accessToken,
        flags.profile
      );

      if (flags.clipboard) {
        CliUx.ux.action.start("❯ Saving to clipboard");
        clipboardOutput(roleCreds);
        CliUx.ux.action.stop();
      } else if (flags.credentials) {
        CliUx.ux.action.start("❯ Writing to credentials file");
        writeCredentialsFile(roleCreds, flags["set-as"]);
        CliUx.ux.action.stop();
        return;
      } else {
        await roleOutput(this, ssoRoleResponse.ssoRole, roleCreds, flags);
      }
    } catch (error: any) {
      CliUx.ux.action.stop("failed");
      this.error(
        `${error.message}\nOr specify a profile via --profile="profile-name", you may have not specified a valid SSO profile from your ~/.aws/config file. Will attempt to use default profile if flag is not set.`
      );
    }
  }
}
