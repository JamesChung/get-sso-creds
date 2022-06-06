import { exec } from "child_process";
import { ICredentials } from "../lib/interfaces";

export async function assumeRole(
  roleArn: string,
  sessionName: string,
  profile: string
): Promise<ICredentials> {
  return new Promise((resolve, reject) => {
    exec(
      `aws sts assume-role --role-arn ${roleArn} --role-session-name ${sessionName} --profile ${profile}`,
      (error, stdout, stderr) => {
        if (stderr) {
          reject(new Error(stderr));
        }
        if (stdout) {
          const parsedValue = JSON.parse(stdout);
          const returnValue: ICredentials = {
            accessKeyId: parsedValue.Credentials.AccessKeyId,
            secretAccessKey: parsedValue.Credentials.SecretAccessKey,
            sessionToken: parsedValue.Credentials.SessionToken,
            expiration: parsedValue.Credentials.Expiration,
          };
          resolve(returnValue);
        }
      }
    );
  });
}
