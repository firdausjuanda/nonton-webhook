import axios from "axios";
import * as nodeCron from "node-cron";
import notifyTrends from "../../functions/videos";

let isCronInitialized = false;
const url = process.env.APP_ENV == 'production' ? process.env.PRD_URL : process.env.APP_ENV == 'local' ? process.env.LOCAL_URL : process.env.DEV_URL;

export default function cron () {
    if (isCronInitialized) {
        console.log("Cron job is already initialized.");
        return;
      }
    console.log('Initializing cron job...'); 
    isCronInitialized= true
    updateYouTubeTrends(); 
    dailyNotifyUser();  
}

function updateYouTubeTrends(){
    nodeCron.schedule("*/30 * * * *", async () => {
        console.log("Cron-node triggered.... status: ", isCronInitialized);
        if(isCronInitialized){
            console.log("Cron-node running....");
            try {
                // Call your API
                const response = await axios.get(`${url}/api/data/youtube`, {headers: {Authorization: `Bearer ${process.env.CRON_SECRET}`}});
                console.log("API Response:", response.data);

            } catch (e) {
                if(axios.isAxiosError(e)){
                    const msg = e.response?.data?.error?.message;
                    console.log(`Error: ${msg ?? "Something went wrong"}`)
                }
            }
        }
    })
}

function dailyNotifyUser(){
    nodeCron.schedule("0 12 * * *", async () => {
        console.log("Cron job dailyNotifyUser triggered.... status: ", isCronInitialized);
        if(isCronInitialized){
            console.log("Cron job dailyNotifyUser running....");
            try {
                // Call your API
                await notifyTrends();

            } catch (e) {
                if(axios.isAxiosError(e)){
                    const msg = e.response?.data?.error?.message;
                    console.log(`Error: ${msg ?? "Something went wrong"}`)
                }
            }
        }
    });
}