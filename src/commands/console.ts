import { Command, Flags, CliUx } from "@oclif/core";
import {
  getProfileCredentials,
  getCredentialsFromCredentialsFile,
} from "../lib/creds-helper";
import { generateLoginURL } from "../lib/console-helper";
import { getCredProfiles, getProfileNames } from "../lib/profile-helper";
import { ICredentials } from "../lib";
import * as inquirer from "inquirer";
import * as open from "open";

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
<<<<<<< HEAD
      char: "b",
      options: ["chrome", "firefox", "edge"],
      description: `Opens designated browser over the system default.\n
      Suggested values: ["chrome", "firefox", "edge"]`,
=======
      char: 'b',
      options: ['chrome', 'firefox', 'edge'],
      description: `Opens designated browser over the system default.\n
      Suggested values: ["chrome", "firefox", "edge"]`
>>>>>>> main
    }),
  };

  static args = [];

  private credentials!: ICredentials;
  private loginURL!: string;

  public async run(): Promise<void> {
    const { flags } = await this.parse(Console);

<<<<<<< HEAD
    let browser: string | readonly string[] = "";

    switch (flags.browser) {
      case "chrome":
        browser = open.apps.chrome;
        break;
      case "firefox":
        browser = open.apps.firefox;
        break;
      case "edge":
=======
    let browser: string | readonly string[] = '';

    switch (flags.browser) {
      case 'chrome':
        browser = open.apps.chrome;
        break;
      case 'firefox':
        browser = open.apps.firefox;
        break;
      case 'edge':
>>>>>>> main
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

<<<<<<< HEAD
      CliUx.ux.action.start("❯ Opening Console");
      if (profileType === "config") {
        this.credentials = (await getProfileCredentials(profile)).credentials;
      }
      if (profileType === "credentials") {
=======
      CliUx.ux.action.start('❯ Opening Console');
      if (profileType === 'config') {
        this.credentials = (await getProfileCredentials(profile)).credentials;
      }
      if (profileType === 'credentials') {
>>>>>>> main
        this.credentials = getCredentialsFromCredentialsFile(profile);
      }
      this.loginURL = await generateLoginURL(this.credentials);
      await open(this.loginURL, {
        newInstance: true,
        wait: true,
        app: {
          name: browser,
<<<<<<< HEAD
        },
      }).then((result) => {
        if (typeof result.exitCode === "number" && result.exitCode > 0) {
          throw new Error("Could not open browser.");
=======
        }
      }).then(result => {
        if (typeof result.exitCode === 'number' && result.exitCode > 0) {
          throw new Error('Could not open browser.');
>>>>>>> main
        }
      });
      CliUx.ux.action.stop();
    } catch (error: any) {
      CliUx.ux.action.stop("failed");
      this.error(error.message);
    }
  }
}
