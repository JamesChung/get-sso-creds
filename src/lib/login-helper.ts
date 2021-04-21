import { exec } from 'child_process';
import { isProfile } from './profile-helper';
import * as chalk from 'chalk';

export async function login(profile: string) {
  if (!isProfile(profile)) {
    throw `${chalk.redBright(profile)} is not a valid profile`;
  }

  return new Promise((resolve, reject) => {
    exec(`aws sso login --profile ${profile}`, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }
      if (stdout) {
        resolve(stdout);
      }
    });
  });
}
