import { NextResponse, NextRequest } from "next/server";
import { getAccessToken } from "../../../../../utils/google/oauth";
import axios from "axios";
import { createClient } from "../../../../../utils/supabase/server";
import { VideoData } from "./type";
import { parseDuration, upsertYoutubeVideos } from "../../../../../functions/videos";

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("Unauthorized!")
        return new NextResponse('Unauthorized', { status: 401 });
    }
    
    console.log("##############################################")
    console.log("#                                            #")
    console.log("#         CRON DATA FETCH EXCECUTED          #")
    console.log("#                                            #")
    console.log("##############################################")

    // const payload: any = await req.json();
  
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos", // Replace with your project ID
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            part: 'snippet,contentDetails,status',
            chart: 'mostPopular',
            // videoCategoryId: "",
            maxResults: 50,
            // regionCode: locale.regionCode ?? "ID",
            regionCode: "ID",
          },
        }
      );

      if(response.status = 200){

        const videos: VideoData[] = [];

        if (response.data && response.data.items && response.data.items.length > 0) {
        response.data.items.forEach((item: any) => {
            const snippet = item.snippet;
            const contentDetails = item.contentDetails;

            // Parse the ISO8601 duration string (e.g., PT21M44S) into minutes
            const durationInMinutes = parseDuration(contentDetails.duration);
            
            // Determine if the video is "long" or "short" based on the duration
            const type = durationInMinutes > 1 ? 'long' : 'short';

            // Push the video data into the videos array
            videos.push({
            id: item.id,
            thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
            videoId: item.id,
            title: snippet.title,
            duration: contentDetails.duration, // e.g., PT21M44S
            publishedAt: snippet.publishedAt,
            categoryId: snippet.categoryId,
            channelId: snippet.channelId,
            channelTitle: snippet.channelTitle,
            tags: snippet.tags?.join(", ") || "", // Join tags array into a string
            type, // Set the video type as "long" or "short"
            // actionData: undefined, // Replace or populate this field as needed
            currentlyCampaigned: false, // Replace or update this field based on your conditions
            });
        });
        }
        upsertYoutubeVideos(videos);
      }

    return NextResponse.json("Cron Job ran at: "+ new Date());

    } catch (e) {
        if(axios.isAxiosError(e)){
            const msg = e.response?.data?.error?.message;
            return NextResponse.json(
                { success: false, message: `Error: ${msg ?? "Something went wrong"}` },
                { status: 500 }
              );
        }
        return NextResponse.json(
            { success: false, message: `Error: ${e}` },
            { status: 500 }
          );
    }
}
