import { Command, Flags, ux } from "@oclif/core";
import { roleOutput, clipboardOutput } from "../lib/output-helper";
import { assumeRole } from "../lib/assume-helper";
import { writeCredentialsFile } from "../lib/creds-helper";

export default class Assume extends Command {
  static description = "Assumes AWS Role.";

  static examples = [
    `$ gscreds assume --role arn:aws:iam::996942091142:role/test-role`,
    `$ gscreds assume --role arn:aws:iam::996942091142:role/test-role -c --set-as 'my-profile'`,
  ];

  static flags = {
    help: Flags.help(),
    json: Flags.boolean({
      default: false,
      description: "Outputs credentials in json format.",
    }),
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
    "set-as": Flags.string({
      char: "n",
      dependsOn: ["credentials"],
      description:
        "Desired name of profile when setting credentials via --credentials flag.",
    }),
    role: Flags.string({
      char: "r",
      required: true,
      description: "ARN of the role to assume.",
    }),
    "session-name": Flags.string({
      char: "s",
      dependsOn: ["role"],
      default: "gscreds-session",
      description: "Desired name for the role session.",
    }),
    profile: Flags.string({
      char: "p",
      default: "default",
      description: "Desired SSO config profile to use.",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Assume);

    try {
      const roleCredentials = await assumeRole(
        flags.role,
        flags["session-name"],
        flags.profile
      );

      if (flags.clipboard) {
        ux.action.start("❯ Saving to clipboard");
        clipboardOutput(roleCredentials);
        ux.action.stop();
      } else if (flags.credentials) {
        ux.action.start("❯ Writing to credentials file");
        writeCredentialsFile(roleCredentials, flags["set-as"]);
        ux.action.stop();
      } else {
        await roleOutput(this, flags.role, roleCredentials, flags);
      }
    } catch (error: any) {
      ux.action.stop("failed");
      this.error(error.message);
    }
  }
}
