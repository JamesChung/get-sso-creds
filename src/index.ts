import { Command, flags } from '@oclif/command';
import { STS } from 'aws-sdk';
import { readFileSync, readdirSync, readFile } from 'fs';
import { dirname } from 'path';
import { homedir } from 'os';
import { exec } from 'child_process';
const ini = require('ini');

interface IProfile {
  profileName: string;
  ssoStartUrl: string;
  ssoAccountId: string;
  ssoRoleName: string;
  region: string;
  identity: IUserIdentity;
}

interface IUserIdentity {
  userId: string;
  account: string;
  arn: string;
}

interface ICredentials {
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
    profile: flags.string({name: 'profile'}),
  };

  static args = [];

  isProfile(profile: any) {
    const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
    const iniConfig = ini.parse(configFile);
    let profiles = [];
    for (let prof in iniConfig) {
      profiles.push(prof.split(' ').pop());
    }
    if (profiles.includes(profile)) {
      return true;
    }
    return false;
  }

  getProfiles() {
    const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
    const iniConfig = ini.parse(configFile);
    const profiles: any = {};
    for (let config in iniConfig) {
      let confSplit = config.split(' ');
      let profileName = confSplit[confSplit.length - 1];
      const profileInfo: IProfile = {
        profileName: profileName,
        ssoStartUrl: iniConfig[config].sso_start_url,
        ssoAccountId: iniConfig[config].sso_account_id,
        ssoRoleName: iniConfig[config].sso_role_name,
        region: iniConfig[config].region,
        identity: {
          account: '',
          userId: '',
          arn: '',
        }
      };
      profiles[profileName] = profileInfo;
    }
    return profiles;
  }

  getProfileInfo(profile: string = 'default') {
    const profiles = this.getProfiles();
    return profiles[profile];
  }

  async initCredentials(profile: string = 'default'): Promise<IUserIdentity> {
    let runStsCommand = `aws sts get-caller-identity --profile ${profile}`;

    return new Promise((resolve, reject) => {
      exec(runStsCommand, (error, stdout, stderr) => {
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

  getCredentialsFromCredentialFiles(): ICredentials[] {
    let credsList: ICredentials[] = [];
    const credfiles = readdirSync(`${homedir()}/.aws/cli/cache`, 'utf-8');
    for (let credFile of credfiles) {
      const fileContents = JSON.parse(readFileSync(`${homedir()}/.aws/cli/cache/${credFile}`, 'utf-8'));
      const creds = fileContents.Credentials;
      const credentials: ICredentials = {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken,
        expiration: creds.Expiration,
      }
      if ((new Date(credentials.expiration)).getTime() > (new Date()).getTime()) {
        credsList.push(credentials);
      }
    }
    return credsList;
  }

  async getCredentials(profile: IProfile) {
    const credsList = this.getCredentialsFromCredentialFiles();
    const sts = new STS({ region: profile?.region });
    for (let creds of credsList) {
      sts.config.credentials = {
        accessKeyId: creds.accessKeyId,
        secretAccessKey: creds.secretAccessKey,
        sessionToken: creds.sessionToken,
      };
      const { UserId, Account, Arn } = await sts.getCallerIdentity().promise();
      const { userId, account, arn } = profile.identity;
      if (UserId === userId && Account === account && Arn == arn) {
        return creds;
      }
    }
    const emptyCreds: ICredentials = {
      accessKeyId: '',
      secretAccessKey: '',
      sessionToken: '',
      expiration: ''
    }
    return emptyCreds
  }

  getCallerIdentity(client: STS, profile: IProfile) {
    client.getCallerIdentity().promise();
  }

  async run() {
    const { flags } = this.parse(GetSsoCreds);

    try {
      if (flags.profile) {
        if (!this.isProfile(flags.profile)) {
          throw `> [${flags.profile}] is not a valid profile.`;
        }
      }
      const profileInfo = this.getProfileInfo(flags?.profile);
      profileInfo.identity = await this.initCredentials(profileInfo?.profileName);
      const credentials = await this.getCredentials(profileInfo);

      this.log(`Profile: ${profileInfo.profileName}`);
      this.log(`Credentials expire at: ${(new Date(credentials.expiration)).toLocaleTimeString()}\n`);
      this.log(`export AWS_ACCESS_KEY_ID=${credentials.accessKeyId}`);
      this.log(`export AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`);
      this.log(`export AWS_SESSION_TOKEN=${credentials.sessionToken}`);
    }
    catch (error) {
      console.error(error);
    }
  }
}

export = GetSsoCreds
