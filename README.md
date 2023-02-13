# get-sso-creds

CLI tool to get AWS SSO temporary credentials.

[![Version](https://img.shields.io/npm/v/get-sso-creds)](https://npmjs.org/package/get-sso-creds)
[![License](https://img.shields.io/npm/l/get-sso-creds)](https://github.com/JamesChung/get-sso-creds/blob/main/LICENSE)

- [Prerequisites](#Prerequisites)
- [Usage](#usage)

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

<!-- commandsstop -->
