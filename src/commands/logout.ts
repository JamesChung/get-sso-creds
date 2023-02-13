import { Command, Flags, ux } from "@oclif/core";
import { logout } from "../lib/logout-helper";

export default class LogOut extends Command {
  static description = "Initiates AWS SSO logout.";

  static examples = [
    `$ gscreds logout --profile your-profile
Logging out... ⣽`,
  ];

  static flags = {
    help: Flags.help(),
    profile: Flags.string({
      char: "p",
      default: "default",
      description: "Profile name to use for logout.",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(LogOut);

    try {
      ux.action.start("❯ Logging out");
      await logout(flags.profile);
      ux.action.stop();
    } catch (error: any) {
      ux.action.stop("failed");
      this.error(error.message);
    }
  }
}
