get-sso-creds
=============

CLI tool to get AWS SSO temporary credentials.

[![Version](https://img.shields.io/npm/v/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![Downloads/week](https://img.shields.io/npm/dw/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![License](https://img.shields.io/npm/l/get-sso-creds.svg)](https://github.com/JamesChung/get-sso-creds/blob/main/LICENSE)

<!-- toc -->
* [Prerequisites](#Prerequisites)
* [Usage](#usage)
<!-- tocstop -->

# Prerequisites
<!-- prerequisites -->
AWS CLI v2

https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
<!-- prerequisitesstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g get-sso-creds
```

```sh-session
CLI tool to get AWS SSO temporary credentials.

USAGE
  $ gsc [COMMAND]

COMMANDS
  get     get AWS SSO credentials
  help    display help for gsc
  list    interactive AWS SSO credentials retrieval
  signin  initiates AWS SSO signin
```

### `get` command

```sh-session
get AWS SSO credentials

USAGE
  $ gsc get

OPTIONS
  -h, --help
  -p, --profile=profile  [default: default]

EXAMPLE
  $ gsc get --profile my-profile
  Profile: my-profile
  Credentials expire at: 6:20:24 PM

  export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
  export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
  export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>
```

### `list` command

```sh-sesson
interactive AWS SSO credentials retrieval

USAGE
  $ gsc list

OPTIONS
  -h, --help

EXAMPLE
  $ gsc list
  ? Select a profile: (Use arrow keys)
  ❯ default 
  dev
  prod
  personal

...
Profile: <profile>
Credentials expire at: 6:06:34 AM

export AWS_ACCESS_KEY_ID=<Access Key ID>
export AWS_SECRET_ACCESS_KEY=<Secret Access Key>
export AWS_SESSION_TOKEN=<Session Token>
```

### `signin` command

```sh-sesson
initiates AWS SSO signin

USAGE
  $ gsc signin

OPTIONS
  -h, --help
  -p, --profile=profile  [default: default]

EXAMPLE
  $ gsc signin --profile your-profile
  Signing in... ⣽
```

<!-- usagestop -->
