import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { google } from "googleapis";

async function getAccessToken() {
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

export async function GET() {
  return NextResponse.json("Welcome to Nonton API for FCM");
}

export async function POST(req: NextRequest) {
  const { fcmToken, title, body, topic, data } = await req.json();

  if (!title || !body) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }
  let payload;

  if(topic){
    payload = {
        message: {
          topic: topic,
          notification: {
            title,
            body,
          },
          data: data
        },
      };
  } else {
    payload = {
        message: {
          token: fcmToken,
          notification: {
            title,
            body,
          },
          data: data
        },
      };
  }

  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      "https://fcm.googleapis.com/v1/projects/nonton-77b29/messages:send", // Replace with your project ID
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    // console.error("Error sending notification:", error.response?.data || error.message);
    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        // Access additional properties like error.response if needed
        return NextResponse.json(
          {
            success: false,
            message: error.response?.data?.error?.message || "Error sending notification",
          },
          { status: 500 }
        );
    } else if (error instanceof Error) {
        console.error("General error:", error.message);
        return NextResponse.json(
          {
            success: false,
            message: error || "Error sending notification",
          },
          { status: 500 }
        );
    } else {
        console.error("Unexpected error:", error);
        return NextResponse.json(
          {
            success: false,
            message: error || "Error sending notification",
          },
          { status: 500 }
        );
      }
  }
}
