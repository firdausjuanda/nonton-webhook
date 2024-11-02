
import { google } from "googleapis";

export async function getAccessToken() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL, // Store your client email in environment variables
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'), // Store your private key in environment variables
      },
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });
  
    const accessToken = await auth.getAccessToken();
    return accessToken;
}