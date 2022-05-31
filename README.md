# get-sso-creds

CLI tool to get AWS SSO temporary credentials.

[![Version](https://img.shields.io/npm/v/get-sso-creds)](https://npmjs.org/package/get-sso-creds)
[![License](https://img.shields.io/npm/l/get-sso-creds)](https://github.com/JamesChung/get-sso-creds/blob/main/LICENSE)

* [Prerequisites](#Prerequisites)
* [Usage](#usage)

## Prerequisites

In order for `get-sso-creds` to work properly AWS CLI v2 must be installed beforehand.

AWS CLI v2

<https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html>

## Install

```sh-session
npm install -g get-sso-creds
```

## Examples

> When developing application or scripts locally, AWS SDKs like the JavaScript `aws-sdk` or Python `boto3` will load credentials either from environment variables or the `~/.aws/credentials` file. This tool was designed to make that experience less of a hassle by allowing the user to either decide to export credentials as environment variables or by storing them in the `~/.aws/credentials` file as either `default` or as any given profile name.

---

> Will write credentials to ~/.aws/credentials as [default]
```sh-session
gscreds select -c
```

> Will write credentials to ~/.aws/credentials as [helloworld]
```sh-session
gscreds select -c --set-as="helloworld"
```

> Will write credentials as export statements to your clipboard which you can simply paste into your shell and press enter.
```sh-session
gscreds select -b
```

> Uses credentials from the "default" profile to assume the role "arn:aws:iam::996942091142:role/test-role" with default values for session-name etc. (Review `assume` documentation to see default values).

```sh-session
gscreds assume --role="arn:aws:iam::996942091142:role/test-role"
```

> Uses credentials from the "dev" profile to assume the role "arn:aws:iam::996942091142:role/test-role" then sets those newly assumed credentials as the profile [helloworld] in "~/.aws/credentials".

```sh-session
gscreds assume --role="arn:aws:iam::996942091142:role/test-role" --profile="dev" -c --set-as="helloworld"
```

## Commands

  <!-- commands -->
* [`gscreds assume`](#gscreds-assume)
* [`gscreds clear`](#gscreds-clear)
* [`gscreds console`](#gscreds-console)
* [`gscreds get`](#gscreds-get)
* [`gscreds login`](#gscreds-login)
* [`gscreds logout`](#gscreds-logout)
* [`gscreds ls`](#gscreds-ls)
* [`gscreds select`](#gscreds-select)

## `gscreds assume`

Assumes AWS Role.

```
USAGE
  $ gscreds assume [--help] [--json] [-n <value> [-c | -b]] (-s <value> -r <value>) [-p <value>]

FLAGS
  -b, --clipboard             Writes credentials to clipboard.
  -c, --credentials           Writes credentials to ~/.aws/credentials (will use [default] as the profile name if
                              --set-as flag is not used).
  -n, --set-as=<value>        Desired name of profile when setting credentials via --credentials flag.
  -p, --profile=<value>       [default: default] Desired SSO config profile to use.
  -r, --role=<value>          (required) ARN of the role to assume.
  -s, --session-name=<value>  [default: gscreds-session] Desired name for the role session.
  --help                      Show CLI help.
  --json                      Outputs credentials in json format.

DESCRIPTION
  Assumes AWS Role.

EXAMPLES
  $ gscreds assume --role arn:aws:iam::996942091142:role/test-role

  $ gscreds assume --role arn:aws:iam::996942091142:role/test-role -c --set-as 'my-profile'
```

_See code: [dist/commands/assume.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/assume.ts)_

## `gscreds clear`

Clears selected credentials in ~/.aws/credentials.

```
USAGE
  $ gscreds clear [--help]

FLAGS
  --help  Show CLI help.

DESCRIPTION
  Clears selected credentials in ~/.aws/credentials.

EXAMPLES
  $ gscreds clear
  ? Select a profile: (Use arrow keys)
  ❯ default
    personal
```

_See code: [dist/commands/clear.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/clear.ts)_

## `gscreds console`

Opens AWS Console for a selected profile.

```
USAGE
  $ gscreds console [--help] [-b chrome|firefox|edge]

FLAGS
  -b, --browser=<option>  Opens designated browser over the system default.

                          Suggested values: ["chrome", "firefox", "edge"]
                          <options: chrome|firefox|edge>
  --help                  Show CLI help.

DESCRIPTION
  Opens AWS Console for a selected profile.

EXAMPLES
  $ gscreds console
  ? Select a profile: (Use arrow keys)
  ❯ default
    personal
```

_See code: [dist/commands/console.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/console.ts)_

## `gscreds get`

Get AWS SSO credentials from existing profiles in ~/.aws/config.

```
USAGE
  $ gscreds get [--help] [-P [-c | -b]] [--json]

FLAGS
  -P, --preserve     Sets selected profile name as the profile name in ~/.aws/credentials when using --credentials flag.
  -b, --clipboard    Writes credentials to clipboard.
  -c, --credentials  Writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag
                     is not used).
  --help             Show CLI help.
  --json             Outputs credentials in json format.

DESCRIPTION
  Get AWS SSO credentials from existing profiles in ~/.aws/config.

EXAMPLES
  $ gscreds get
  ? Select a profile: (Use arrow keys)
  ❯ default
    dev
    prod
    personal
  Profile: my-profile
  Credentials expire at: 6:20:24 PM
  export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
  export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
  export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>
```

_See code: [dist/commands/get.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/get.ts)_

## `gscreds login`

Initiates AWS SSO login.

```
USAGE
  $ gscreds login [--help] [-p <value>]

FLAGS
  -p, --profile=<value>  [default: default] Profile name to use for login.
  --help                 Show CLI help.

DESCRIPTION
  Initiates AWS SSO login.

EXAMPLES
  $ gscreds login --profile your-profile
  Logging in... ⣽
```

_See code: [dist/commands/login.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/login.ts)_

## `gscreds logout`

Initiates AWS SSO logout.

```
USAGE
  $ gscreds logout [--help] [-p <value>]

FLAGS
  -p, --profile=<value>  [default: default] Profile name to use for logout.
  --help                 Show CLI help.

DESCRIPTION
  Initiates AWS SSO logout.

EXAMPLES
  $ gscreds logout --profile your-profile
  Logging out... ⣽
```

_See code: [dist/commands/logout.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/logout.ts)_

## `gscreds ls`

Lists profile names in ~/.aws/config or ~/.aws/credentials.

```
USAGE
  $ gscreds ls [--help]

FLAGS
  --help  Show CLI help.

DESCRIPTION
  Lists profile names in ~/.aws/config or ~/.aws/credentials.

EXAMPLES
  $ gscreds ls
  ? Select a file: (Use arrow keys)
  ❯ config
    credentials
```

_See code: [dist/commands/ls.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/ls.ts)_

## `gscreds select`

Get AWS SSO credentials via AWS SSO.

```
USAGE
  $ gscreds select [--help] [--json] [-n <value> [-c | -b]] [-p <value>]

FLAGS
  -b, --clipboard        Writes credentials to clipboard.
  -c, --credentials      Writes credentials to ~/.aws/credentials (will use [default] as the profile name if --set-as
                         flag is not used).
  -n, --set-as=<value>   Desired name of profile when setting credentials via --credentials flag.
  -p, --profile=<value>  [default: default] Desired SSO config profile to use.
  --help                 Show CLI help.
  --json                 Outputs credentials in json format.

DESCRIPTION
  Get AWS SSO credentials via AWS SSO.

EXAMPLES
  $ gscreds select
  ? Select an SSO url: (Use arrow keys)
  ❯ https://alpha.awsapps.com/start
    https://delta.awsapps.com/start
  ? Select an SSO account:
  ❯ Log archive | ctlogs@google.com | 111111111111
    test-alpha | testalpha@yahoo.com | 222222222222
  ? Select an SSO role: (Use arrow keys)
  ❯ AWSServiceCatalogEndUserAccess
    AWSAdministratorAccess
   ...
```

_See code: [dist/commands/select.ts](https://github.com/JamesChung/get-sso-creds/blob/v6.2.0/dist/commands/select.ts)_
<!-- commandsstop -->
