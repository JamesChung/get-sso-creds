import { homedir } from 'os';
import { readFileSync, readdirSync } from 'fs';
import { exec } from 'child_process';
import { STS } from 'aws-sdk';
import { ICredentials, IUserIdentity, IProfile } from './interfaces';

export async function initCredentials(profile: string = 'default'): Promise<IUserIdentity> {
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

export function getCredentialsFromCredentialFiles(): ICredentials[] {
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

export async function getCredentials(profile: IProfile): Promise<ICredentials> {
  const credsList = getCredentialsFromCredentialFiles();
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
  throw '> No valid credentials.';
}