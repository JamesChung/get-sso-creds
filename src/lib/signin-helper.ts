import { exec } from 'child_process';

export async function signin(profile: string) {
  return new Promise((resolve, reject) => {
    exec(`aws sso login --profile ${profile}`, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }
      if (stdout) {
        resolve(stdout);
      }
    });
  })
}
