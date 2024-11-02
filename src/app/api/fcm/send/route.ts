import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { getAccessToken } from "../../../../../utils/google/oauth";
import ErrorHandler from "../../../../../utils/common/error-handler";

interface NotificationPayload {
    message: {
      topic?: string;
      token?: string;
      notification: {
        title: string;
        body: string;
      };
      data?: any;
      android?: {
        notification: {
          click_action: string;
          body: string;
        };
      };
      apns?: {
        payload: {
          aps: {
            category: string;
          };
        };
      };
    };
  }



export async function GET() {
  return NextResponse.json("Welcome to Nonton API for FCM");
}

export async function POST(req: NextRequest) {
  const payload: NotificationPayload = await req.json();

  if (!payload.message.notification.body || !payload.message.notification.title) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
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

    // Create the response object
    const res = NextResponse.json({
      success: true,
      data: response.data,
    });

    // Set CORS headers to allow all origins
    res.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.headers.set("Access-Control-Allow-Methods", "POST"); // Allow methods
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow headers

    return res;
  } catch (error) {
    return ErrorHandler(error, "Error sending notification");
  }
}
