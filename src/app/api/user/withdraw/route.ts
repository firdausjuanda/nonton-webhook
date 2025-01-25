import { NextResponse, NextRequest } from "next/server";
import ErrorHandler from "../../../../../utils/common/error-handler";
import { sendMail } from "../../../../../utils/common/email";
import { email_template } from "../../../../../email/email_template";
import { EMAIL_RECEIVER } from "../../../../../constants/email";

interface UserWithdrawType {
  user_id: string,
  email: string,
  code: string,
  currency: string,
  amount: string,
  status: string,
  type:string,
  payout_method:string,
  full_name?: string,
  paypal_email?: string,
  bank_name?: string,
  bank_account?: string,
  note?: string,
}

export async function POST(req: NextRequest) {
    console.log("Withdrawal request received", new Date())
    const payload: UserWithdrawType = await req.json();
  
    if (!payload.email || !payload.amount || !payload.currency || !payload.code || !payload.status || !payload.type || !payload.payout_method) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }
  
    try {
      let response: any;
      switch (payload.payout_method) {
        case "paypal":
          await sendMail({
            sendTo: [payload.email], 
            template: email_template.WITHDRAW_SUBMITTED_PAYPAL.template, 
            subject: email_template.WITHDRAW_SUBMITTED_PAYPAL.subject, 
            replacement: {
                paypalEmail: payload?.paypal_email, 
                title: email_template.WITHDRAW_SUBMITTED_PAYPAL.subject,
                message: email_template.WITHDRAW_SUBMITTED_PAYPAL.message,
                status: payload?.status, 
                amount: payload?.amount,
                type: payload?.type,
                currency: payload?.currency,
                note: payload.note ? payload.note.toString() : "",
            }});
    
          response = await sendMail({
            sendTo: EMAIL_RECEIVER.ADMIN, 
            template: email_template.WITHDRAW_SUBMITTED_PAYPAL_TO_ADMIN.template, 
            subject: email_template.WITHDRAW_SUBMITTED_PAYPAL_TO_ADMIN.subject, 
            replacement: {
                paypalEmail: payload?.paypal_email, 
                title: email_template.WITHDRAW_SUBMITTED_PAYPAL_TO_ADMIN.subject,
                message: email_template.WITHDRAW_SUBMITTED_PAYPAL_TO_ADMIN.message,
                status: payload?.status, 
                amount: payload?.amount,
                type: payload?.type,
                currency: payload?.currency,
                note: payload.note ? payload.note.toString() : "",
            }});
          break;
          
        default:
          await sendMail({
            sendTo: [payload.email], 
            template: email_template.WITHDRAW_SUBMITTED.template, 
            subject: email_template.WITHDRAW_SUBMITTED.subject, 
            replacement: {
                bankName: payload?.bank_name, 
                title: email_template.WITHDRAW_SUBMITTED.subject,
                message: email_template.WITHDRAW_SUBMITTED.message,
                accountNumber: payload?.bank_account, 
                accountHolder: payload?.full_name,
                status: payload?.status, 
                amount: payload?.amount,
                type: payload?.type,
                currency: payload?.currency,
                note: payload.note ? payload.note.toString() : "",
            }});
    
          response = await sendMail({
            sendTo: EMAIL_RECEIVER.ADMIN, 
            template: email_template.WITHDRAW_SUBMITTED_TO_ADMIN.template, 
            subject: email_template.WITHDRAW_SUBMITTED_TO_ADMIN.subject, 
            replacement: {
                bankName: payload?.bank_name, 
                title: email_template.WITHDRAW_SUBMITTED_TO_ADMIN.subject,
                message: email_template.WITHDRAW_SUBMITTED_TO_ADMIN.message,
                accountNumber: payload?.bank_account, 
                accountHolder: payload?.full_name,
                status: payload?.status, 
                amount: payload?.amount,
                type: payload?.type,
                currency: payload?.currency,
                note: payload.note ? payload.note.toString() : "",
            }});
          break;
      }
  
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