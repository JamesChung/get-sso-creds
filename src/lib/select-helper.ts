import { readdirSync, readFile } from 'fs';
import { homedir } from 'os';
import { exec } from 'child_process';
import { ICredentials, ISsoConfig } from './interfaces';

async function readFilePromise(file: string | Buffer): Promise<string> {
  const path = `${homedir()}/.aws/sso/cache/${file}`;
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
}

export async function getSsoConfigs(): Promise<ISsoConfig[]> {
  const cacheFiles = readdirSync(`${homedir()}/.aws/sso/cache`, 'utf-8');
  const ssoConfigs: ISsoConfig[] = [];
  const promiseFiles: Promise<string>[] = [];

  for (let cacheFile of cacheFiles) {
    promiseFiles.push(readFilePromise(cacheFile));
  }
  const filesData = await Promise.all(promiseFiles);
  for (let data of filesData) {
    const jsonData = JSON.parse(data);
    if ((new Date(jsonData.expiresAt)).getTime() > (new Date()).getTime()) {
      if ('startUrl' in jsonData) {
        ssoConfigs.push(jsonData);
      }
    }
  }
  return ssoConfigs;
}

async function ssoListAccounts(accessToken: string): Promise<string> {
  const command = `aws sso list-accounts --access-token ${accessToken} --output json`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }
      if (stdout) {
        resolve(stdout);
      }
    });
  });
}

export async function getAccounts(ssoConfigs: ISsoConfig[]) {
  const accounts = new Map();
  for (let ssoConfig of ssoConfigs) {
    const accountList = JSON.parse(await ssoListAccounts(ssoConfig.accessToken));
    accounts.set(ssoConfig.startUrl, accountList);
  }
  return accounts;
}

export function getToken(ssoUrl: string, ssoConfigs: ISsoConfig[]): string {
  let token: string = '';
  for (let ssoConfig of ssoConfigs) {
    if (ssoConfig.startUrl === ssoUrl) {
      token = ssoConfig.accessToken;
    }
  }
  return token;
}

async function getSsoRoles(accountId: string, accessToken: string): Promise<string> {
  const command = `aws sso list-account-roles --account-id ${accountId} --access-token ${accessToken} --output json`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }
      if (stdout) {
        resolve(stdout);
      }
    });
  });
}

export async function getRoles(accountId: string, accessToken: string) {
  return JSON.parse(await getSsoRoles(accountId, accessToken)).roleList.map((value: any) => value.roleName);
}

async function getSsoRoleCredentials(roleName: string, accountId: string, accessToken: string): Promise<string> {
  const command = `aws sso get-role-credentials --role-name ${roleName} --account-id ${accountId} --access-token ${accessToken} --output json`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }
      if (stdout) {
        resolve(stdout);
      }
    });
  });
}

export async function getRoleCredentials(roleName: string, accountId: string, accessToken: string): Promise<ICredentials> {
  const {
    accessKeyId,
    secretAccessKey,
    sessionToken,
    expiration
  } = JSON.parse(await getSsoRoleCredentials(roleName, accountId, accessToken)).roleCredentials;

  const creds: ICredentials = {
    accessKeyId,
    secretAccessKey,
    sessionToken,
    expiration,
  };

  return creds;
}