import { ICredentials } from "./interfaces";
import axios from "axios";

export async function generateLoginURL(
  credentials: ICredentials
): Promise<string> {
  const awsFederationBaseURL: string =
    "https://signin.aws.amazon.com/federation";
  const creds = stringifyCredentials(credentials);

  const federationURL = new URL(awsFederationBaseURL);
  federationURL.searchParams.append("Action", "getSigninToken");
  federationURL.searchParams.append("DurationSeconds", "43200");
  federationURL.searchParams.append("Session", creds);

  const token = await getFederatedToken(federationURL);

  const loginURL = new URL(awsFederationBaseURL);
  loginURL.searchParams.append("Action", "login");
  loginURL.searchParams.append(
    "Destination",
    "https://console.aws.amazon.com/"
  );
  loginURL.searchParams.append("SigninToken", token);
  loginURL.searchParams.append("Issuer", "https://example.com");

  return loginURL.toString();
}

function stringifyCredentials(credentials: ICredentials): string {
  const sessionCredentials = {
    sessionId: credentials.accessKeyId,
    sessionKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
  };
  return JSON.stringify(sessionCredentials);
}

async function getFederatedToken(url: URL): Promise<string> {
  try {
    const response = await axios.get(url.toString());
    if (response.status === 200) {
      return response.data?.SigninToken;
    }
    throw new Error("Could not get sign in token...");
  } catch (error) {
    throw error;
  }
}
