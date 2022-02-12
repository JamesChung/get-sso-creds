import { exec } from 'child_process';
import { isProfile } from './profile-helper';
import * as chalk from 'chalk';

export async function logout(profile: string): Promise<unknown> {
  if (!isProfile(profile)) {
    throw new Error(`${chalk.redBright(profile)} is not a valid profile`);
  }

  return new Promise((resolve, reject) => {
    exec(`aws sso logout --profile ${profile}`, (error, stdout, stderr) => {
      if (stderr) {
        reject(new Error(stderr));
      }
      if (stdout) {
        resolve(stdout);
      }
    });
  });
}
