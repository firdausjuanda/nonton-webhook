import axios from "axios";
import { NextResponse } from "next/server";

export default function ErrorHandler(error: any, defaultMessage: string = "Unexpected error") : NextResponse {

    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data?.error);
        return NextResponse.json(
          {
            success: false,
            message: error.response?.data?.error?.message || error.response?.data?.error || defaultMessage,
          },
          {status: 500}
        );
    } else if (error instanceof Error) {
        console.error("General error:", error.message);
        return NextResponse.json(
          {
            success: false,
            message: error || defaultMessage,
          },
          { status: 500 }
        );
    } else {
        console.error("Unexpected error:", error);
        return NextResponse.json(
          {
            success: false,
            message: error || defaultMessage,
          },
          { status: 500}
        );
      }
}
