import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export async function revokeToken(token) {
  try {
    await client.revokeToken(token);
    console.log("Token revoked");
  } catch (error) {
    console.error("Error revoking token:", error.message);
  }
}
