export interface InstagramMedia {
    id: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
    timestamp: string;
    children?: {
        data: InstagramMedia[];
    };
}

export interface InstagramProfile {
    id: string;
    username: string;
    account_type: string;
    media_count: number;
    followers_count?: number; // Requires business discovery or heuristic
    follows_count?: number;   // Requires business discovery
    profile_picture_url?: string; // Not always available directly via basic display without trickery or business acct
    biography?: string;       // Not available in Basic Display, need Business Discovery
    website?: string;
}

export interface InstagramApiResponse {
    profile: InstagramProfile;
    media: InstagramMedia[];
    error?: string;
}
