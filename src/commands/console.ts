import { Command, Flags, ux } from "@oclif/core";
import {
  getProfileCredentials,
  getCredentialsFromCredentialsFile,
} from "../lib/creds-helper";
import { generateLoginURL } from "../lib/console-helper";
import { getCredProfiles, getProfileNames } from "../lib/profile-helper";
import { ICredentials } from "../lib";
import inquirer from "inquirer";
import open from "open";

export default class Console extends Command {
  static description = "Opens AWS Console for a selected profile.";

  static examples = [
    `$ gscreds console
? Select a profile: (Use arrow keys)
❯ default
  personal`,
  ];

  static flags = {
    help: Flags.help(),
    browser: Flags.string({
      char: "b",
      options: ["chrome", "firefox", "edge"],
      description: `Opens designated browser over the system default.\n
      Suggested values: ["chrome", "firefox", "edge"]`,
    }),
  };

  private credentials!: ICredentials;
  private loginURL!: string;

  public async run(): Promise<void> {
    const { flags } = await this.parse(Console);

    let browser: string | readonly string[] = "";

    switch (flags.browser) {
      case "chrome":
        browser = open.apps.chrome;
        break;
      case "firefox":
        browser = open.apps.firefox;
        break;
      case "edge":
        browser = open.apps.edge;
        break;
    }

    try {
      const { profileType } = await inquirer.prompt([
        {
          name: "profileType",
          message: "Select a file:",
          type: "list",
          choices: ["config", "credentials"],
        },
      ]);

      const { profile } = await inquirer.prompt([
        {
          name: "profile",
          message: "Select a profile:",
          type: "list",
          choices:
            profileType === "config" ? getProfileNames() : getCredProfiles(),
        },
      ]);

      ux.action.start("❯ Opening Console");
      if (profileType === "config") {
        this.credentials = (await getProfileCredentials(profile)).credentials;
      }
      if (profileType === "credentials") {
        this.credentials = getCredentialsFromCredentialsFile(profile);
      }
      this.loginURL = await generateLoginURL(this.credentials);
      await open(this.loginURL, {
        app: {
          name: browser,
        },
      }).then((result) => {
        if (typeof result.exitCode === "number" && result.exitCode > 0) {
          throw new Error("Could not open browser.");
        }
      });
      ux.action.stop();
    } catch (error: any) {
      ux.action.stop("failed");
      this.error(error.message);
    }
  }
}
