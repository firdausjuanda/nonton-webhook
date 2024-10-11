import { NextResponse, NextRequest } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import { ResponseData } from "../../../../../response";

export async function GET() {
    return NextResponse.json("Welcome to Nonton API");
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        let body = await req.json();
        let supabase = createClient();
        let {data, error} = await supabase.from('transactions').update("status", body.status).eq('code', body.external_id);
        if(error){
            const response: ResponseData<null> = {
                success: false,
                message: JSON.stringify(error.message) ?? '',
                data: null,
            };
            return NextResponse.json(response, { status: 500 });
        } else {
            const response: ResponseData<null> = {
                success: false,
                message: 'OK',
                data: data,
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