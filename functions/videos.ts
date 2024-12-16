import axios from "axios";
import { createClient } from "../utils/supabase/server"
import { VideoData } from "@/app/api/data/youtube/type";
import { NotificationTypeOptions } from "@/app/api/fcm/send/type";

const url = process.env.APP_ENV == 'production' ? process.env.PRD_URL : process.env.APP_ENV == 'local' ? process.env.LOCAL_URL : process.env.DEV_URL;

export default async function notifyTrends () {
    try {
        const supabase = createClient();
        const notified = await supabase.from("notified_videos").select("video_id").order("id", {ascending: false});
        // console.log(notified);
        if(notified.error){
           return console.log(notified.error.message);
        }
        if(notified.data && notified.data.length > 0){
            // const = notified.data[0].video_id;
            const exceptIds : string[] = [];
            for(const v of notified.data){
                exceptIds.push(v.video_id);
            }
            // console.log(exceptIds);
            const { data, error } = await supabase.from('youtube_videos')
            .select()
            .or(`videoId.not.in.(${exceptIds.join(',')})`)
            .eq("type", "long")
            .or('currentlyCampaigned.eq.false,currentlyCampaigned.is.null')
            .order("publishedAt", {ascending: false})
            .limit(1);
            if(!error){
                if(data && data!.length > 0){
                    const headers = {
                        // "Authorization": `Bearer ${tokens}`,
                        Accept: '*/*',
                        "Content-Type": "application/json",
                      };
                    const video : VideoData = {};
                    // thumbnail: thumbnail!,
                    // duration: duration!,
                    // publishedAt: publishedAt!,
                    // title: title!,
    
                    // video.id = data[0].id
                    video.videoId = data[0].videoId
                    video.title = data[0].title
                    video.duration = data[0].duration
                    video.categoryId = data[0].categoryId
                    video.thumbnail = data[0].thumbnail
                    video.publishedAt = data[0].publishedAt
                    video.channelId = data[0].channelId
                    const videoDataString = encodeURIComponent(JSON.stringify(video));
                    // console.log(`/video/${video.videoId}?category=${video.categoryId}&videoData=${videoDataString}`)
                    const payload = {
                        message: {
                        //   token: "dXh0HTldRvS-rrN1eBinxJ:APA91bFGraQJ18DsrfoeP0ZELttz9gm9RvI1owN5gquREKrpHjOs3d6NjakEavd2idAVRxKa_vx2KbieN8mBp8xHvMeazazoxcJ6ZX2nbB-915KFx-0L-WM",
                          topic: 'broadcast',
                          notification: {
                            title: "Yuk tonton!",
                            body: video.title,
                            // body: video.title,
                            image: video.thumbnail
                          },
                          data: {
                            id: video.videoId,
                            asset_url: video.thumbnail,
                            // profile: chann,
                            type: NotificationTypeOptions.video_you_might_like,
                            // profile: "https://lh3.googleusercontent.com/a/ACg8ocKeidubzuH6nc3mZ8CtEWyQM4yZhKNdbF8yqtbkjBz5AjFfwS2G=s96-c",
                            link: `/video/${video.videoId}?category=${video.categoryId}&videoData=${videoDataString}`
                          }
                        }
                      } 
                    await axios.post(`${url}/api/fcm/send`, payload, {headers: headers});
                    // console.log("API Response:", response.data);
                    await supabase.from("notified_videos").upsert({video_id:video.videoId}, {onConflict: "video_id", ignoreDuplicates: false});
                    return;
                } else return console.log("No data");
            } else return console.log(error.message);
        }
    } catch (error) {
        console.log(error)
    }
} 