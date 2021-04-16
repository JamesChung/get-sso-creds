import { Command, flags } from '@oclif/command';
import { exec } from 'child_process';

interface IUserIdentity {
  userId: string;
  account: string;
  arn: string;
}

interface ICreds {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
}

class GetSsoCreds extends Command {
  static description = 'Get AWS SSO credentials';

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h', description: ''}),
  };

  static args = [];

  async runSts(): Promise<IUserIdentity> {
    return new Promise((resolve, reject) => {
      exec('aws sts get-caller-identity', (error, stdout, stderr) => {
        if (stderr) {
          reject(stderr);
        }
        if (stdout) {
          const { UserId, Account, Arn } = JSON.parse(stdout);
          const userIdentity: IUserIdentity = {
            userId: UserId,
            account: Account,
            arn: Arn,
          };
          resolve(userIdentity);
        }
      });
    });
  }

  async getCreds(path: string = '$HOME/.aws/cli/cache'): Promise<ICreds> {
    return new Promise((resolve, reject) => {
      exec(`ls -t ${path} | head -1 | xargs -I {} cat "${path}/{}"`, (error, stdout, stderr) => {
        if (stderr) {
          reject(stderr);
        }
        if (stdout) {
          const { Credentials } = JSON.parse(stdout);
          const creds: ICreds = {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
          };
          resolve(creds);
        }
      });
    });
  }

  async run() {
    const {args, flags} = this.parse(GetSsoCreds)

    try {
      const identity = await this.runSts();
      const creds = await this.getCreds();
      this.log(`Assumed role: ${identity.arn}`);
      this.log(`Credentials expire at: ${(new Date(creds.expiration)).toLocaleTimeString()}\n`);
      this.log(`export AWS_ACCESS_KEY_ID=${creds.accessKeyId}`);
      this.log(`export AWS_SECRET_ACCESS_KEY=${creds.secretAccessKey}`);
      this.log(`export AWS_SESSION_TOKEN=${creds.sessionToken}`);
    }
    catch (error) {
      console.error(error);
    }
  }
}

export = GetSsoCreds
