import { Command, Flags, ux } from "@oclif/core";
import { login } from "../lib/login-helper";

export default class LogIn extends Command {
  static description = "Initiates AWS SSO login.";

  static examples = [
    `$ gscreds login --profile your-profile
Logging in... ⣽`,
  ];

  static flags = {
    help: Flags.help(),
    profile: Flags.string({
      char: "p",
      default: "default",
      description: "Profile name to use for login.",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(LogIn);

    try {
      ux.action.start("❯ Logging in");
      await login(flags.profile);
      ux.action.stop();
    } catch (error: any) {
      ux.action.stop("failed");
      this.error(error.message);
    }
  }
}
