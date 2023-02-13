"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const output_helper_1 = require("../lib/output-helper");
const creds_helper_1 = require("../lib/creds-helper");
const select_helper_1 = require("../lib/select-helper");
const inquirer_1 = require("inquirer");
const chalk = require("chalk");
class Select extends core_1.Command {
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
        help: core_1.Flags.help(),
        credentials: core_1.Flags.boolean({
            char: "c",
            default: false,
            description: "Writes credentials to ~/.aws/credentials (will use [default] as the profile name if --set-as flag is not used).",
            exclusive: ["clipboard"],
        }),
        clipboard: core_1.Flags.boolean({
            char: "b",
            default: false,
            description: "Writes credentials to clipboard.",
            exclusive: ["credentials"],
        }),
        json: core_1.Flags.boolean({
            default: false,
            description: "Outputs credentials in json format.",
        }),
        "set-as": core_1.Flags.string({
            char: "n",
            dependsOn: ["credentials"],
            description: "Desired name of profile when setting credentials via --credentials flag.",
        }),
        profile: core_1.Flags.string({
            char: "p",
            default: "default",
            description: "Desired SSO config profile to use.",
        }),
    };
    async run() {
        const { flags } = await this.parse(Select);
        try {
            core_1.ux.action.start("❯ Loading");
            const ssoConfigs = await (0, select_helper_1.getSSOConfigs)();
            const urlChoices = [];
            for (let ssoConfig of ssoConfigs) {
                urlChoices.push(ssoConfig.startUrl);
            }
            if (urlChoices.length === 0) {
                throw new Error(`sign in first ${chalk.red("(aws sso login | gscreds login)")}`);
            }
            const accounts = await (0, select_helper_1.getAccounts)(ssoConfigs, flags.profile);
            core_1.ux.action.stop();
            const ssoUrlResponse = await inquirer_1.default.prompt([
                {
                    name: "ssoUrl",
                    message: "Select an SSO url:",
                    type: "list",
                    choices: urlChoices,
                },
            ]);
            const ssoAccountNames = accounts
                .get(ssoUrlResponse.ssoUrl)
                .accountList.map((value) => {
                return `${value.accountName} | ${value.emailAddress} | ${value.accountId}`;
            });
            const ssoAccountResponse = await inquirer_1.default.prompt([
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
            const accessToken = (0, select_helper_1.getToken)(ssoUrlResponse.ssoUrl, ssoConfigs);
            const ssoRoleNames = await (0, select_helper_1.getRoles)(accountValue, accessToken, flags.profile);
            const ssoRoleResponse = await inquirer_1.default.prompt([
                {
                    name: "ssoRole",
                    message: "Select an SSO role:",
                    type: "list",
                    choices: ssoRoleNames,
                },
            ]);
            const roleCreds = await (0, select_helper_1.getRoleCredentials)(ssoRoleResponse.ssoRole, accountValue, accessToken, flags.profile);
            if (flags.clipboard) {
                core_1.ux.action.start("❯ Saving to clipboard");
                (0, output_helper_1.clipboardOutput)(roleCreds);
                core_1.ux.action.stop();
            }
            else if (flags.credentials) {
                core_1.ux.action.start("❯ Writing to credentials file");
                (0, creds_helper_1.writeCredentialsFile)(roleCreds, flags["set-as"]);
                core_1.ux.action.stop();
                return;
            }
            else {
                await (0, output_helper_1.roleOutput)(this, ssoRoleResponse.ssoRole, roleCreds, flags);
            }
        }
        catch (error) {
            core_1.ux.action.stop("failed");
            this.error(`${error.message}\nOr specify a profile via --profile="profile-name", you may have not specified a valid SSO profile from your ~/.aws/config file. Will attempt to use default profile if flag is not set.`);
        }
    }
}
exports.default = Select;
