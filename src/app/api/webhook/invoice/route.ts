import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
// import { ResponseData } from "../../../../../response";

const RUMAHSEKOLAH_PREFIXES = ["RS-PRO-", "RS-SCH-"];

export async function GET() {
  return NextResponse.json("Welcome to Nonton API");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const externalId = body?.external_id;
    const status = body?.status;

    if (!externalId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "external_id and status are required",
          data: null,
        },
        { status: 400 },
      );
    }

    // Forward RumahSekolah payments to its own webhook handler.
    const isRumahSekolahPayment = RUMAHSEKOLAH_PREFIXES.some((prefix) =>
      externalId.startsWith(prefix),
    );

    if (isRumahSekolahPayment) {
      const rumahsekolahWebhookUrl =
        process.env.RUMAHSEKOLAH_WEBHOOK_URL;

      if (!rumahsekolahWebhookUrl) {
        console.error("RUMAHSEKOLAH_WEBHOOK_URL is not configured");

        return NextResponse.json(
          {
            success: false,
            message: "RumahSekolah webhook URL is not configured",
            data: null,
          },
          { status: 500 },
        );
      }

      const forwardedHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const callbackToken = req.headers.get("x-callback-token");
      const webhookId = req.headers.get("webhook-id");

      if (callbackToken) {
        forwardedHeaders["x-callback-token"] = callbackToken;
      }

      if (webhookId) {
        forwardedHeaders["webhook-id"] = webhookId;
      }

      const response = await fetch(rumahsekolahWebhookUrl, {
        method: "POST",
        headers: forwardedHeaders,
        body: JSON.stringify(body),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error(
          "RumahSekolah webhook failed:",
          response.status,
          responseText,
        );

        return NextResponse.json(
          {
            success: false,
            message: "RumahSekolah webhook forwarding failed",
            data: null,
          },
          { status: 502 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Forwarded to RumahSekolah",
        data: null,
      });
    }

    // Existing Nonton payment handling.
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status })
      .eq("code", externalId);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: updateError.message,
          data: null,
        },
        { status: 500 },
      );
    }

    const {
      data: transaction,
      error: transactionError,
    } = await supabase
      .from("transactions")
      .select()
      .eq("code", externalId)
      .single();

    if (transactionError) {
      return NextResponse.json(
        {
          success: false,
          message: transactionError.message,
          data: null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OK",
        data: transaction,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Xendit webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Webhook processing failed",
        data: null,
      },
      { status: 500 },
    );
  }
}
