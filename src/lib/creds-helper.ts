import { homedir } from 'os';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { STS } from 'aws-sdk';
import { ICredentials, IUserIdentity, IProfile } from './interfaces';
import { isProfile } from './profile-helper';
import Command from '@oclif/command';
const ini = require('ini');

export async function initCredentials(profile: string = 'default'): Promise<IUserIdentity> {
  if (!isProfile(profile)) {
    throw `> [ ${profile} ] is not a valid profile.`;
  }

  const runStsCommand = `aws sts get-caller-identity --profile ${profile} --output json`;

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
  const credsList: ICredentials[] = [];
  const credfiles = readdirSync(`${homedir()}/.aws/cli/cache`, 'utf-8');
  for (let credFile of credfiles) {
    // TODO: Make this async
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

export function writeCredentialsFile(credentials: ICredentials) {
  const credentialsFilePath = `${homedir()}/.aws/credentials`;
  if (!existsSync(credentialsFilePath)) {
    writeFileSync(credentialsFilePath, '[default]', {encoding: 'utf-8'});
  }
  const parsedCredentials = ini.parse(readFileSync(credentialsFilePath, 'utf-8'));
  parsedCredentials.default.aws_access_key_id = credentials.accessKeyId;
  parsedCredentials.default.aws_secret_access_key = credentials.secretAccessKey;
  parsedCredentials.default.aws_session_token = credentials.sessionToken;
  const encodedCredentials = ini.encode(parsedCredentials);
  writeFileSync(credentialsFilePath, encodedCredentials, {encoding: 'utf-8'});
}

export function clearCredentials(command: Command) {
  const credentialsFilePath = `${homedir()}/.aws/credentials`;
  if (!existsSync(credentialsFilePath)) {
    command.log('> credentials file does not exit');
  }
  const parsedCredentials = ini.parse(readFileSync(credentialsFilePath, 'utf-8'));
  parsedCredentials.default.aws_access_key_id = '';
  parsedCredentials.default.aws_secret_access_key = '';
  parsedCredentials.default.aws_session_token = '';
  const encodedCredentials = ini.encode(parsedCredentials);
  writeFileSync(credentialsFilePath, encodedCredentials, {encoding: 'utf-8'});
}
