import { NextResponse, NextRequest } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { ResponseData } from "../../../../../response";

export async function GET() {
    return NextResponse.json("Welcome to Nonton API");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = createClient();
        console.log(body.external_id);
        console.log(body.status);
        const { error } = await supabase.from('transactions').update({"status": body.status}).eq('code', body.external_id);
        const {data:transaction, error: errorTransaction} = await supabase.from('transactions').select().eq('code', body.external_id).single();
        if(error){
            const response: ResponseData<null> = {
                success: false,
                message: JSON.stringify(error.message) ?? '',
                data: null,
            };
            return NextResponse.json(response, { status: 500 });
        } else {
            if(errorTransaction){
                const response: ResponseData<null> = {
                    success: false,
                    message: JSON.stringify(errorTransaction.message) ?? '',
                    data: null,
                };
                return NextResponse.json(response, { status: 500 });
            }
            const response: ResponseData<null> = {
                success: true,
                message: 'OK',
                data: transaction,
            };
            return NextResponse.json(response, { status: 200 });
        }

    } catch (error) {
        console.log(error);
        const response: ResponseData<null> = {
            success: false,
            message: JSON.stringify(error) ?? '',
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}