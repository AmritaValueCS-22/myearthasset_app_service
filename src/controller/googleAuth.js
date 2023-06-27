import express from "express";
import { OAuth2Client } from "google-auth-library";
import { Auth } from "../models/googleAuth.js";
import { revokeToken } from "../helpers/oAuth.js";
import { StatusCodes } from "http-status-codes";
import { randomUUID } from "crypto";

const app = express();
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function loginApi(req, res) {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      requiredAudience: CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();

    let user = await Auth.findOne({ email });
    if (!user) {
      user = new Auth({ name, email, picture, googleId: sub });
      await user.save();
    }

    res.status(StatusCodes.CREATED).json({
      user: {
        name,
        email,
        picture,
        sub,
        token: idToken,
        id: randomUUID(),
      },
      message: "Logged In Successfully",
      statuscode: 200,
    });
  } catch (err) {
    console.error(err, "hi");
    res.status(401).send("Invalid token");
  }
}
async function signOut(req, res) {
  const { idToken } = req.body;
  try {
    // Remove the access token from the database
    await Auth.updateOne({ idToken }, { $unset: { idToken: 1 } });

    // Revoke the access token using the Google API
    await revokeToken(idToken);

    res.json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Error signing out:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export { app, CLIENT_ID, loginApi, signOut };
export default app;
