export interface VideoData {
    id?: string,
    thumbnail?: string,
    videoId?: string,
    title?: string,
    duration?: string,
    publishedAt?: string,
    categoryId?: string,
    channelId?: string,
    channelTitle?: string,
    tags?: string,
    supabase?: any,
    type?: string,
    actionData?: VideoActionType,
    currentlyCampaigned?: boolean,
}

export type VideoActionType = {
    reaction?: {
      count?: number,
      reacted?: boolean,
    };
    comment?: {
      count? : number,
      commented?: boolean,
    };
    share?: {
      count?: number,
      shared?: boolean,
    };
    repost?: {
      count?: number,
      reposted?: boolean,
    };
  }