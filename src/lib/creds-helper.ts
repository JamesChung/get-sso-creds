import { homedir } from "os";
import {
  readFile,
  readFileSync,
  readdirSync,
  writeFileSync,
  appendFileSync,
  existsSync,
} from "fs";
import { exec } from "child_process";
import { STS } from "aws-sdk";
import { ICredentials, IUserIdentity, IProfile } from "./interfaces";
import { getProfileInfo, isProfile } from "./profile-helper";
import * as chalk from "chalk";
import { encode, parse } from "ini";

export async function initCredentials(
  profile: string = "default"
): Promise<IUserIdentity> {
  if (!isProfile(profile)) {
    throw new Error(`${chalk.redBright(profile)} is not a valid profile`);
  }

  const runStsCommand = `aws sts get-caller-identity --profile ${profile} --output json`;

  return new Promise((resolve, reject) => {
    exec(runStsCommand, (error, stdout, stderr) => {
      if (stderr) {
        reject(new Error(stderr));
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

async function readCredsFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
}

export async function getCredentialsFromCacheFiles(): Promise<ICredentials[]> {
  const credsList: ICredentials[] = [];
  const credfileNames = readdirSync(`${homedir()}/.aws/cli/cache`, "utf-8");
  const credFilePromises: Promise<string>[] = [];
  for (let credFile of credfileNames) {
    credFilePromises.push(
      readCredsFile(`${homedir()}/.aws/cli/cache/${credFile}`)
    );
  }
  const credentialsList = await Promise.all(credFilePromises);
  for (let credData of credentialsList) {
    const creds = JSON.parse(credData).Credentials;
    const credentials: ICredentials = {
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.SessionToken,
      expiration: creds.Expiration,
    };
    if (new Date(credentials.expiration).getTime() > new Date().getTime()) {
      credsList.push(credentials);
    }
  }
  return credsList;
}

export async function getCredentials(profile: IProfile): Promise<ICredentials> {
  const credsList = await getCredentialsFromCacheFiles();
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
  throw new Error(`no valid credentials`);
}

export function writeCredentialsFile(
  credentials: ICredentials,
  profile: string = "default"
): void {
  const credentialsFilePath = `${homedir()}/.aws/credentials`;
  if (!existsSync(credentialsFilePath)) {
    writeFileSync(credentialsFilePath, "[default]", { encoding: "utf-8" });
  }
  let parsedCredentials = parse(readFileSync(credentialsFilePath, "utf-8"));
  if (!parsedCredentials[profile]) {
    appendFileSync(credentialsFilePath, `[${profile}]`, { encoding: "utf-8" });
    parsedCredentials = parse(readFileSync(credentialsFilePath, "utf-8"));
  }
  parsedCredentials[profile].aws_access_key_id = credentials.accessKeyId;
  parsedCredentials[profile].aws_secret_access_key =
    credentials.secretAccessKey;
  parsedCredentials[profile].aws_session_token = credentials.sessionToken;
  const encodedCredentials = encode(parsedCredentials);
  writeFileSync(credentialsFilePath, encodedCredentials, { encoding: "utf-8" });
}

export function clearCredentials(profile: string = "default"): void {
  const credentialsFilePath = `${homedir()}/.aws/credentials`;
  if (!existsSync(credentialsFilePath)) {
    throw new Error(`credentials file does not exist`);
  }
  const parsedCredentials = parse(readFileSync(credentialsFilePath, "utf-8"));
  if (parsedCredentials[profile]) {
    delete parsedCredentials[profile];
    const encodedCredentials = encode(parsedCredentials);
    writeFileSync(credentialsFilePath, encodedCredentials, {
      encoding: "utf-8",
    });
    return;
  }
  throw new Error(`${chalk.red(profile)} does not exist`);
}

export function getCredentialsFromCredentialsFile(
  profile: string = "default"
): ICredentials {
  const credentialsFilePath = `${homedir()}/.aws/credentials`;
  if (!existsSync(credentialsFilePath)) {
    throw new Error(`credentials file does not exist`);
  }
  const parsedCredentials = parse(readFileSync(credentialsFilePath, "utf-8"));
  if (parsedCredentials[profile]) {
    return {
      accessKeyId: parsedCredentials[profile]?.aws_access_key_id,
      secretAccessKey: parsedCredentials[profile]?.aws_secret_access_key,
      sessionToken: parsedCredentials[profile]?.aws_session_token,
      expiration: "",
    };
  }
  throw new Error(`${chalk.red(profile)} does not exist`);
}

export async function getProfileCredentials(
  profile: string = "default"
): Promise<{ profileInfo: IProfile; credentials: ICredentials }> {
  const profileInfo: IProfile = getProfileInfo(profile);
  profileInfo.identity = await initCredentials(profileInfo.profileName);
  const credentials: ICredentials = await getCredentials(profileInfo);
  return { profileInfo, credentials };
}
