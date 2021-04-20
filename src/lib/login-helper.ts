import { exec } from 'child_process';
import { isProfile } from './profile-helper';

export async function login(profile: string) {
  if (!isProfile(profile)) {
    throw `> [ ${profile} ] is not a valid profile.`;
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
