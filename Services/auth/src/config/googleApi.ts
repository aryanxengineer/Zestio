import { google } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./dotenv.js";

export const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET as string,
  "authmessage",
);
