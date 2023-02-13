import { Command, Flags, ux } from "@oclif/core";
import { getCredProfiles } from "../lib/profile-helper";
import { clearCredentials } from "../lib/creds-helper";
import inquirer from "inquirer";

export default class Clear extends Command {
  static description = "Clears selected credentials in ~/.aws/credentials.";

  static examples = [
    `$ gscreds clear
? Select a profile: (Use arrow keys)
❯ default
  personal`,
  ];

  static flags = {
    help: Flags.help(),
  };

  public async run(): Promise<void> {
    try {
      const response = await inquirer.prompt([
        {
          name: "profile",
          message: "Select a profile:",
          type: "list",
          choices: getCredProfiles(),
        },
      ]);
      ux.action.start("❯ Clearing");
      clearCredentials(response.profile);
      ux.action.stop();
    } catch (error: any) {
      ux.action.stop("failed");
      this.error(error.message);
    }
  }
}
