import { NextResponse, NextRequest } from "next/server";
import ErrorHandler from "../../../../../utils/common/error-handler";
import { sendMail } from "../../../../../utils/common/email";
import { email_template } from "../../../../../email/email_template";
import { EMAIL_RECEIVER } from "../../../../../constants/email";

interface UserBankType {
    id: string;
    user_id: string;
    bank_id: string;
    bank_account: string;
    full_name: string;
    email: string;
    is_verified?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    bank_name: string;
    note?: string;
}

export async function POST(req: NextRequest) {
    const payload: UserBankType = await req.json();
  
    if (!payload.user_id || !payload.bank_id || !payload.bank_account || !payload.full_name) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }
  
    try {
      await sendMail({
        sendTo: [payload.email], 
        template: email_template.BANK_SUBMITTED.template, 
        subject: email_template.BANK_SUBMITTED.subject, 
        replacement: {
            bankName: payload?.bank_name, 
            title: email_template.BANK_SUBMITTED.subject,
            message: email_template.BANK_SUBMITTED.message,
            accountNumber: payload?.bank_account, 
            accountHolder: payload?.full_name,
            note: payload.note ? payload.note.toString() : "In-progress",
        }});

      const response = await sendMail({
        sendTo: EMAIL_RECEIVER.ADMIN, 
        template: email_template.BANK_SUBMITTED_TO_ADMIN.template, 
        subject: email_template.BANK_SUBMITTED_TO_ADMIN.subject, 
        replacement: {
            bankName: payload?.bank_name, 
            title: email_template.BANK_SUBMITTED_TO_ADMIN.subject,
            message: email_template.BANK_SUBMITTED_TO_ADMIN.message,
            accountNumber: payload?.bank_account, 
            accountHolder: payload?.full_name,
            note: payload.note ? payload.note.toString() : "In-progress",
        }});
  
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