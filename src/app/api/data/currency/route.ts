import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(req: NextRequest) {
    console.log("ere");
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("Unauthorized!")
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const supabase = createClient();
    // Call your API
    const response = await axios.get('https://openexchangerates.org/api/latest.json', {
        params: {
            app_id: '6b64aa4d9a84406ba9b44fe8ec9a964f'
        }
    });

    try {
        const { rates } = response.data;
        const date = new Date(); // Current date and time
        const formattedDate = date.toISOString(); // Convert to ISO 8601 format
    
        // Transform the rates object into an array of rows
        const rows = Object.entries(rates).map(([currency, value]) => ({
          currency: currency,
          value,
          last_update: formattedDate, // Add the timestamp for consistency
        }));

        console.log(rows);
    
        // Upsert the data into the `exchange_rates` table
        const { error } = await supabase
          .from('currency_rates')
          .upsert(rows, { onConflict: 'currency' });
    
        if (error) {
          console.error('Error upserting rates:', error);
        } else {
          console.log('Rates upserted successfully!');
        }

        return NextResponse.json("Cron Job ran at: "+ new Date());
      } catch (error) {
        console.error('Unexpected error:', error);
      }

}