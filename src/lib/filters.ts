// Genre type for type safety
export type Genre =
    | 'Afrobeat'
    | 'Alternative'
    | 'Ambient'
    | 'Blues'
    | 'Classical'
    | 'Country'
    | 'Dance'
    | 'Electronic'
    | 'Folk'
    | 'Funk'
    | 'Gospel'
    | 'Hip-Hop'
    | 'House'
    | 'Indie'
    | 'Jazz'
    | 'Latin'
    | 'Metal'
    | 'Pop'
    | 'Punk'
    | 'R&B'
    | 'Rap'
    | 'Reggae'
    | 'Rock'
    | 'Soul'
    | 'Techno'
    | 'Trap'
    | 'World';


export type Platform = 'spotify' | 'youtube music' | 'apple music' | 'soundcloud';

export const platforms: readonly Platform[] = [
    'spotify',
    'youtube music',
    'apple music',
    'soundcloud'
] as const;

// URL-safe mapping for platforms (for query params)
export const platformUrlMap: Record<Platform, string> = {
    'spotify': 'spotify',
    'youtube music': 'youtube-music',
    'apple music': 'apple-music',
    'soundcloud': 'soundcloud'
};

// Reverse mapping: URL-safe value -> Platform
export const platformUrlReverseMap: Record<string, Platform> = {
    'spotify': 'spotify',
    'youtube-music': 'youtube music',
    'apple-music': 'apple music',
    'soundcloud': 'soundcloud'
};

// Helper functions to convert between URL-safe and Platform values
export function platformToUrl(platform: Platform): string {
    return platformUrlMap[platform];
}

export function urlToPlatform(urlValue: string): Platform | null {
    return platformUrlReverseMap[urlValue] || null;
}


// Array of all available genres (for UI dropdowns, validation, etc.)
export const genres: readonly Genre[] = [
    'Afrobeat',
    'Alternative',
    'Ambient',
    'Blues',
    'Classical',
    'Country',
    'Dance',
    'Electronic',
    'Folk',
    'Funk',
    'Gospel',
    'Hip-Hop',
    'House',
    'Indie',
    'Jazz',
    'Latin',
    'Metal',
    'Pop',
    'Punk',
    'R&B',
    'Rap',
    'Reggae',
    'Rock',
    'Soul',
    'Techno',
    'Trap',
    'World'
] as const;

// Type guard to check if a string is a valid genre
export function isValidGenre(value: string): value is Genre {
    return genres.includes(value as Genre);
}


export function isValidPlatform(value: string): value is Platform {
    return platforms.includes(value as Platform);
}