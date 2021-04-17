get-sso-creds
=============

Exports AWS SSO credentials to your terminal session.

[![Version](https://img.shields.io/npm/v/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![Downloads/week](https://img.shields.io/npm/dw/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![License](https://img.shields.io/npm/l/get-sso-creds.svg)](https://github.com/JamesChung/get-sso-creds/LICENSE)

<!-- toc -->
* [Usage](#usage)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g get-sso-creds

# If you just type gsc it will default to your default profile
$ gsc
Profile: default
Credentials expire at: 6:06:34 AM

export AWS_ACCESS_KEY_ID=<Access Key ID>
export AWS_SECRET_ACCESS_KEY=<Secret Access Key>
export AWS_SESSION_TOKEN=<Session Token>


# If you want to specify a profile use the profile flag
$ gsc --profile your-profile
Profile: your-profile
Credentials expire at: 6:06:34 AM

export AWS_ACCESS_KEY_ID=<Access Key ID>
export AWS_SECRET_ACCESS_KEY=<Secret Access Key>
export AWS_SESSION_TOKEN=<Session Token>


# Version number
$ gsc -v

# Help
$ gsc -h

...
```
<!-- usagestop -->
